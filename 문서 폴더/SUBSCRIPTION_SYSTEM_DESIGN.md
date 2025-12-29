# 정기결제 시스템 설계 문서

## 📋 개요
매월 말일에 자동으로 결제되는 정기결제 시스템 구현을 위한 설계 문서입니다.

## 🎯 주요 요구사항
1. **최초 결제**: 주문 생성 시 즉시 결제 처리 (일반 주문과 동일)
2. **정기결제**: 최초 결제 이후부터 매월 말일에 자동 결제
3. **이메일 안내**: 다음 결제일로부터 5일 전에 이메일 안내 발송
4. **이메일 링크**: 이메일 링크 클릭 시 로그인 후 정기결제 안내 페이지로 이동
5. **결제 실패 처리**: 결제 실패 시 상품 활성화 코드 정지 및 재결제 유도
6. **유예 기간**: 결제 실패 후 3일 유예 기간 제공
7. **사용자 기능**: 카드 정보 변경 및 쿠폰 입력 가능
8. **다국어 지원**: 이메일 3개국어 지원 (한국어, 영어, 일본어)

---

## 📊 데이터베이스 설계

### 1. `subscriptions` 테이블 (신규 생성)
정기결제 구독 정보를 저장하는 테이블

```sql
CREATE TABLE subscriptions (
  subscription_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_id INT NOT NULL,  -- 최초 주문 ID
  payment_method_id INT NOT NULL,  -- 사용할 결제 수단 ID
  status ENUM('active', 'paused', 'cancelled', 'failed') DEFAULT 'active',
  next_payment_date DATE NOT NULL,  -- 다음 결제일 (매월 말일)
  last_payment_date DATE NULL,  -- 마지막 결제일
  last_payment_status ENUM('success', 'failed', 'pending') NULL,
  coupon_id INT NULL,  -- 적용된 쿠폰 ID (학생 계정용)
  grace_period_end_date DATE NULL,  -- 유예 기간 종료일 (결제 실패 시)
  reminder_token VARCHAR(255) NULL,  -- 이메일 링크용 토큰
  reminder_token_expires_at DATETIME NULL,  -- 토큰 만료일
  user_language VARCHAR(10) DEFAULT 'ko',  -- 사용자 언어 설정 (이메일 언어 결정)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(coupon_id),
  INDEX idx_user_id (user_id),
  INDEX idx_next_payment_date (next_payment_date),
  INDEX idx_status (status)
);
```

### 2. `subscription_items` 테이블 (신규 생성)
구독에 포함된 상품 목록

```sql
CREATE TABLE subscription_items (
  subscription_item_id INT PRIMARY KEY AUTO_INCREMENT,
  subscription_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id),
  INDEX idx_subscription_id (subscription_id)
);
```

### 3. `subscription_payments` 테이블 (신규 생성)
정기결제 이력 (매월 결제 기록)

```sql
CREATE TABLE subscription_payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  subscription_id INT NOT NULL,
  order_id INT NULL,  -- 생성된 주문 ID
  payment_date DATE NOT NULL,  -- 결제 시도일
  status ENUM('success', 'failed', 'pending', 'refunded') DEFAULT 'pending',
  amount INT NOT NULL,  -- 결제 금액
  failure_reason TEXT NULL,  -- 실패 사유
  retry_count INT DEFAULT 0,  -- 재시도 횟수
  is_first_payment BOOLEAN DEFAULT FALSE,  -- 최초 결제 여부
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_subscription_id (subscription_id),
  INDEX idx_payment_date (payment_date),
  INDEX idx_status (status)
);
```

### 4. `subscription_notifications` 테이블 (신규 생성)
이메일 알림 발송 이력

```sql
CREATE TABLE subscription_notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  subscription_id INT NOT NULL,
  notification_type ENUM('payment_reminder', 'payment_success', 'payment_failed', 'subscription_cancelled') NOT NULL,
  sent_at DATETIME NOT NULL,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id),
  INDEX idx_subscription_id (subscription_id),
  INDEX idx_sent_at (sent_at)
);
```

