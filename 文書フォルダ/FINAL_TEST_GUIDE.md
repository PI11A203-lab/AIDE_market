# セキュリティシステム 最終テストガイド

## 📋 テストチェックリスト

本ガイドは、セキュリティシステムの全機能が正常に動作することを確認する方法をまとめています。

---

## 1. DB 確認

### 1.1 インデックス確認
```bash
cd ECSite-server/GIT/ECSite-server
mysql -u root -p aide_market < database/migrations/test_security_system.sql
```

または 직접 MySQL에 접속하여:
```sql
-- 인덱스 確認
SHOW INDEX FROM security_events;
SHOW INDEX FROM ip_access_logs;
SHOW INDEX FROM ip_management;
SHOW INDEX FROM bot_detections;

-- セキュリティ設定確認
SELECT * FROM security_settings;

-- データ確認
SELECT COUNT(*) FROM security_events;
SELECT COUNT(*) FROM ip_access_logs;
SELECT COUNT(*) FROM bot_detections;
```

### 1.2 보안 설정 確認
```sql
SELECT * FROM security_settings;
```

**想定結果:**
- `auto_block_enabled`: true
- `bot_detection_threshold`: 80
- `max_login_attempts`: 5
- `block_duration_hours`: 24
- `rate_limit_enabled`: true/false
- その他の設定...

---

## 2. 基本セキュリティ機能のテスト

### 2.1 IP ブロックテスト

**Step 1: Super Admin で IP をブロック**
1. フロントエンド: http://localhost:3000/profile/super-admin/ip-management
2. IP Management タブで特定 IP をブロック
3. 例: `192.168.1.100` をブロック

**Step 2: ブロックした IP でリクエスト**
```bash
curl -X GET http://localhost:8081/api/products \
  -H "X-Forwarded-For: 192.168.1.100"
```

**想定結果:** `403 Forbidden`
```json
{
  "success": false,
  "error": "アクセスが拒否されました"
}
```

**確認項目:**
- DB の `security_events` テーブルに `ip_blocked` イベントが記録される
- `ip_management` テーブルに該当 IP が `is_blocked = 1` で記録される

---

### 2.2 ログイン失敗テスト

**テスト:**
```bash
# 5回連続ログイン失敗
for i in {1..5}; do
  echo "試行 $i"
  curl -X POST http://localhost:8081/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo ""
  sleep 1
done
```

**想定結果:**
- 1〜4回目: `401 Unauthorized`
- 5回目: `429 Too Many Requests` または `401 Unauthorized`（ブロック開始）
- 6回目以降: `429 Too Many Requests`（ブロック中）

**確認項目:**
- `security_events` テーブルに `login_failed` イベントが5件記録される
- `ip_management` テーブルで該当 IP が自動ブロックされる（`is_blocked = 1`）

---

### 2.3 ボット検出テスト

**テスト:**
```bash
# ボット User-Agent でリクエスト
curl -X GET http://localhost:8081/api/products \
  -H "User-Agent: bot/crawler"

# または
curl -X GET http://localhost:8081/api/products \
  -H "User-Agent: python-requests/2.28.0"
```

**想定結果:**
- 信頼度 90% 以上: `403 Forbidden`（即時ブロック）
- 信頼度 80〜89%: リクエストは通過するが `bot_detections` テーブルに記録

**確認項目:**
- `bot_detections` テーブルに記録される
- `security_events` テーブルに `bot_detected` イベントが記録される
- 信頼度 90% 以上の場合は `ip_management` テーブルで自動ブロック

---

## 3. Rate Limiting テスト

**テスト:**
```bash
# 빠르게 110번 リクエスト (API Rate Limit: 100회/분)
for i in {1..110}; do
  curl -X GET http://localhost:8081/api/products \
    -w "\nStatus: %{http_code}\n" \
    -o /dev/null -s
  if [ $((i % 10)) -eq 0 ]; then
    echo "リクエスト $i 完了"
  fi
done
```

**想定結果:**
- 1-100번: `200 OK`
- 101번 이후: `429 Too Many Requests`
- 응답에 `Retry-After` 헤더 포함

**確認 사항:**
- `security_events` 테이블에 `api_abuse` 이벤트 記録
- 110번 リクエスト 시 자동 차단 가능

---

## 4. 스크래핑 탐지 テスト

**テスト:**
```bash
# 빠르게 35개 상품 페이지 접근
for i in {1..35}; do
  curl -X GET "http://localhost:8081/api/products/$i" \
    -w "\nStatus: %{http_code}\n" \
    -o /dev/null -s
  sleep 0.1
done
```

