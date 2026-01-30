# Week 2 보안 시스템 구현 완료 요약

## ✅ 구현 완료 항목

### Task 2.1: API Rate Limiting ✅
**파일:** `middleware/rateLimiter.js`

**주요 기능:**
- IP별, 엔드포인트별 요청 횟수 제한
- 글로벌 Rate Limiter: 1분에 1000개
- API Rate Limiter: 1분에 100개
- 인증 Rate Limiter: 1분에 10개 (더 엄격)
- 제한 초과 시 429 응답
- 10% 초과 시 자동 IP 차단
- SecurityEvent 자동 로깅
- 메모리 정리 (5분마다 오래된 레코드 삭제)
- `server.js`에 적용 완료

**테스트 방법:**
```bash
# 빠르게 110번 요청
for i in {1..110}; do
  curl http://localhost:8081/api/products
done
# 100번째까지 200, 101번째부터 429 응답
# 110번째부터 자동 차단
```

---

### Task 2.2: 스크래핑 탐지 시스템 ✅
**파일:** `middleware/scrapingDetector.js`

**주요 기능:**
- 상품 페이지 접근 패턴 감지
- 1분에 20개 이상 접근 시 의심 활동 추적
- 1분에 30개 이상 접근 시 자동 차단
- SecurityEvent 자동 로깅
- 메모리 정리 (5분마다)
- `server.js`에 적용 완료

**테스트 방법:**
```bash
# 빠르게 여러 상품 페이지 접근
for i in {1..35}; do
  curl http://localhost:8081/api/products/$i
done
# 20번째부터 경고, 30번째부터 403 응답 및 자동 차단
```

---

### Task 2.3: 자동 차단 해제 스케줄러 ✅
**파일:** `jobs/autoUnblockScheduler.js`

**주요 기능:**
- 매 시간마다 실행 (매시 0분)
- 차단 시간이 지난 자동 차단 IP 자동 해제
- 수동 차단은 유지 (blocked_by가 null인 경우만 해제)
- SecurityEvent 자동 로깅
- 수동 실행 함수 제공 (테스트용)
- `server.js`에 적용 완료

**테스트 방법:**
```javascript
// 1. 보안 설정에서 block_duration_hours를 0.017(1분)로 설정
// 2. IP를 자동 차단 (봇 탐지 등으로)
// 3. 1분 후 스케줄러가 실행되면 자동 해제
// 또는 수동으로 함수 호출하여 테스트
```

---

### Task 2.4: 404 에러 추적 ✅
**파일:** `middleware/notFoundTracker.js`

**주요 기능:**
- IP별 404 에러 카운트
- 1분에 404가 10번 이상 시 의심 활동 추적
- SecurityEvent 자동 로깅
- 메모리 정리 (5분마다)
- `server.js`에 적용 완료

**테스트 방법:**
```bash
# 존재하지 않는 페이지에 15번 요청
for i in {1000..1015}; do
  curl http://localhost:8081/api/products/$i
done
# 10번째부터 suspicious_activity 로그 기록
# autoBlockService.trackSuspiciousActivity 호출
```

---

## 📂 파일 구조

```
ECSite-server/GIT/ECSite-server/
├── middleware/
│   ├── rateLimiter.js                ✅ 신규
│   ├── scrapingDetector.js           ✅ 신규
│   ├── notFoundTracker.js            ✅ 신규
│   ├── ipBlockMiddleware.js          (Week 1)
│   ├── loginAttemptTracker.js        (Week 1)
│   ├── botDetector.js                (Week 1)
│   └── ipLogger.js                   (기존)
├── jobs/
│   ├── autoUnblockScheduler.js       ✅ 신규
│   ├── subscriptionScheduler.js      (기존)
│   ├── notificationScheduler.js      (기존)
│   └── studentExpirationScheduler.js (기존)
└── app/
    └── server.js                     ✅ 수정 (미들웨어 적용)
```

---

## 🔧 미들웨어 적용 순서

`server.js`에서 미들웨어 적용 순서:
1. `ipLogger.logIpAccess` - IP 로깅
2. `ipBlockMiddleware.checkIPBlock` - IP 차단 확인
3. `rateLimiter.globalRateLimiter` - 글로벌 Rate Limiting ✅ 신규
4. `rateLimiter.apiRateLimiter` - API Rate Limiting ✅ 신규 (for /api)
5. `rateLimiter.authRateLimiter` - 인증 Rate Limiting ✅ 신규 (for /auth)
6. `botDetector.botCheckMiddleware` - 봇 탐지
7. `scrapingDetector.detectScraping` - 스크래핑 탐지 ✅ 신규
8. `notFoundTracker.trackNotFound` - 404 추적 ✅ 신규
9. 라우트 등록