### 5. `product_activations` 테이블 (신규 생성 또는 기존 테이블 수정)
상품 활성화 코드 관리 (결제 실패 시 정지용)

```sql
CREATE TABLE product_activations (
  activation_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  order_id INT NOT NULL,
  subscription_id INT NULL,  -- 정기결제인 경우
  activation_code VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('active', 'suspended', 'expired', 'revoked') DEFAULT 'active',
  activated_at DATETIME NULL,
  suspended_at DATETIME NULL,
  suspended_reason TEXT NULL,  -- 정지 사유 (결제 실패 등)
  grace_period_end_date DATE NULL,  -- 유예 기간 종료일
  expires_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (product_id) REFERENCES Products(id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id),
  INDEX idx_activation_code (activation_code),
  INDEX idx_status (status),
  INDEX idx_subscription_id (subscription_id)
);
```

### 6. 기존 테이블 수정

#### `orders` 테이블에 컬럼 추가
```sql
ALTER TABLE orders ADD COLUMN subscription_id INT NULL;
ALTER TABLE orders ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN is_first_payment BOOLEAN DEFAULT FALSE;  -- 최초 결제 여부
ALTER TABLE orders ADD COLUMN parent_order_id INT NULL;  -- 최초 주문 ID (정기결제인 경우)
ALTER TABLE orders ADD FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id);
ALTER TABLE orders ADD FOREIGN KEY (parent_order_id) REFERENCES orders(id);
```

#### `Users` 테이블에 컬럼 추가 (이미 있을 수도 있음)
```sql
ALTER TABLE Users ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'ko';  -- 사용자 언어 설정
```

---

## 🔧 백엔드 구현

### 1. 필요한 패키지
```json
{
  "node-cron": "^3.0.3",  // 스케줄러 (정기결제 실행)
  "nodemailer": "^7.0.11"  // 이미 설치됨
}
```

### 2. 디렉토리 구조
```
ECSite-server/GIT/ECSite-server/
├── features/
│   ├── subscription/
│   │   ├── subscriptionModel.js
│   │   ├── subscriptionItemModel.js
│   │   ├── subscriptionPaymentModel.js
│   │   ├── subscriptionNotificationModel.js
│   │   ├── subscriptionService.js
│   │   ├── subscriptionController.js
│   │   └── subscriptionRoutes.js
│   ├── productactivation/
│   │   ├── productActivationModel.js
│   │   ├── productActivationService.js
│   │   ├── productActivationController.js
│   │   └── productActivationRoutes.js
│   └── email/
│       ├── emailService.js
│       ├── emailTemplates.js
│       └── emailScheduler.js
└── jobs/
    ├── subscriptionScheduler.js  // 정기결제 실행 스케줄러
    └── notificationScheduler.js  // 이메일 알림 스케줄러
```

### 3. 주요 서비스 함수

#### `subscriptionService.js`
- `createSubscription(orderId, paymentMethodId, couponId, userLanguage)` - 구독 생성 (최초 결제는 이미 완료된 상태)
- `processMonthlyPayment(subscriptionId)` - 월별 결제 처리 (최초 결제 이후)
- `sendPaymentReminder(subscriptionId)` - 결제 5일 전 알림
- `generateReminderToken(subscriptionId)` - 이메일 링크용 토큰 생성
- `validateReminderToken(token)` - 토큰 검증
- `handlePaymentFailure(subscriptionId, reason)` - 결제 실패 처리
- `suspendProductActivations(subscriptionId)` - 활성화 코드 정지
- `checkGracePeriod(subscriptionId)` - 유예 기간 확인
- `updatePaymentMethod(subscriptionId, newPaymentMethodId)` - 결제 수단 변경
- `updateCoupon(subscriptionId, couponId)` - 쿠폰 변경
- `updateUserLanguage(subscriptionId, language)` - 사용자 언어 설정 변경
- `cancelSubscription(subscriptionId)` - 구독 취소