**想定結果:**
- 1-29번: `200 OK` または `404 Not Found`
- 30번 이후: `403 Forbidden` (자동 차단)

**確認 사항:**
- `security_events` 테이블에 `scraping` 이벤트 記録
- `ip_management` 테이블에 자동 차단

---

## 5. 메모리 관리 テスト

### 5.1 메모리 통계 조회

**API 호출:**
```bash
# Super Admin 토큰 필요
curl -X GET http://localhost:8081/api/admin/security/memory/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**예상 응답:**
```json
{
  "success": true,
  "data": {
    "memoryUsage": {
      "rss": "150 MB",
      "heapTotal": "80 MB",
      "heapUsed": "60 MB",
      "external": "5 MB"
    },
    "storeSizes": {
      "loginAttempts": 3,
      "rateLimitStore": 45,
      "pageAccessLog": 12,
      "notFoundLog": 8,
      "ipBlockCache": 5,
      "locationCache": 120,
      "suspiciousActivities": 2
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5.2 메모리 강제 정리

**API 호출:**
```bash
curl -X POST http://localhost:8081/api/admin/security/memory/cleanup \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**예상 응답:**
```json
{
  "success": true,
  "message": "10個のエントリをクリアしました",
  "cleaned": 10
}
```

---

## 6. 그래프 데이터 テスト

### 6.1 보안 이벤트 그래프 API

**テスト:**
```bash
# Super Admin 토큰 필요
TOKEN="YOUR_TOKEN"

# 이벤트 추이
curl -X GET "http://localhost:8081/api/admin/security/events/trend?days=7" \
  -H "Authorization: Bearer $TOKEN"

# 이벤트 분포
curl -X GET "http://localhost:8081/api/admin/security/events/distribution?days=7" \
  -H "Authorization: Bearer $TOKEN"

# 시간대별 분포
curl -X GET "http://localhost:8081/api/admin/security/events/hourly?days=7" \
  -H "Authorization: Bearer $TOKEN"

# TOP 공격 IP
curl -X GET "http://localhost:8081/api/admin/security/events/top-ips?days=7&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 6.2 IP 통계 그래프 API

**テスト:**
```bash
# 접속 추이
curl -X GET "http://localhost:8081/api/admin/ip/access/trend?days=7" \
  -H "Authorization: Bearer $TOKEN"

# 국가별 분포
curl -X GET "http://localhost:8081/api/admin/ip/access/countries?days=7" \
  -H "Authorization: Bearer $TOKEN"

# 시간대별 접속 분포
curl -X GET "http://localhost:8081/api/admin/ip/access/hourly?days=7" \
  -H "Authorization: Bearer $TOKEN"

# TOP 접속 IP
curl -X GET "http://localhost:8081/api/admin/ip/access/top-ips?days=7&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**예상 응답 형식:**
- 모든 API는 `{ "success": true, "data": [...] }` 형식
- 데이터가 없으면 빈 배열 `[]` 반환

---

## 7. Geolocation テスト

**DB 確認:**
```sql
-- 위치 정보가 자동으로 추가되었는지 確認
SELECT 
    ip_address, 
    country, 
    city, 
    created_at 
FROM ip_access_logs 
WHERE country IS NOT NULL 
ORDER BY created_at DESC
LIMIT 10;
```

**確認 사항:**
- 최근 IP 로그에 `country`와 `city` 정보가 포함됨
- 위치 정보는 캐시되어 재사용됨 (24시간 TTL)

---

## 8. 에러 핸들링 テスト

### 8.1 존재하지 않는 경로 (404)

**テスト:**
```bash
curl -X GET http://localhost:8081/api/not-found
```

**想定結果:**
```json
{
  "success": false,
  "error": "ページが見つかりません",
  "path": "/api/not-found"
}
```

### 8.2 잘못된 リクエスト (400)

**テスト:**
```bash
# 필수 파라미터 없이 リクエスト
curl -X POST http://localhost:8081/api/admin/security/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{}'
```

**想定結果:** `400 Bad Request` または `500 Internal Server Error`

### 8.3 권한 없는 접근 (401)

**テスト:**
```bash
# 토큰 없이 リクエスト
curl -X GET http://localhost:8081/api/admin/security/events
```

**想定結果:**
```json
{
  "success": false,
  "error": "認証が必要です"
}
```

---

## 9. 스케줄러 テスト

### 9.1 자동 차단 해제 (수동 実行)

**テスト 스크립트:**
```bash
cd ECSite-server/GIT/ECSite-server
node scripts/test_schedulers.js
```

**または Node.js 콘솔에서:**
```javascript
const { runManualUnblock } = require('./jobs/autoUnblockScheduler');
await runManualUnblock();
```

**確認 사항:**
- 차단 시간이 지난 IP가 자동으로 해제됨
- `ip_management` 테이블에서 `is_blocked = 0`으로 변경
- `security_events` 테이블에 `auto_unblock` 이벤트 記録

### 9.2 로그 아카이빙 (수동 実行)

**テスト 스크립트:**
```bash
cd ECSite-server/GIT/ECSite-server
node scripts/test_schedulers.js
```

**または Node.js 콘솔에서:**
```javascript
const { runManualArchive } = require('./jobs/logArchiveScheduler');
await runManualArchive();
```

**確認 사항:**
- 90일 이상 된 `ip_access_logs` 삭제됨
- 90일 이상 된 `security_events` (low/medium) 삭제됨
- 180일 이상 된 `security_events` (high/critical) 삭제됨

---

## 10. 프론트엔드 確認

### 10.1 Security 페이지

**URL:** http://localhost:3000/profile/super-admin/security

**確認 사항:**
- [ ] 이벤트 추이 그래프 (라인 차트) 표시
- [ ] 이벤트 분포 파이 차트 표시
- [ ] 시간대별 바 차트 표시
- [ ] TOP 공격 IP 테이블 표시
- [ ] 기간 필터 작동 (7/14/30일)
- [ ] 로딩 상태 표시
- [ ] 데이터가 없을 때 적절한 메시지 표시

### 10.2 IP Management 페이지

**URL:** http://localhost:3000/profile/super-admin/ip-management

**確認 사항:**
- [ ] 접속 추이 그래프 (라인 차트) 표시
- [ ] 국가별 분포 파이 차트 표시
- [ ] 시간대별 접속 바 차트 표시
- [ ] TOP 접속 IP 테이블 표시
- [ ] IP 차단/해제 기능 작동
- [ ] 화이트리스트 기능 작동

---

## 11. 자동화된 テスト 스크립트 実行

### 11.1 전체 テスト 스크립트

**사용 방법:**
```bash
cd ECSite-server/GIT/ECSite-server

# 토큰을 환경 변수로 설정
export AUTH_TOKEN="your_super_admin_token"

# テスト 実行
node scripts/test_security_system.js
```

**注意:** 일부 テスト는 실제 차단이나 실패가 필요하므로, テスト 환경에서 実行하세요.

---

## ✅ 최종 完了 기준

- [x] **DB 인덱스** 적용 確認
- [x] **보안 설정** 테이블 생성 및 기본값 確認
- [x] **IP 차단** 정상 작동
- [x] **로그인 실패 추적** 정상 작동
- [x] **봇 탐지** 정상 작동
- [x] **Rate Limiting** 정상 작동
- [x] **스크래핑 탐지** 정상 작동
- [x] **메모리 관리** 정상 작동
- [x] **그래프 API** 정상 작동
- [x] **에러 핸들링** 일관성 確認
- [x] **스케줄러** 정상 작동
- [x] **프론트엔드 그래프** 정상 표시

---

## 🐛 문제 해결

### 인덱스가 보이지 않을 때
```sql
-- 인덱스 다시 생성
source database/migrations/add_security_indexes.sql;
```

### 보안 설정이 없을 때
```sql
-- 보안 설정 테이블 생성
source database/migrations/create_security_settings.sql;
```

### 메모리 통계가 0일 때
- 서버가 방금 시작되었거나
- 캐시가 아직 채워지지 않았을 수 있음
- 몇 번의 リクエスト 후 다시 確認

### 그래프 데이터가 비어있을 때
- 실제 보안 이벤트나 IP 로그가 필요함
- テスト リクエスト을 몇 번 보낸 후 確認

---

## 📝 テスト 결과 記録

テスト 完了 후 다음 정보를 記録하세요:

1. **テスト 일시**: 
2. **テスト 환경**: (로컬/스테이징/프로덕션)
3. **통과한 テスト**: 
4. **실패한 テスト**: 
5. **발견된 이슈**: 
6. **성능 메트릭**:
   - 평균 응답 시간:
   - 메모리 사용량:
   - DB 쿼리 속도:

---

**テスト 完了 후 포트폴리오 문서 작성을 진행하세요!** 🎉