**중요:** 순서가 매우 중요합니다!
- IP 차단 확인이 먼저 와야 차단된 IP의 요청을 빠르게 거부
- Rate Limiting이 봇 탐지보다 먼저 와서 봇 탐지 전에 과도한 요청 차단

---

## 🧪 전체 테스트 시나리오

### 시나리오 1: Rate Limiting 테스트
```bash
# 1. 빠르게 110번 요청
for i in {1..110}; do
  curl -w "\nStatus: %{http_code}\n" http://localhost:8081/api/products | tail -1
done

# 2. 100번째까지 200, 101번째부터 429 응답 확인
# 3. SecurityEvent 테이블에 api_abuse 로그 확인
# 4. 110번째부터 IP 자동 차단 확인
```

### 시나리오 2: 스크래핑 탐지
```bash
# 1. 빠르게 여러 상품 페이지 접근
for i in {1..35}; do
  curl http://localhost:8081/api/products/$i
done

# 2. 20번째부터 경고 로그 확인
# 3. 30번째부터 403 응답 확인
# 4. IP 자동 차단 확인
# 5. SecurityEvent 테이블에 scraping 로그 확인
```

### 시나리오 3: 404 에러 추적
```bash
# 1. 존재하지 않는 페이지에 15번 요청
for i in {1000..1015}; do
  curl http://localhost:8081/api/products/$i
done

# 2. 10번째부터 SecurityEvent 테이블에 suspicious_activity 로그 확인
# 3. autoBlockService.trackSuspiciousActivity 호출 확인
```

### 시나리오 4: 자동 차단 해제
```javascript
// 1. 보안 설정 업데이트 (테스트용으로 1분으로 설정)
// POST /api/admin/security/settings
{
  "block_duration_hours": 0.017  // 1분
}

// 2. IP를 자동 차단 (봇 탐지 등으로)
// 3. 1분 후 스케줄러가 실행되면 자동 해제 확인
// 또는 수동 실행:
const { runManualUnblock } = require('./jobs/autoUnblockScheduler');
await runManualUnblock();
```

---

## 📊 DB 테이블 확인 쿼리

### Rate Limiting 관련 SecurityEvent 확인
```sql
SELECT * FROM security_events 
WHERE event_type = 'api_abuse' 
ORDER BY created_at DESC 
LIMIT 20;
```

### 스크래핑 관련 SecurityEvent 확인
```sql
SELECT * FROM security_events 
WHERE event_type = 'scraping' 
ORDER BY created_at DESC 
LIMIT 20;
```

### 의심스러운 활동 확인
```sql
SELECT * FROM security_events 
WHERE event_type = 'suspicious_activity' 
ORDER BY created_at DESC 
LIMIT 20;
```

### 자동 해제된 IP 확인
```sql
SELECT * FROM security_events 
WHERE event_type = 'ip_blocked' 
AND details LIKE '%auto_unblock%'
ORDER BY created_at DESC 
LIMIT 20;
```

---

## ⚠️ 주의사항

1. **메모리 저장**: Rate Limiting, 스크래핑 탐지, 404 추적은 메모리에만 저장 (서버 재시작 시 초기화)
2. **localhost는 모든 체크에서 제외** (개발 환경 편의)
3. **Rate Limiter 순서**: 글로벌 → API → 인증 순서로 적용되어 중첩 적용됨
4. **스크래핑 탐지**: 상품 목록 페이지는 제외, 특정 상품 페이지만 추적
5. **자동 차단 해제**: 수동 차단(blocked_by가 null이 아닌 경우)은 해제하지 않음

---

## 🎯 다음 단계 (Week 3 예정)

- 데이터 시각화 (그래프)
- DB 저장으로 전환 (Rate Limiting, 스크래핑 탐지 로그)
- 실시간 알림 시스템
- 보안 대시보드 개선
- 통계 및 리포트 기능

---

## ✅ Week 2 완료 기준 확인

- [x] API Rate Limiting 작동
- [x] 스크래핑 패턴 감지 및 차단
- [x] 시간 경과 후 자동 차단 해제
- [x] 404 에러 과다 발생 시 경고

**Week 2 구현 완료! 🎉**