#### `productActivationService.js`
- `createActivation(userId, productId, orderId, subscriptionId)` - 활성화 코드 생성
- `suspendActivation(activationId, reason)` - 활성화 코드 정지
- `reactivateActivation(activationId)` - 활성화 코드 재활성화
- `getUserActivations(userId)` - 사용자 활성화 코드 목록

#### `emailService.js`
- `sendPaymentReminderEmail(subscription, products, nextPaymentDate, language)` - 결제 안내 이메일 (3개국어)
- `sendPaymentSuccessEmail(subscription, order, language)` - 결제 성공 이메일 (3개국어)
- `sendPaymentFailedEmail(subscription, reason, language)` - 결제 실패 이메일 (3개국어)
- `getEmailTemplate(templateName, language, data)` - 이메일 템플릿 가져오기 (언어별)

### 4. 스케줄러 작업

#### `subscriptionScheduler.js`
```javascript
// 매일 자정에 실행
// 1. 다음 결제일이 오늘인 구독 찾기
// 2. 각 구독에 대해 결제 처리
// 3. 결제 성공/실패에 따른 처리
```

#### `notificationScheduler.js`
```javascript
// 매일 오전 9시에 실행
// 1. 다음 결제일이 5일 후인 구독 찾기
// 2. 아직 알림을 보내지 않은 경우 이메일 발송
// 3. 알림 이력 저장
```

### 5. API 엔드포인트

#### 구독 관리
- `POST /api/subscriptions` - 구독 생성 (주문 생성 시)
- `GET /api/subscriptions/users/:userId` - 사용자 구독 목록
- `GET /api/subscriptions/:id` - 구독 상세
- `PUT /api/subscriptions/:id/payment-method` - 결제 수단 변경
- `PUT /api/subscriptions/:id/coupon` - 쿠폰 변경
- `POST /api/subscriptions/:id/cancel` - 구독 취소

#### 활성화 코드 관리
- `GET /api/product-activations/users/:userId` - 사용자 활성화 코드 목록
- `POST /api/product-activations/:id/reactivate` - 재활성화 (재결제 후)

#### 정기결제 안내 페이지
- `GET /api/subscriptions/reminder/:token` - 토큰으로 구독 정보 조회 (이메일 링크용, 인증 필요)
- `PUT /api/subscriptions/:id/payment-method` - 결제 수단 변경
- `PUT /api/subscriptions/:id/coupon` - 쿠폰 변경
- `PUT /api/subscriptions/:id/language` - 언어 설정 변경

---

## 🎨 프론트엔드 구현

### 1. 새로운 페이지/컴포넌트

#### `/subscription/reminder/:token` - 정기결제 안내 페이지
- **접근 방식**: 이메일 링크 클릭 → 로그인 페이지로 리다이렉트 → 로그인 후 토큰과 함께 안내 페이지로 이동
- **인증**: 로그인 필수 (토큰만으로는 접근 불가)
- **기능**:
  - 결제일, 상품 목록 표시
  - 카드 정보 변경 버튼 (프로필 설정 페이지로 이동)
  - 쿠폰 입력 폼 (학생 계정용)
  - 결제 실패 시 처리 방법 안내
  - 유예 기간 안내 (결제 실패한 경우)

#### `/subscription/manage` - 구독 관리 페이지
- 사용자의 모든 구독 목록
- 구독 상태, 다음 결제일
- 결제 수단 변경
- 구독 취소

#### `/subscription/payment-failed` - 결제 실패 페이지
- 실패한 구독 목록
- 재결제 버튼
- 활성화 코드 정지 안내

### 2. 기존 페이지 수정

#### 주문 생성 시 (`orderService.js`)
- **최초 결제**: 일반 주문과 동일하게 즉시 결제 처리
- `is_subscription: true`인 경우:
  1. 주문 생성 및 즉시 결제 완료 처리
  2. `subscriptions` 테이블에 구독 생성 (status: 'active')
  3. `subscription_items`에 상품 추가
  4. `product_activations`에 활성화 코드 생성
  5. `next_payment_date`를 다음 달 말일로 설정
  6. `reminder_token` 생성 및 만료일 설정
  7. 사용자 언어 설정 저장

