# 보안 시스템 및 학생 인증 시스템 문서

## 📋 목차
1. [학생 인증 시스템](#학생-인증-시스템)
2. [IP 주소 추출 방식](#ip-주소-추출-방식)
3. [보안 시스템 개요](#보안-시스템-개요)
4. [보안 미들웨어 상세](#보안-미들웨어-상세)
5. [자동 차단 시스템](#자동-차단-시스템)
6. [데이터 시각화](#데이터-시각화)
7. [성능 최적화](#성능-최적화)

---

## 학생 인증 시스템

### 개요
학생 인증 시스템은 학생 사용자가 학생증을 업로드하여 인증을 신청하고, super_admin이 검토 후 승인하는 2단계 프로세스로 구성됩니다.

### 플로우

```
1. 일반 사용자 → 학생증 업로드
   ↓
2. student_verified_at = null, student_verification_document = 파일경로 저장
   (대기 상태)
   ↓
3. super_admin → 대기 목록 확인
   ↓
4. 승인 → student_verified_at = 현재시간, 만료일 설정 (1년)
   거부 → student_verification_document = null
```

### 주요 API

**일반 사용자용:**
- `POST /api/users/:userId/student-verification` - 학생증 업로드
- `GET /api/users/:userId/student-status` - 인증 상태 조회

**Super Admin용:**
- `GET /api/admin/student-verifications/pending` - 대기 목록 조회
- `POST /api/admin/users/:userId/student-verification/approve` - 승인
- `POST /api/admin/users/:userId/student-verification/reject` - 거부
- `GET /api/admin/users/:userId/verification-document` - 문서 조회

### 상태 구분

```javascript
// 상태 계산 로직
const getStatus = () => {
  // 1. 승인됨 (만료 여부 확인)
  if (studentStatus?.student_verified_at) {
    if (studentStatus.student_expires_at) {
      const today = new Date();
      const expiresAt = new Date(studentStatus.student_expires_at);
      return expiresAt > today ? 'verified' : 'expired';
    }
    return 'verified';
  }
  
  // 2. 대기 중 (문서 업로드됨, 승인 대기)
  if (studentStatus?.student_verification_document) {
    return 'pending';
  }
  
  // 3. 미신청
  return 'not_applied';
};
```

### 데이터베이스 스키마

**users 테이블 관련 컬럼:**
- `account_type`: 'student' | 'general'
- `student_verified_at`: Date | null (승인 시간)
- `student_expires_at`: Date | null (만료일)
- `student_verification_document`: String | null (문서 파일 경로)

---

## IP 주소 추출 방식

### IP 추출 헬퍼 함수

모든 보안 미들웨어에서 사용하는 통일된 IP 추출 로직:

```javascript
const getClientIP = (req) => {
  return req.headers['cf-connecting-ip']           // Cloudflare
      || req.headers['x-forwarded-for']?.split(',')[0]?.trim()  // 프록시/로드밸런서
      || req.ip                                     // Express
      || req.connection?.remoteAddress             // Node.js
      || req.socket?.remoteAddress                 // Node.js (fallback)
      || 'unknown';
};
```

### 우선순위

1. **Cloudflare IP** (`cf-connecting-ip`)
   - Cloudflare를 사용하는 경우 실제 클라이언트 IP

2. **X-Forwarded-For 헤더**
   - 프록시나 로드밸런서를 거치는 경우
   - 여러 IP가 쉼표로 구분되어 있으므로 첫 번째 IP 사용

3. **Express req.ip**
   - Express의 신뢰할 수 있는 프록시 설정 후 사용

4. **Node.js 네트워크 정보**
   - `req.connection.remoteAddress` 또는 `req.socket.remoteAddress`

### Localhost 처리

모든 보안 미들웨어에서 localhost는 차단/제한에서 제외:

```javascript
if (ipAddress === '::1' || 
    ipAddress === '127.0.0.1' || 
    ipAddress === '::ffff:127.0.0.1' || 
    ipAddress === 'localhost' || 
    ipAddress === 'unknown') {
  return next(); // 보안 체크 스킵
}
```

### IP Geolocation

**서비스:** `services/geolocationService.js`

```javascript
// 무료 API 사용: ip-api.com
// 제한: 하루 45개 요청, 상업용 사용 금지
// 프로덕션 권장: MaxMind, ipinfo.io 등 유료 서비스

const response = await axios.get(`http://ip-api.com/json/${ipAddress}?fields=status,country,city`);
// 결과: { country: 'South Korea', city: 'Seoul' }
```

**캐싱:**
- 24시간 TTL
- `memoryManager`에 등록되어 자동 관리

---

## 보안 시스템 개요

### 시스템 아키텍처

```
요청 → IP 로깅 → IP 차단 체크 → Rate Limiting → 봇 탐지 → 스크래핑 탐지 → 라우트 처리
                                                                    ↓
                                                        404 에러 추적
                                                                    ↓
                                                        자동 차단 시스템
```

### 활성화 제어

환경 변수로 전체 보안 미들웨어를 제어할 수 있습니다:

```javascript
// server.js
const ENABLE_SECURITY_MIDDLEWARE = process.env.ENABLE_SECURITY_MIDDLEWARE === 'true';

if (ENABLE_SECURITY_MIDDLEWARE) {
  app.use(ipBlockMiddleware.checkIPBlock);
  app.use(rateLimiter.globalRateLimiter);
  app.use(botDetector.botCheckMiddleware);
  app.use(scrapingDetector.detectScraping);
  app.use(notFoundTracker.trackNotFound);
}
```

### 데이터베이스 테이블

1. **ip_access_logs**
   - 모든 요청의 IP 로그
   - 컬럼: ip_address, user_id, request_path, request_method, user_agent, country, city, created_at

2. **ip_management**
   - IP 차단/화이트리스트 관리
   - 컬럼: ip_address, is_blocked, is_whitelisted, blocked_at, blocked_by, block_reason

3. **security_events**
   - 모든 보안 이벤트 로그
   - 컬럼: event_type, ip_address, severity, request_path, details, created_at

4. **bot_detections**
   - 봇 탐지 기록
   - 컬럼: ip_address, user_agent, detection_reason, confidence_score, is_blocked

5. **security_settings**
   - 보안 설정 (DB 저장)
   - 컬럼: setting_key, setting_value, updated_by

---

## 보안 미들웨어 상세

### 1. IP 차단 미들웨어

**파일:** `middleware/ipBlockMiddleware.js`

**기능:**
- 차단된 IP의 요청을 403으로 거부
- 화이트리스트 IP는 항상 허용
- 메모리 캐싱 (5분 TTL)으로 성능 향상

**로직:**
```javascript
1. IP 주소 추출
2. 캐시 확인 → 있으면 사용, 없으면 DB 조회
3. 화이트리스트 확인 → 있으면 통과
4. 차단 확인 → 차단되어 있으면 403 반환
5. SecurityEvent 로깅
```

**캐시 무효화:**
```javascript
// IP 차단/해제 시 캐시 클리어
ipBlockMiddleware.clearIPCache(ipAddress);
```

### 2. 로그인 시도 추적

**파일:** `middleware/loginAttemptTracker.js`

**기능:**
- IP별 로그인 실패 횟수 추적
- 최대 실패 횟수 초과 시 자동 차단
- 차단 시간 동안 로그인 시도 차단

**설정 (기본값):**
- `max_login_attempts`: 5회
- `block_duration_hours`: 24시간

**로직:**
```javascript
1. 로그인 요청 시 시도 횟수 확인
2. 차단 시간 내이면 429 반환
3. 로그인 실패 시 횟수 증가
4. 최대 횟수 초과 시 자동 차단 + 차단 시간 설정
5. 로그인 성공 시 시도 횟수 리셋
```

**메모리 저장:**
```javascript
loginAttempts = Map<ip, { count: number, blockedUntil: timestamp }>
// TTL: 30분
```

### 3. 봇 탐지

**파일:** `middleware/botDetector.js`

**기능:**
- User-Agent 패턴 분석으로 봇 탐지
- 신뢰도 점수 기반 차단 결정
- BotDetection 테이블에 기록

**탐지 패턴:**
```javascript
const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i,
  /wget/i, /curl/i, /python-requests/i,
  /java\//i, /okhttp/i, /go-http-client/i,
  /axios/i, /node-fetch/i, /headlesschrome/i,
  /phantomjs/i, /selenium/i
];
```

**신뢰도 점수:**
- 90% 이상: 즉시 차단
- 80-89%: 로그만 기록
- 60-79%: 의심 활동으로 기록

**설정:**
- `bot_detection_threshold`: 80 (기본값)

### 4. Rate Limiting

**파일:** `middleware/rateLimiter.js`

**기능:**
- 엔드포인트별 요청 수 제한
- IP별 카운팅
- 10% 초과 시 자동 차단

**제한 설정:**
```javascript
// 글로벌: 1분에 1000개
exports.globalRateLimiter = createRateLimiter(1000, 60000);

// API: 1분에 100개
exports.apiRateLimiter = createRateLimiter(100, 60000);

// 인증: 1분에 10개
exports.authRateLimiter = createRateLimiter(10, 60000);
```

**로직:**
```javascript
1. IP + 엔드포인트 조합으로 키 생성
2. 현재 카운트 확인
3. 시간 윈도우 초과 시 리셋
4. 제한 초과 시 429 반환
5. 10% 초과 시 자동 차단
```

**메모리 저장:**
```javascript
rateLimitStore = Map<ip:endpoint, { count: number, resetTime: timestamp }>
// TTL: 5분
```

### 5. 스크래핑 탐지

**파일:** `middleware/scrapingDetector.js`

**기능:**
- 상품 페이지에 대한 빠른 연속 접근 탐지
- 1분 내 임계값 초과 시 의심 활동 기록
- 자동 차단 임계값 초과 시 즉시 차단

**설정:**
- `scraping_detection_threshold`: 20 (1분 내 접근 횟수)
- `scraping_block_threshold`: 30 (즉시 차단 임계값)

**로직:**
```javascript
1. /api/products/ 또는 /products/ 경로만 추적
2. IP별 최근 1분 내 접근 기록 유지
3. 임계값 초과 시 SecurityEvent 로깅
4. 자동 차단 임계값 초과 시 즉시 차단
```

**메모리 저장:**
```javascript
pageAccessLog = Map<ip, [{ path: string, timestamp: number }, ...]>
// TTL: 5분
```

### 6. 404 에러 추적

**파일:** `middleware/notFoundTracker.js`

**기능:**
- IP별 404 에러 발생 횟수 추적
- 1분 내 임계값 초과 시 의심 활동으로 기록
- 의심 활동 추적 시스템과 연동

**설정:**
- `notFound_error_threshold`: 10 (1분 내 404 에러 횟수)

**로직:**
```javascript
1. 응답이 404인 경우에만 추적
2. IP별 최근 1분 내 404 기록 유지
3. 임계값 초과 시 suspiciousActivity 추적
4. SecurityEvent 로깅
```

**메모리 저장:**
```javascript
notFoundLog = Map<ip, [timestamp, timestamp, ...]>
// TTL: 5분
```

---

## 자동 차단 시스템

### 서비스

**파일:** `services/autoBlockService.js`

**주요 기능:**

1. **보안 설정 관리**
   - DB에서 설정 로드 (캐싱 1분)
   - 설정 업데이트 API 제공
   - 기본값 fallback 지원

2. **자동 IP 차단**
   ```javascript
   await autoBlockService.autoBlockIP(
     ipAddress,
     reason,
     severity, // 'low' | 'medium' | 'high' | 'critical'
     details
   );
   ```

3. **의심 활동 추적**
   ```javascript
   await autoBlockService.trackSuspiciousActivity(
     ip,
     activityType, // '404_errors', 'scraping_attempt', etc.
     details
   );
   // 1시간 내 임계값(10회) 초과 시 자동 차단
   ```

### 자동 차단 트리거

다음 경우에 자동으로 IP가 차단됩니다:

1. **로그인 실패 5회 초과**
   - `loginAttemptTracker`에서 트리거
   - 차단 시간: 24시간

2. **봇 탐지 (신뢰도 90% 이상)**
   - `botDetector`에서 트리거
   - 즉시 차단

3. **Rate Limit 10% 초과**
   - `rateLimiter`에서 트리거
   - 즉시 차단

4. **스크래핑 자동 차단 임계값 초과**
   - `scrapingDetector`에서 트리거
   - 즉시 차단

5. **의심 활동 임계값 초과**
   - `notFoundTracker` 등에서 트리거
   - 1시간 내 10회 이상 의심 활동 시 차단

### 자동 차단 해제

**파일:** `jobs/autoUnblockScheduler.js`

**스케줄:**
- 매시간 0분에 실행 (cron: `0 * * * *`)

**로직:**
```javascript
1. 차단 시간이 지난 IP 찾기 (blocked_at + block_duration_hours)
2. 자동 차단만 해제 (blocked_by = null)
3. 수동 차단은 유지
4. SecurityEvent 로깅
```

---

## 데이터 시각화

### 보안 이벤트 통계

**API:** `GET /api/admin/security/events/*`

1. **일별 추이** (`/events/trend`)
   - 최근 7일/14일/30일
   - 이벤트 유형별 카운트
   - 라인 차트용 데이터

2. **유형별 분포** (`/events/distribution`)
   - 파이 차트용 데이터
   - 이벤트 유형별 비율

3. **시간대별 분포** (`/events/hourly`)
   - 0-23시별 이벤트 발생 수
   - 바 차트용 데이터

4. **TOP 공격 IP** (`/events/top-ips`)
   - 이벤트 수가 많은 IP 리스트
   - 최대 심각도 포함

### IP 접속 통계

**API:** `GET /api/admin/ip/access/*`

1. **접속 추이** (`/access/trend`)
   - 일별 총 접속 수, 고유 IP 수
   - 라인 차트용 데이터

2. **국가별 분포** (`/access/countries`)
   - 파이 차트용 데이터
   - 상위 10개 국가

3. **시간대별 분포** (`/access/hourly`)
   - 0-23시별 접속 수
   - 바 차트용 데이터

4. **TOP 접속 IP** (`/access/top-ips`)
   - 접속 수가 많은 IP 리스트
   - 국가 정보 포함

---

## 성능 최적화

### 메모리 관리

**파일:** `services/memoryManager.js`

**기능:**
- 모든 메모리 스토어 중앙 관리
- 5분마다 자동 정리 (TTL 기반)
- 메모리 사용량 모니터링
- 수동 정리 API 제공

**등록된 스토어:**
```javascript
- loginAttempts: 30분 TTL
- rateLimitStore: 5분 TTL
- pageAccessLog: 5분 TTL
- notFoundLog: 5분 TTL
- ipBlockCache: 5분 TTL
- locationCache: 24시간 TTL
- suspiciousActivities: 1시간 TTL
```

**API:**
- `GET /api/admin/security/memory/stats` - 메모리 통계
- `POST /api/admin/security/memory/cleanup` - 강제 정리

### 데이터베이스 인덱스

**파일:** `database/migrations/add_security_indexes.sql`

**인덱스:**
```sql
-- security_events
idx_security_events_ip, idx_security_events_type, 
idx_security_events_created, idx_security_events_severity,
idx_security_events_composite (event_type, created_at, severity)

-- ip_access_logs
idx_ip_access_logs_ip, idx_ip_access_logs_created,
idx_ip_access_logs_country, idx_ip_access_logs_composite

-- ip_management
idx_ip_management_blocked, idx_ip_management_whitelisted,
idx_ip_management_blocked_at

-- bot_detections
idx_bot_detections_ip, idx_bot_detections_created,
idx_bot_detections_blocked, idx_bot_detections_confidence
```

### 로그 아카이빙

**파일:** `jobs/logArchiveScheduler.js`

**스케줄:**
- 매일 새벽 3시 실행 (cron: `0 3 * * *`)

**정리 규칙:**
- `ip_access_logs`: 90일 이상 삭제
- `security_events`:
  - low/medium: 90일 이상 삭제
  - high/critical: 180일 이상 삭제

---

## 에러 핸들링

### 글로벌 에러 핸들러

**파일:** `middleware/errorHandler.js`

**기능:**
- 일관된 JSON 에러 응답
- Sequelize 에러 처리
- JWT 에러 처리
- 404 핸들러
- 개발/프로덕션 환경 구분

**에러 타입:**
- `SequelizeValidationError` → 400
- `SequelizeUniqueConstraintError` → 409
- `JsonWebTokenError` → 401
- `TokenExpiredError` → 401
- 기타 → 500

---

## 설정 관리

### 보안 설정

**테이블:** `security_settings`

**주요 설정:**
- `auto_block_enabled`: 자동 차단 활성화 (true/false)
- `bot_detection_threshold`: 봇 탐지 임계값 (0-100)
- `max_login_attempts`: 최대 로그인 시도 횟수
- `block_duration_hours`: 차단 지속 시간 (시간)
- `rate_limit_enabled`: Rate Limiting 활성화
- `rate_limit_global_requests`: 글로벌 요청 제한
- `rate_limit_api_requests`: API 요청 제한
- `rate_limit_auth_requests`: 인증 요청 제한
- `rate_limit_window_minutes`: 제한 시간 윈도우 (분)
- `scraping_detection_threshold`: 스크래핑 탐지 임계값
- `scraping_block_threshold`: 스크래핑 자동 차단 임계값
- `notFound_error_threshold`: 404 에러 임계값
- `suspicious_activity_threshold`: 의심 활동 임계값

**API:**
- `GET /api/admin/security/settings` - 설정 조회
- `PUT /api/admin/security/settings` - 설정 업데이트

---

## 프론트엔드 통합

### 학생 인증 페이지

**경로:**
- `/profile/student-verification` - 학생 인증 신청
- `/profile/settings` - 학생 인증 상태 표시
- `/profile/super-admin/student-verifications` - 관리자 승인

**상태 표시:**
- 미인증: 회색 배지
- 대기 중: 노란색 배지 (문서 업로드됨, 승인 대기)
- 인증 완료: 초록색 배지
- 만료: 빨간색 배지

### 보안 관리 페이지

**경로:**
- `/profile/super-admin/security` - 보안 이벤트 통계 및 관리
- `/profile/super-admin/ip-management` - IP 접속 통계 및 관리

**그래프:**
- Recharts 라이브러리 사용
- 라인 차트, 파이 차트, 바 차트
- 기간 필터 (7일/14일/30일)

---

## 테스트

### 자동화 테스트

**파일:** `scripts/test_security_system.js`

**테스트 항목:**
1. IP 차단 기능
2. 로그인 실패 추적
3. 봇 탐지
4. Rate Limiting
5. 스크래핑 탐지

### 스케줄러 테스트

**파일:** `scripts/test_schedulers.js`

**기능:**
- 자동 차단 해제 수동 실행
- 로그 아카이빙 수동 실행

---

## 주의사항

1. **프로덕션 환경:**
   - `ENABLE_SECURITY_MIDDLEWARE=true` 설정 필요
   - IP Geolocation 유료 서비스 권장
   - Rate Limiting 설정 조정 필요
   - 로그 보관 기간 정책 수립

2. **성능:**
   - 메모리 사용량 모니터링
   - DB 인덱스 적용 확인
   - 로그 아카이빙 스케줄 확인

3. **보안:**
   - 화이트리스트 IP 관리
   - 자동 차단 설정 조정
   - SecurityEvent 로그 정기 점검

---

## 요약

이 시스템은 다음과 같은 보안 기능을 제공합니다:

✅ **IP 기반 차단 및 화이트리스트**
✅ **로그인 시도 제한 및 자동 차단**
✅ **봇 탐지 및 차단**
✅ **Rate Limiting (API 보호)**
✅ **스크래핑 탐지**
✅ **404 에러 추적**
✅ **의심 활동 자동 차단**
✅ **IP Geolocation (국가/도시 정보)**
✅ **데이터 시각화 (그래프)**
✅ **메모리 관리 및 최적화**
✅ **로그 아카이빙**
✅ **학생 인증 시스템 (2단계 승인)**

모든 기능은 메모리 캐싱과 DB 인덱스를 활용하여 높은 성능을 유지합니다.

