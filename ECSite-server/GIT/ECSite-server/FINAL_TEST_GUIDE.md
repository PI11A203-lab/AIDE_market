# 보안 시스템 최종 테스트 가이드

## 📋 테스트 체크리스트

이 가이드는 보안 시스템의 모든 기능이 정상적으로 작동하는지 확인하는 방법을 제공합니다.

---

## 1. DB 확인

### 1.1 인덱스 확인
```bash
cd ECSite-server/GIT/ECSite-server
mysql -u root -p aide_market < database/migrations/test_security_system.sql
```

또는 직접 MySQL에 접속하여:
```sql
-- 인덱스 확인
SHOW INDEX FROM security_events;
SHOW INDEX FROM ip_access_logs;
SHOW INDEX FROM ip_management;
SHOW INDEX FROM bot_detections;

-- 보안 설정 확인
SELECT * FROM security_settings;

-- 데이터 확인
SELECT COUNT(*) FROM security_events;
SELECT COUNT(*) FROM ip_access_logs;
SELECT COUNT(*) FROM bot_detections;
```

### 1.2 보안 설정 확인
```sql
SELECT * FROM security_settings;
```

**예상 결과:**
- `auto_block_enabled`: true
- `bot_detection_threshold`: 80
- `max_login_attempts`: 5
- `block_duration_hours`: 24
- `rate_limit_enabled`: true/false
- 기타 설정들...

---

## 2. 기본 보안 기능 테스트

### 2.1 IP 차단 테스트

**Step 1: Super Admin에서 IP 차단**
1. 프론트엔드: http://localhost:3000/profile/super-admin/ip-management
2. IP Management 탭에서 특정 IP 차단
3. 예: `192.168.1.100` 차단

**Step 2: 차단된 IP로 요청**
```bash
curl -X GET http://localhost:8081/api/products \
  -H "X-Forwarded-For: 192.168.1.100"
```

**예상 결과:** `403 Forbidden`
```json
{
  "success": false,
  "error": "アクセスが拒否されました"
}
```

**확인 사항:**
- DB의 `security_events` 테이블에 `ip_blocked` 이벤트 기록됨
- `ip_management` 테이블에 해당 IP가 `is_blocked = 1`로 기록됨

---

### 2.2 로그인 실패 테스트

**테스트:**
```bash
# 5번 연속 로그인 실패
for i in {1..5}; do
  echo "시도 $i"
  curl -X POST http://localhost:8081/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo ""
  sleep 1
done
```

**예상 결과:**
- 1-4번: `401 Unauthorized`
- 5번: `429 Too Many Requests` 또는 `401 Unauthorized` (차단 시작)
- 6번 이후: `429 Too Many Requests` (차단 중)

**확인 사항:**
- `security_events` 테이블에 `login_failed` 이벤트 5개 기록
- `ip_management` 테이블에 해당 IP가 자동 차단됨 (`is_blocked = 1`)

---

### 2.3 봇 탐지 테스트

**테스트:**
```bash
# 봇 User-Agent로 요청
curl -X GET http://localhost:8081/api/products \
  -H "User-Agent: bot/crawler"

# 또는
curl -X GET http://localhost:8081/api/products \
  -H "User-Agent: python-requests/2.28.0"
```

**예상 결과:**
- 신뢰도 90% 이상: `403 Forbidden` (즉시 차단)
- 신뢰도 80-89%: 요청은 통과하지만 `bot_detections` 테이블에 기록

**확인 사항:**
- `bot_detections` 테이블에 기록됨
- `security_events` 테이블에 `bot_detected` 이벤트 기록
- 신뢰도 90% 이상인 경우 `ip_management` 테이블에 자동 차단

---

## 3. Rate Limiting 테스트

**테스트:**
```bash
# 빠르게 110번 요청 (API Rate Limit: 100회/분)
for i in {1..110}; do
  curl -X GET http://localhost:8081/api/products \
    -w "\nStatus: %{http_code}\n" \
    -o /dev/null -s
  if [ $((i % 10)) -eq 0 ]; then
    echo "요청 $i 완료"
  fi
done
```

**예상 결과:**
- 1-100번: `200 OK`
- 101번 이후: `429 Too Many Requests`
- 응답에 `Retry-After` 헤더 포함

**확인 사항:**
- `security_events` 테이블에 `api_abuse` 이벤트 기록
- 110번 요청 시 자동 차단 가능

---

## 4. 스크래핑 탐지 테스트

**테스트:**
```bash
# 빠르게 35개 상품 페이지 접근
for i in {1..35}; do
  curl -X GET "http://localhost:8081/api/products/$i" \
    -w "\nStatus: %{http_code}\n" \
    -o /dev/null -s
  sleep 0.1
done
```

**예상 결과:**
- 1-29번: `200 OK` 또는 `404 Not Found`
- 30번 이후: `403 Forbidden` (자동 차단)

**확인 사항:**
- `security_events` 테이블에 `scraping` 이벤트 기록
- `ip_management` 테이블에 자동 차단

---

## 5. 메모리 관리 테스트

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

## 6. 그래프 데이터 테스트

### 6.1 보안 이벤트 그래프 API

**테스트:**
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

**테스트:**
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