---

## 📧 이메일 템플릿 (3개국어 지원)

### 이메일 언어 결정
- 사용자의 `preferred_language` 설정 사용
- 기본값: 'ko' (한국어)
- 지원 언어: 'ko' (한국어), 'en' (영어), 'ja' (일본어)

### 1. 결제 5일 전 안내 이메일

#### 한국어
**제목**: [AIDE Market] 정기결제 안내 - {{nextPaymentDate}}

**내용**:
```
안녕하세요 {{userName}}님,

다음 정기결제가 {{nextPaymentDate}}에 예정되어 있습니다.

[결제 정보]
- 다음 결제일: {{nextPaymentDate}}
- 결제 금액: ¥{{amount}}
- 결제 수단: {{cardCompany}} ****-****-****-{{last4}}

[결제 상품]
{{productList}}

[액션]
- 카드 정보 변경: {{changeCardLink}}
- 쿠폰 입력 (학생 계정용): {{couponLink}}
- 구독 관리: {{manageLink}}

[결제 실패 시]
결제가 실패할 경우, 상품 활성화 코드가 정지되며 3일의 유예 기간이 제공됩니다.
유예 기간 내에 재결제하시면 즉시 서비스를 재개할 수 있습니다.

문의사항이 있으시면 고객센터로 연락주세요.
```

#### 영어
**제목**: [AIDE Market] Subscription Payment Reminder - {{nextPaymentDate}}

**내용**: (한국어와 동일한 구조, 영어로 번역)

#### 일본어
**제목**: [AIDE Market] 定期支払いのお知らせ - {{nextPaymentDate}}

**내용**: (한국어와 동일한 구조, 일본어로 번역)

### 2. 결제 성공 이메일

#### 한국어
**제목**: [AIDE Market] 정기결제 완료

**내용**:
```
안녕하세요 {{userName}}님,

정기결제가 성공적으로 완료되었습니다.

[결제 정보]
- 주문 번호: {{orderNumber}}
- 결제 금액: ¥{{amount}}
- 결제일: {{paymentDate}}
- 다음 결제일: {{nextPaymentDate}}

감사합니다.
```

#### 영어/일본어: 동일한 구조로 번역

### 3. 결제 실패 이메일

#### 한국어
**제목**: [AIDE Market] 정기결제 실패 안내

**내용**:
```
안녕하세요 {{userName}}님,

정기결제 처리 중 문제가 발생했습니다.

[실패 정보]
- 결제 시도일: {{paymentDate}}
- 실패 사유: {{failureReason}}
- 유예 기간: {{gracePeriodEndDate}}까지

[중요 안내]
결제 실패로 인해 상품 활성화 코드가 정지되었습니다.
{{gracePeriodEndDate}}까지 재결제하시면 서비스를 계속 이용하실 수 있습니다.

[재결제하기]
{{retryPaymentLink}}

유예 기간 내 재결제 시 즉시 서비스가 재개됩니다.
문의사항이 있으시면 고객센터로 연락주세요.
```

#### 영어/일본어: 동일한 구조로 번역

### 4. 이메일 링크 구조
- **정기결제 안내 페이지**: `https://yourdomain.com/subscription/reminder/:token`
- **로그인 처리**: 
  1. 토큰이 포함된 링크 클릭
  2. 로그인 페이지로 리다이렉트 (`/login?redirect=/subscription/reminder/:token`)
  3. 로그인 성공 후 토큰과 함께 안내 페이지로 이동
  4. 토큰 검증 후 구독 정보 표시

---

## ⚙️ 스케줄러 설정

### 1. 정기결제 실행 스케줄러
- **실행 시간**: 매일 00:00 (자정)
- **작업**: 
  1. `next_payment_date`가 오늘인 구독 조회
  2. 각 구독에 대해 결제 처리
  3. 주문 생성
  4. 결제 성공/실패 처리

### 2. 이메일 알림 스케줄러
- **실행 시간**: 매일 09:00 (오전 9시)
- **작업**:
  1. `next_payment_date`가 5일 후인 구독 조회
  2. 아직 알림을 보내지 않은 경우 이메일 발송
  3. 알림 이력 저장

---

## 🔐 보안 고려사항

1. **이메일 링크 토큰**
   - JWT 토큰 사용 (만료 시간: 7일)
   - 토큰에 subscription_id 포함

2. **결제 수단 변경**
   - 인증된 사용자만 변경 가능
   - 기존 결제 수단과 새 결제 수단 모두 본인 소유 확인

3. **활성화 코드 정지 및 유예 기간**
   - 결제 실패 즉시 활성화 코드 정지 (`status: 'suspended'`)
   - 유예 기간: 결제 실패일로부터 3일
   - `grace_period_end_date`에 유예 기간 종료일 저장
   - 유예 기간 내 재결제 시 즉시 재활성화
   - 유예 기간 경과 후에도 재결제 가능 (정지 상태 유지)

4. **이메일 링크 보안**
   - JWT 토큰 사용 (만료 시간: 7일)
   - 토큰에 subscription_id, user_id 포함
   - 로그인 필수 (토큰만으로는 접근 불가)
   - 토큰 검증 후 사용자 본인 확인

---

## 📝 구현 순서

### Phase 1: 데이터베이스 및 모델
1. 데이터베이스 테이블 생성
2. Sequelize 모델 생성
3. 모델 관계 설정

### Phase 2: 백엔드 기본 기능
1. 구독 생성 API
2. 구독 조회 API
3. 이메일 서비스 기본 구조

### Phase 3: 스케줄러
1. 정기결제 실행 스케줄러
2. 이메일 알림 스케줄러

### Phase 4: 프론트엔드
1. 정기결제 안내 페이지
2. 구독 관리 페이지
3. 결제 실패 페이지

### Phase 5: 이메일 템플릿
1. 결제 안내 이메일
2. 결제 성공 이메일
3. 결제 실패 이메일

### Phase 6: 결제 실패 처리
1. 활성화 코드 정지 로직
2. 재결제 플로우
3. 재활성화 로직

---

## 🚨 주의사항

1. **트랜잭션 처리**: 결제 처리 시 반드시 트랜잭션 사용
2. **에러 핸들링**: 결제 실패 시 롤백 및 알림
3. **로깅**: 모든 결제 시도 및 결과 로깅
4. **재시도 로직**: 결제 실패 시 자동 재시도 (최대 3회)
5. **데이터 백업**: 정기결제 관련 데이터는 중요하므로 정기 백업

---

## 📦 추가 필요 패키지

### 백엔드
```json
{
  "node-cron": "^3.0.3"  // 스케줄러
}
```

### 프론트엔드
추가 패키지 없음 (기존 라이브러리로 충분)

---

## 🔄 데이터 흐름

### 정기결제 프로세스

#### 최초 결제 (주문 생성 시)
1. 사용자가 주문 생성 (정기결제 동의 체크)
2. **즉시 결제 처리** (일반 주문과 동일)
3. 주문 생성 및 결제 완료
4. `subscriptions` 테이블에 구독 생성
5. `subscription_items`에 상품 추가
6. `product_activations`에 활성화 코드 생성
7. `next_payment_date`를 다음 달 말일로 설정
8. `reminder_token` 생성
9. 사용자 언어 설정 저장

#### 정기결제 (매월 말일)
1. 다음 결제일 5일 전: 이메일 안내 발송 (사용자 언어로)
2. 다음 결제일: 자동 결제 실행
3. **결제 성공**:
   - 새 주문 생성 (`is_recurring: true`, `is_first_payment: false`)
   - `subscription_payments`에 기록
   - 활성화 코드 유지
   - `next_payment_date`를 다음 달 말일로 업데이트
   - 결제 성공 이메일 발송