## 7. Geolocation 테스트

**DB 확인:**
```sql
-- 위치 정보가 자동으로 추가되었는지 확인
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

**확인 사항:**
- 최근 IP 로그에 `country`와 `city` 정보가 포함됨
- 위치 정보는 캐시되어 재사용됨 (24시간 TTL)

---

## 8. 에러 핸들링 테스트

### 8.1 존재하지 않는 경로 (404)

**테스트:**
```bash
curl -X GET http://localhost:8081/api/not-found
```

**예상 결과:**
```json
{
  "success": false,
  "error": "ページが見つかりません",
  "path": "/api/not-found"
}
```

### 8.2 잘못된 요청 (400)

**테스트:**
```bash
# 필수 파라미터 없이 요청
curl -X POST http://localhost:8081/api/admin/security/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{}'
```

**예상 결과:** `400 Bad Request` 또는 `500 Internal Server Error`

### 8.3 권한 없는 접근 (401)

**테스트:**
```bash
# 토큰 없이 요청
curl -X GET http://localhost:8081/api/admin/security/events
```

**예상 결과:**
```json
{
  "success": false,
  "error": "認証が必要です"
}
```

---

## 9. 스케줄러 테스트

### 9.1 자동 차단 해제 (수동 실행)

**테스트 스크립트:**
```bash
cd ECSite-server/GIT/ECSite-server
node scripts/test_schedulers.js
```

**또는 Node.js 콘솔에서:**
```javascript
const { runManualUnblock } = require('./jobs/autoUnblockScheduler');
await runManualUnblock();
```

**확인 사항:**
- 차단 시간이 지난 IP가 자동으로 해제됨
- `ip_management` 테이블에서 `is_blocked = 0`으로 변경
- `security_events` 테이블에 `auto_unblock` 이벤트 기록

### 9.2 로그 아카이빙 (수동 실행)

**테스트 스크립트:**
```bash
cd ECSite-server/GIT/ECSite-server
node scripts/test_schedulers.js
```

**또는 Node.js 콘솔에서:**
```javascript
const { runManualArchive } = require('./jobs/logArchiveScheduler');
await runManualArchive();
```

**확인 사항:**
- 90일 이상 된 `ip_access_logs` 삭제됨
- 90일 이상 된 `security_events` (low/medium) 삭제됨
- 180일 이상 된 `security_events` (high/critical) 삭제됨

---

## 10. 프론트엔드 확인

### 10.1 Security 페이지

**URL:** http://localhost:3000/profile/super-admin/security

**확인 사항:**
- [ ] 이벤트 추이 그래프 (라인 차트) 표시
- [ ] 이벤트 분포 파이 차트 표시
- [ ] 시간대별 바 차트 표시
- [ ] TOP 공격 IP 테이블 표시
- [ ] 기간 필터 작동 (7/14/30일)
- [ ] 로딩 상태 표시
- [ ] 데이터가 없을 때 적절한 메시지 표시

### 10.2 IP Management 페이지

**URL:** http://localhost:3000/profile/super-admin/ip-management

**확인 사항:**
- [ ] 접속 추이 그래프 (라인 차트) 표시
- [ ] 국가별 분포 파이 차트 표시
- [ ] 시간대별 접속 바 차트 표시
- [ ] TOP 접속 IP 테이블 표시
- [ ] IP 차단/해제 기능 작동
- [ ] 화이트리스트 기능 작동

---

## 11. 자동화된 테스트 스크립트 실행

### 11.1 전체 테스트 스크립트

**사용 방법:**
```bash
cd ECSite-server/GIT/ECSite-server

# 토큰을 환경 변수로 설정
export AUTH_TOKEN="your_super_admin_token"

# 테스트 실행
node scripts/test_security_system.js
```

**주의:** 일부 테스트는 실제 차단이나 실패가 필요하므로, 테스트 환경에서 실행하세요.

---

## ✅ 최종 완료 기준

- [x] **DB 인덱스** 적용 확인
- [x] **보안 설정** 테이블 생성 및 기본값 확인
- [x] **IP 차단** 정상 작동
- [x] **로그인 실패 추적** 정상 작동
- [x] **봇 탐지** 정상 작동
- [x] **Rate Limiting** 정상 작동
- [x] **스크래핑 탐지** 정상 작동
- [x] **메모리 관리** 정상 작동
- [x] **그래프 API** 정상 작동
- [x] **에러 핸들링** 일관성 확인
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
- 몇 번의 요청 후 다시 확인

### 그래프 데이터가 비어있을 때
- 실제 보안 이벤트나 IP 로그가 필요함
- 테스트 요청을 몇 번 보낸 후 확인

---

## 📝 테스트 결과 기록

테스트 완료 후 다음 정보를 기록하세요:

1. **테스트 일시**: 
2. **테스트 환경**: (로컬/스테이징/프로덕션)
3. **통과한 테스트**: 
4. **실패한 테스트**: 
5. **발견된 이슈**: 
6. **성능 메트릭**:
   - 평균 응답 시간:
   - 메모리 사용량:
   - DB 쿼리 속도:

---

**테스트 완료 후 포트폴리오 문서 작성을 진행하세요!** 🎉