4. **결제 실패**:
   - `subscription_payments`에 실패 기록
   - 활성화 코드 정지 (`status: 'suspended'`)
   - `grace_period_end_date` 설정 (3일 후)
   - 결제 실패 이메일 발송
   - 재결제 유도

#### 재결제 (결제 실패 후)
1. 사용자가 재결제 페이지 접근
2. 결제 처리
3. 결제 성공 시:
   - 활성화 코드 재활성화 (`status: 'active'`)
   - `grace_period_end_date` 초기화
   - `next_payment_date`를 다음 달 말일로 업데이트
   - 재활성화 이메일 발송

---

---

## 🔄 추가 고려사항

### 1. 로그인 플로우 (이메일 링크)
```
사용자가 이메일 링크 클릭
  ↓
/login?redirect=/subscription/reminder/:token (로그인 페이지)
  ↓
로그인 성공
  ↓
/subscription/reminder/:token (정기결제 안내 페이지)
  ↓
토큰 검증 및 구독 정보 표시
```

### 2. 사용자 언어 설정
- 사용자 프로필에서 언어 설정 가능
- 구독 생성 시 사용자의 `preferred_language` 저장
- 이메일 발송 시 저장된 언어로 발송
- 사용자가 언어 변경 시 구독의 `user_language` 업데이트

### 3. 쿠폰 적용
- 학생 계정용 쿠폰 입력 가능
- 쿠폰은 다음 결제부터 적용
- 쿠폰 변경 시 `subscription.coupon_id` 업데이트
- 결제 금액 계산 시 쿠폰 할인 적용

### 4. 결제 수단 변경
- 사용자가 언제든지 결제 수단 변경 가능
- 변경 시 `subscription.payment_method_id` 업데이트
- 다음 결제부터 새 결제 수단 사용

### 5. 구독 취소
- 사용자가 언제든지 구독 취소 가능
- 취소 시 `status: 'cancelled'`로 변경
- 다음 결제일부터 결제 중단
- 활성화 코드는 유지 (이미 결제한 기간 동안)

### 6. 결제 재시도 로직
- 결제 실패 시 자동 재시도 (최대 3회)
- 재시도 간격: 1일, 2일, 3일
- 모든 재시도 실패 시 활성화 코드 정지 및 유예 기간 시작

### 7. 데이터 일관성
- 모든 결제 관련 작업은 트랜잭션으로 처리
- 결제 실패 시 롤백
- 활성화 코드 정지/재활성화도 트랜잭션 내에서 처리

### 8. 모니터링 및 알림
- 결제 실패율 모니터링
- 유예 기간 만료 전 알림 (1일 전)
- 구독 취소 통계
- 정기결제 성공률 추적

---

## 📱 프론트엔드 라우팅

### 라우트 구조
```javascript
// App.js 또는 routes 설정
<Route path="/subscription/reminder/:token" component={SubscriptionReminder} />
<Route path="/subscription/manage" component={SubscriptionManage} />
<Route path="/subscription/payment-failed" component={PaymentFailed} />
<Route path="/login" component={Login} />  // redirect 파라미터 지원
```

### 로그인 페이지 수정
```javascript
// 로그인 성공 후
const redirect = new URLSearchParams(location.search).get('redirect');
if (redirect) {
  history.push(redirect);
} else {
  history.push('/');
}
```

---

## 🎨 UI/UX 고려사항

### 정기결제 안내 페이지 (`/subscription/reminder/:token`)
- **헤더**: "정기결제 안내"
- **결제 정보 카드**: 다음 결제일, 금액, 결제 수단
- **상품 목록**: 구독 중인 상품들
- **액션 버튼**:
  - 카드 정보 변경 (프로필 설정으로 이동)
  - 쿠폰 입력 (모달 또는 인라인 폼)
- **안내 섹션**: 결제 실패 시 처리 방법
- **유예 기간 표시**: 결제 실패한 경우 유예 기간 카운트다운

### 구독 관리 페이지 (`/subscription/manage`)
- 구독 목록 (카드 형태)
- 각 구독별: 상태, 다음 결제일, 상품 목록
- 액션: 결제 수단 변경, 쿠폰 변경, 구독 취소

### 결제 실패 페이지 (`/subscription/payment-failed`)
- 실패한 구독 목록
- 유예 기간 표시
- 재결제 버튼
- 활성화 코드 정지 안내

---

## 🚀 추가 구현 사항

### 1. 주문 생성 시 정기결제 처리 로직
```javascript
// orderService.js의 createOrder 함수 수정
if (isSubscription) {
  // 1. 일반 주문 생성 및 즉시 결제 완료 처리
  const order = await createOrder(...);
  
  // 2. 구독 생성 (최초 결제는 이미 완료)
  const subscription = await subscriptionService.createSubscription({
    orderId: order.id,
    paymentMethodId: payment_id,
    couponId: coupon_id,
    userLanguage: user.preferred_language || 'ko'
  });
  
  // 3. 활성화 코드 생성
  await productActivationService.createActivationsForSubscription(
    subscription.subscription_id,
    order.id
  );
}
```

### 2. 이메일 템플릿 파일 구조
```
features/email/
├── templates/
│   ├── payment-reminder-ko.html
│   ├── payment-reminder-en.html
│   ├── payment-reminder-ja.html
│   ├── payment-success-ko.html
│   ├── payment-success-en.html
│   ├── payment-success-ja.html
│   ├── payment-failed-ko.html
│   ├── payment-failed-en.html
│   └── payment-failed-ja.html
└── emailTemplates.js  // 템플릿 로더
```

### 3. 스케줄러 초기화
```javascript
// app/server.js 또는 index.js에 추가
const cron = require('node-cron');
const subscriptionScheduler = require('./jobs/subscriptionScheduler');
const notificationScheduler = require('./jobs/notificationScheduler');

// 서버 시작 시 스케줄러 실행
subscriptionScheduler.start();
notificationScheduler.start();
```

### 4. 토큰 생성 및 검증
```javascript
// subscriptionService.js
const jwt = require('jsonwebtoken');

generateReminderToken(subscriptionId, userId) {
  const token = jwt.sign(
    { subscriptionId, userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  // DB에 토큰 저장
  return token;
}

validateReminderToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
```

### 5. 유예 기간 체크 로직
```javascript
// subscriptionService.js
checkGracePeriod(subscriptionId) {
  const subscription = await findById(subscriptionId);
  if (subscription.grace_period_end_date) {
    const today = new Date();
    const graceEnd = new Date(subscription.grace_period_end_date);
    if (today > graceEnd) {
      // 유예 기간 경과
      return { inGracePeriod: false, daysRemaining: 0 };
    } else {
      // 유예 기간 중
      const daysRemaining = Math.ceil((graceEnd - today) / (1000 * 60 * 60 * 24));
      return { inGracePeriod: true, daysRemaining };
    }
  }
  return { inGracePeriod: false, daysRemaining: 0 };
}
```

### 6. 결제 실패 시 자동 재시도
```javascript
// subscriptionScheduler.js
async function processPaymentWithRetry(subscriptionId, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await processPayment(subscriptionId);
      if (result.success) {
        return result;
      }
    } catch (error) {
      if (attempt === maxRetries) {
        // 최종 실패
        await handlePaymentFailure(subscriptionId, error.message);
        return { success: false, error: error.message };
      }
      // 재시도 전 대기 (1일, 2일, 3일)
      await new Promise(resolve => setTimeout(resolve, attempt * 24 * 60 * 60 * 1000));
    }
  }
}
```

### 7. 활성화 코드 정지/재활성화
```javascript
// productActivationService.js
async function suspendActivationsForSubscription(subscriptionId, reason) {
  const activations = await findActivationsBySubscription(subscriptionId);
  const graceEndDate = new Date();
  graceEndDate.setDate(graceEndDate.getDate() + 3); // 3일 후
  
  await Promise.all(activations.map(activation => 
    updateActivation(activation.activation_id, {
      status: 'suspended',
      suspended_at: new Date(),
      suspended_reason: reason,
      grace_period_end_date: graceEndDate
    })
  ));
}

async function reactivateActivationsForSubscription(subscriptionId) {
  const activations = await findActivationsBySubscription(subscriptionId);
  await Promise.all(activations.map(activation => 
    updateActivation(activation.activation_id, {
      status: 'active',
      suspended_at: null,
      suspended_reason: null,
      grace_period_end_date: null
    })
  ));
}
```

### 8. 사용자 언어 설정
```javascript
// userService.js 또는 subscriptionService.js
async function updateUserLanguage(userId, language) {
  // 사용자 언어 업데이트
  await User.update(
    { preferred_language: language },
    { where: { id: userId } }
  );
  
  // 해당 사용자의 모든 구독 언어도 업데이트
  await Subscription.update(
    { user_language: language },
    { where: { user_id: userId } }
  );
}
```

### 9. 프론트엔드 로그인 리다이렉트 처리
```javascript
// routes/auth/login/index.js 수정
const location = useLocation();
const history = useHistory();

// 로그인 성공 후
const handleLoginSuccess = () => {
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect');
  
  if (redirect) {
    history.push(redirect);
  } else {
    history.push('/');
  }
};
```

### 10. 정기결제 안내 페이지 접근 제어
```javascript
// routes/subscription/reminder/[token]/index.js
useEffect(() => {
  const checkAuth = async () => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!user) {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      history.push(`/login?redirect=/subscription/reminder/${token}`);
      return;
    }
    
    // 토큰 검증 및 구독 정보 로드
    try {
      const response = await api.subscriptions.getByReminderToken(token);
      setSubscription(response.data.subscription);
    } catch (error) {
      message.error('유효하지 않은 링크입니다.');
      history.push('/');
    }
  };
  
  checkAuth();
}, [token]);
```

---

## 📋 체크리스트

### 데이터베이스
- [ ] `subscriptions` 테이블 생성
- [ ] `subscription_items` 테이블 생성
- [ ] `subscription_payments` 테이블 생성
- [ ] `subscription_notifications` 테이블 생성
- [ ] `product_activations` 테이블 생성
- [ ] `orders` 테이블에 컬럼 추가
- [ ] `Users` 테이블에 `preferred_language` 컬럼 추가

### 백엔드
- [ ] Sequelize 모델 생성 (5개)
- [ ] 모델 관계 설정
- [ ] `subscriptionService.js` 구현
- [ ] `productActivationService.js` 구현
- [ ] `emailService.js` 구현 (3개국어)
- [ ] 이메일 템플릿 파일 생성 (9개)
- [ ] `subscriptionScheduler.js` 구현
- [ ] `notificationScheduler.js` 구현
- [ ] API 엔드포인트 구현
- [ ] 주문 생성 시 구독 생성 로직 추가
- [ ] 토큰 생성/검증 로직
- [ ] 유예 기간 로직
- [ ] 활성화 코드 정지/재활성화 로직

### 프론트엔드
- [ ] `/subscription/reminder/:token` 페이지
- [ ] `/subscription/manage` 페이지
- [ ] `/subscription/payment-failed` 페이지
- [ ] 로그인 페이지 리다이렉트 처리
- [ ] 토큰 검증 및 인증 처리
- [ ] 구독 관리 UI
- [ ] 결제 수단 변경 UI
- [ ] 쿠폰 입력 UI
- [ ] 유예 기간 표시 UI

### 테스트
- [ ] 최초 결제 테스트
- [ ] 정기결제 실행 테스트
- [ ] 이메일 발송 테스트 (3개국어)
- [ ] 결제 실패 처리 테스트
- [ ] 유예 기간 테스트
- [ ] 재결제 테스트
- [ ] 활성화 코드 정지/재활성화 테스트

---

이 설계 문서를 바탕으로 단계적으로 구현하면 됩니다.

