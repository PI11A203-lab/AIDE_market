# AIDE Market 완전 개선 계획서

> AIDE Market 플랫폼의 추가 기능 및 개선 사항에 대한 종합 계획 문서  
> 현재 디자인 기반 + 임팩트 강화 기능 통합

---

## 📋 목차

1. [프로젝트 현황](#프로젝트-현황)
2. [핵심 개선 목표](#핵심-개선-목표)
3. [우선순위 분류](#우선순위-분류)
4. [상품 상세 페이지 개선](#상품-상세-페이지-개선)
5. [팀 구성 페이지 개선](#팀-구성-페이지-개선)
6. [메인 페이지 개선](#메인-페이지-개선)
7. [시스템 안정성 강화](#시스템-안정성-강화)
8. [필수 비즈니스 기능](#필수-비즈니스-기능)
9. [고급 기능](#고급-기능)
10. [구현 일정](#구현-일정)

---

## 🎯 프로젝트 현황

### ✅ 완료된 기능
- 기본 상품 CRUD
- 레이더 차트 시각화
- 팀 구성 시너지 계산
- 리뷰 시스템
- 다국어 지원 (한/영/일)
- 기본 보안 시스템

### ⚠️ 현재 문제점
- **상품 페이지**: 능력치만 보여주고 해석 부족
- **팀 구성**: 시너지 점수만 있고 "왜 좋은지" 설명 없음
- **메인 페이지**: 평범한 그리드 나열
- **동시성 처리**: 동시 구매 시 데이터 일관성 문제
- **환불 시스템**: 없음
- **상품 승인**: 자동 검증 부족

---

## 🎯 핵심 개선 목표

### 1. 차별화 포인트 강화
- 기존 AI 마켓과 달리 **"조합의 재미"** 강조
- 능력치 시각화 → **실전 활용 가이드**

### 2. 사용자 구매 결정 지원
- "이 AI가 내 프로젝트에 맞나?" **명확한 답변**
- 팀 구성 시 **실시간 피드백**

### 3. 엔터프라이즈급 안정성
- 동시성 처리, 트랜잭션 안정성
- 환불, 승인 등 비즈니스 로직

---

## 🎯 우선순위 분류

### 🔴 Priority 1: 핵심 안정성 (즉시 구현 필요)
1. **동시 구매 요청 처리** - 데이터 일관성 보장
2. **결제 실패 시 트랜잭션 처리** - 안전한 롤백
3. **테이블 구조 조회 성능 최적화** - 사용자 경험 향상
4. **환불 관리 시스템** - 필수 비즈니스 로직

### 🟡 Priority 2: 사용자 경험 (단기 구현)
5. **유저 탈퇴 처리 및 데이터 관리** - GDPR 준수
6. **상품 업로드 기준 및 검증** - 품질 관리
7. **AI 추천 챗봇** - 개인화된 추천
8. **상품 페이지 임팩트 강화** - 능력치 해석, 적합 프로젝트, 추천 조합

### 🟢 Priority 3: UI/UX 개선 (중기 구현)
9. **팀 구성 페이지 임팩트 강화** - 시너지 이유, 팀 보강 제안, 밸런스 시각화
10. **메인 페이지 개선** - Hero 배너 강화, 카테고리 베스트, 인기 팀 조합
11. **팀 시너지 시각화 개선** (색상별 구분)
12. **레이더 차트 그래픽 요소** - 상품 능력치 시각화

### 🔵 Priority 4: 고급 기능 (장기 구현)
13. **관리자 템플릿/상품세트 등록** - 비즈니스 확장
14. **상품 적합성 표시** (동그라미, 세모, X)
15. **퍼포먼스 최적화** - 전반적인 성능 개선

---

## 🔴 Priority 1: 핵심 안정성

### 1.1 동시 구매 요청 처리

#### 문제 상황
- 동일 상품에 대해 여러 사용자가 동시에 구매 요청 시 재고/데이터 일관성 문제 발생 가능

#### 해결 방안

##### 1.1.1 데이터베이스 레벨 처리
```sql
-- Optimistic Locking을 위한 version 컬럼 추가
ALTER TABLE Products ADD COLUMN version INT DEFAULT 0;

-- Pessimistic Locking 사용 (트랜잭션 내)
SELECT * FROM Products WHERE id = ? FOR UPDATE;
```

##### 1.1.2 백엔드 로직
```javascript
// features/order/orderService.js
async function createOrder(userId, items) {
  const transaction = await sequelize.transaction();
  
  try {
    for (const item of items) {
      // 1. version과 함께 상품 조회
      const product = await Product.findOne({
        where: { 
          id: item.product_id,
          version: item.version  // 클라이언트가 본 version
        },
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      
      if (!product) {
        throw new Error('상품 정보가 변경되었습니다. 다시 시도해주세요.');
      }
      
      // 2. version 증가
      await product.update({
        version: product.version + 1
      }, { transaction });
    }
    
    // 3. 주문 생성
    const order = await Order.create({
      user_id: userId,
      total_amount: calculateTotal(items),
      status: 'pending'
    }, { transaction });
    
    // 4. 주문 아이템 생성
    await OrderItem.bulkCreate(
      items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        price: item.price
      })),
      { transaction }
    );
    
    await transaction.commit();
    return order;
    
  } catch (error) {
    await transaction.rollback();
    
    if (error.message.includes('version')) {
      // 재시도 로직
      return createOrder(userId, items);
    }
    
    throw error;
  }
}
```

##### 1.1.3 구현 위치
- `features/order/orderService.js` - `createOrder()` 함수
- `features/product/productModel.js` - version 컬럼 추가

##### 1.1.4 체크리스트
- [ ] Products 테이블에 `version` 컬럼 추가
- [ ] Optimistic Locking 로직 구현
- [ ] 충돌 시 재시도 로직
- [ ] 프론트엔드 에러 처리
- [ ] 동시성 테스트 (부하 테스트)

---

### 1.2 결제 실패 시 트랜잭션 처리

#### 문제 상황
- 결제 처리 중 실패 시 부분적으로 데이터가 저장되는 문제
- 주문 생성 후 결제 실패 시 주문 데이터 정리 필요

#### 해결 방안

##### 1.2.1 트랜잭션 구조
```javascript
// features/payment/paymentService.js
async function processPayment(orderId) {
  const transaction = await sequelize.transaction();
  
  try {
    // 1. 주문 조회
    const order = await Order.findByPk(orderId, { transaction });
    
    if (!order) {
      throw new Error('주문을 찾을 수 없습니다.');
    }
    
    // 2. 결제 처리 (외부 API)
    const paymentResult = await paymentGateway.charge({
      amount: order.total_amount,
      order_id: orderId,
      // ...
    });
    
    if (!paymentResult.success) {
      throw new PaymentError(
        paymentResult.error_message || '결제 실패'
      );
    }
    
    // 3. 주문 상태 업데이트
    await order.update({
      status: 'paid',
      payment_id: paymentResult.payment_id,
      paid_at: new Date()
    }, { transaction });
    
    // 4. 활성화 코드 생성
    const items = await OrderItem.findAll({
      where: { order_id: orderId },
      transaction
    });
    
    for (const item of items) {
      await ActivationCode.create({
        order_item_id: item.id,
        code: generateActivationCode(),
        status: 'active'
      }, { transaction });
    }
    
    // 5. 판매 통계 업데이트
    await updateSalesStats(order, transaction);
    
    await transaction.commit();
    
    // 6. 이메일 발송 (트랜잭션 외부)
    await sendPurchaseEmail(order);
    
    return {
      success: true,
      order
    };
    
  } catch (error) {
    await transaction.rollback();
    
    // 실패 기록
    await FailedPayment.create({
      order_id: orderId,
      error_message: error.message,
      error_stack: error.stack,
      retry_count: 0
    });
    
    // 에러 타입별 처리
    if (error instanceof PaymentError) {
      return {
        success: false,
        error: 'payment_failed',
        message: error.message
      };
    }
    
    throw error;
  }
}
```

##### 1.2.2 실패 처리 테이블
```sql
CREATE TABLE failed_payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  error_message TEXT,
  error_stack TEXT,
  retry_count INT DEFAULT 0,
  last_retry_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id),
  INDEX idx_retry (retry_count, last_retry_at)
);
```

##### 1.2.3 구현 위치
- `features/payment/paymentService.js`
- `features/payment/paymentModel.js` (FailedPayment)

##### 1.2.4 체크리스트
- [ ] failed_payments 테이블 생성
- [ ] 트랜잭션 범위 명확화
- [ ] 결제 실패 처리 로직
- [ ] 재시도 로직 (선택)
- [ ] 롤백 테스트

---

### 1.3 테이블 구조 조회 성능 최적화

#### 현재 문제
- 대량 데이터 조회 시 느린 응답 시간
- N+1 쿼리 문제
- 인덱스 부족

#### 최적화 방안

##### 1.3.1 인덱스 추가
```sql
-- 자주 조회되는 컬럼에 인덱스 추가
CREATE INDEX idx_products_category ON Products(category_id, sub_category_id);
CREATE INDEX idx_products_rating ON Products(rating_average DESC, rating_count DESC);
CREATE INDEX idx_products_created ON Products(createdAt DESC);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_order_items_order ON order_items(order_id, product_id);

-- 복합 인덱스 (WHERE + ORDER BY)
CREATE INDEX idx_products_category_rating ON Products(category_id, rating_average DESC);
```

##### 1.3.2 쿼리 최적화
```javascript
// N+1 문제 해결: Eager Loading 사용
const products = await Product.findAll({
  include: [
    { model: Category, as: 'category' },
    { model: SubCategory, as: 'subCategory' },
    { model: Stats, as: 'stats' },
    { model: Tag, as: 'tags', through: { attributes: [] } }
  ],
  limit: 20,
  offset: (page - 1) * 20
});
```

##### 1.3.3 캐싱 전략
- **Redis 캐싱**: 자주 조회되는 데이터 (카테고리, 인기 상품)
- **캐시 TTL**: 카테고리(1시간), 상품 상세(30분), 인기 상품(10분)

##### 1.3.4 구현 위치
- 데이터베이스 마이그레이션 파일
- `features/product/productService.js`
- `features/order/orderService.js`
- Redis 캐싱 레이어 추가

##### 1.3.5 체크리스트
- [ ] 쿼리 성능 분석 (EXPLAIN)
- [ ] 필수 인덱스 추가
- [ ] Eager Loading 적용
- [ ] Redis 캐싱 구현
- [ ] 성능 테스트 (부하 테스트)

---

### 1.4 환불 관리 시스템

#### 요구사항
- 환불 요청 처리
- 환불 상태 관리
- 환불 이력 추적
- 환불 정책 관리

#### 구현 방안

##### 1.4.1 데이터베이스 설계
```sql
CREATE TABLE refunds (
  refund_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  refund_amount INT NOT NULL,
  refund_reason TEXT,
  status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME NULL,
  completed_at DATETIME NULL,
  admin_notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (product_id) REFERENCES Products(id),
  INDEX idx_order_id (order_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);
```

##### 1.4.2 환불 정책
```javascript
// features/refund/refundService.js
const REFUND_POLICY = {
  FULL_REFUND_DAYS: 7,      // 7일 이내 전액 환불
  PARTIAL_REFUND_DAYS: 30,  // 30일 이내 부분 환불 (심사)
  NO_REFUND_DAYS: 30        // 30일 이후 환불 불가
};

async function canRequestRefund(orderItemId) {
  const item = await OrderItem.findOne({
    where: { id: orderItemId },
    include: [
      { model: Order, as: 'order' },
      { model: ActivationCode, as: 'activationCode' }
    ]
  });
  
  if (!item) {
    throw new Error('주문 항목을 찾을 수 없습니다.');
  }
  
  // 1. 활성화 코드 사용 여부 체크
  if (item.activationCode && item.activationCode.status === 'used') {
    return {
      canRefund: false,
      reason: 'activation_code_used',
      message: '활성화 코드가 이미 사용되었습니다.'
    };
  }
  
  // 2. 구매일 체크
  const daysSincePurchase = Math.floor(
    (Date.now() - item.order.createdAt) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSincePurchase <= REFUND_POLICY.FULL_REFUND_DAYS) {
    return {
      canRefund: true,
      refundType: 'full',
      message: '전액 환불 가능 기간입니다.'
    };
  }
  
  if (daysSincePurchase <= REFUND_POLICY.PARTIAL_REFUND_DAYS) {
    return {
      canRefund: true,
      refundType: 'partial',
      requiresApproval: true,
      message: '관리자 심사 후 부분 환불 가능합니다.'
    };
  }
  
  return {
    canRefund: false,
    reason: 'period_expired',
    message: '환불 가능 기간이 지났습니다.'
  };
}
```

**환불 정책 요약**:
- **구매 후 7일 이내**: 전체 환불 가능
- **구매 후 7-30일**: 부분 환불 (관리자 심사)
- **구매 후 30일 초과**: 환불 불가 (특별한 경우 제외)
- **활성화 코드 사용 여부**: 사용 시 환불 불가

##### 1.4.3 API 엔드포인트
```javascript
// features/refund/refundRoutes.js
router.post('/refunds', auth, async (req, res) => {
  // 환불 요청 생성
});

router.get('/refunds/users/:userId', auth, async (req, res) => {
  // 사용자 환불 목록
});

router.get('/refunds/:id', auth, async (req, res) => {
  // 환불 상세
});

router.put('/refunds/:id/approve', auth, requireAdmin, async (req, res) => {
  // 환불 승인 (관리자)
});

router.put('/refunds/:id/reject', auth, requireAdmin, async (req, res) => {
  // 환불 거부 (관리자)
});

router.put('/refunds/:id/complete', auth, requireAdmin, async (req, res) => {
  // 환불 완료 처리
});
```

##### 1.4.4 구현 위치
- `features/refund/refundModel.js`
- `features/refund/refundService.js`
- `features/refund/refundController.js`
- `features/refund/refundRoutes.js`

##### 1.4.5 구현 파일
- `features/refund/refundModel.js`
- `features/refund/refundService.js`
- `features/refund/refundController.js`
- `features/refund/refundRoutes.js`
- `frontend/src/pages/RefundRequest.jsx` (사용자)
- `frontend/src/pages/admin/RefundManagement.jsx` (관리자)

##### 1.4.6 체크리스트
- [ ] refunds 테이블 생성
- [ ] 환불 정책 로직
- [ ] API 엔드포인트 구현
- [ ] 사용자 환불 신청 UI
- [ ] 관리자 환불 관리 UI
- [ ] 이메일 알림 (승인/거부)
- [ ] 환불 통계 (관리자 대시보드)

---

## 🟡 Priority 2: 사용자 경험

### 2.1 유저 탈퇴 처리 및 데이터 관리

#### 요구사항
- 유저 탈퇴 시 개인정보 완전 삭제 (GDPR 준수)
- 탈퇴한 유저가 남긴 리뷰/데이터 처리 방식 결정
- 탈퇴 유예 기간 (30일)

#### 구현 방안

##### 2.1.1 데이터 처리 방식 옵션

**옵션 A: 소프트 삭제 (Soft Delete) - 권장**
- `Users` 테이블에 `deleted_at` 컬럼 추가
- 개인정보는 삭제, 리뷰 등은 "탈퇴한 사용자"로 표시
- 30일 후 물리적 삭제 (스케줄러)

**옵션 B: 익명화**
- 개인정보만 익명화 (username, email 등)
- 리뷰/주문은 유지 (통계용)

**옵션 C: 물리적 삭제**
- 모든 데이터 삭제 (리뷰 포함)
- 통계 데이터 손실

##### 2.1.2 데이터베이스 구조
```sql
-- Users 테이블 수정
ALTER TABLE Users 
ADD COLUMN deleted_at DATETIME NULL,
ADD COLUMN deletion_scheduled_at DATETIME NULL,
ADD INDEX idx_deleted_at (deleted_at);

-- 탈퇴 사유 수집
CREATE TABLE user_deletions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  email_hash VARCHAR(64), -- SHA256 (재가입 방지)
  deletion_reason ENUM('privacy', 'not_useful', 'too_expensive', 'switching_service', 'other'),
  deletion_comment TEXT,
  deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_hash (email_hash),
  INDEX idx_deleted_at (deleted_at)
);

-- 리뷰 익명화
ALTER TABLE reviews 
ADD COLUMN is_anonymous BOOLEAN DEFAULT FALSE;
```

##### 2.1.3 탈퇴 프로세스
```javascript
// features/user/userService.js
async function deleteUser(userId, reason, comment) {
  const transaction = await sequelize.transaction();
  
  try {
    const user = await User.findByPk(userId, { transaction });
    
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    
    // 1. 소프트 삭제
    await user.update({
      deleted_at: new Date(),
      deletion_scheduled_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
      // 개인정보 즉시 익명화
      email: `deleted_${user.id}@aide-market.com`,
      username: `탈퇴한사용자_${user.id}`,
      phone: null,
      address: null,
      profile_image: null
    }, { transaction });
    
    // 2. 리뷰 익명화
    await Review.update(
      { is_anonymous: true },
      { where: { user_id: userId }, transaction }
    );
    
    // 3. 탈퇴 사유 기록
    await UserDeletion.create({
      user_id: userId,
      email_hash: crypto.createHash('sha256').update(user.email).digest('hex'),
      deletion_reason: reason,
      deletion_comment: comment
    }, { transaction });
    
    // 4. 토큰 무효화
    await RefreshToken.destroy({
      where: { user_id: userId },
      transaction
    });
    
    await transaction.commit();
    
    // 5. 30일 후 물리적 삭제 스케줄링
    schedulePhysicalDeletion(userId);
    
    return { success: true };
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// 물리적 삭제 (스케줄러)
async function physicallyDeleteUser(userId) {
  const transaction = await sequelize.transaction();
  
  try {
    const user = await User.findOne({
      where: {
        id: userId,
        deleted_at: { [Op.not]: null },
        deletion_scheduled_at: { [Op.lte]: new Date() }
      },
      transaction
    });
    
    if (!user) {
      return;
    }
    
    // 관련 데이터 삭제 (CASCADE로 자동 처리되지 않는 것들)
    await Follow.destroy({
      where: {
        [Op.or]: [
          { follower_id: userId },
          { following_id: userId }
        ]
      },
      transaction
    });
    
    // 사용자 완전 삭제
    await user.destroy({ transaction });
    
    await transaction.commit();
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

**스케줄러 설정**:
```javascript
// jobs/userDeletionScheduler.js
const cron = require('node-cron');

// 매일 자정에 실행
cron.schedule('0 0 * * *', async () => {
  console.log('Running user deletion scheduler...');
  
  const usersToDelete = await User.findAll({
    where: {
      deleted_at: { [Op.not]: null },
      deletion_scheduled_at: { [Op.lte]: new Date() }
    }
  });
  
  for (const user of usersToDelete) {
    try {
      await physicallyDeleteUser(user.id);
      console.log(`Physically deleted user ${user.id}`);
    } catch (error) {
      console.error(`Failed to delete user ${user.id}:`, error);
    }
  }
});
```

**API 엔드포인트**:
```javascript
router.delete('/users/me', auth, async (req, res) => {
  // 탈퇴 신청
});

router.post('/users/me/cancel-deletion', auth, async (req, res) => {
  // 탈퇴 취소 (30일 이내)
});
```

##### 2.1.4 리뷰 처리
- 리뷰는 유지하되 작성자 표시: "탈퇴한 사용자"
- 평점은 통계에 포함

##### 2.1.4 구현 파일
- `features/user/userService.js`
- `jobs/userDeletionScheduler.js`
- `frontend/src/pages/settings/DeleteAccount.jsx`

##### 2.1.5 체크리스트
- [ ] Users 테이블 deleted_at 컬럼
- [ ] user_deletions 테이블 생성
- [ ] 소프트 삭제 로직
- [ ] 개인정보 익명화
- [ ] 물리적 삭제 스케줄러
- [ ] 탈퇴 UI (사유 선택)
- [ ] 탈퇴 유예 기간 안내

---

### 2.2 상품 업로드 기준 및 검증

#### 요구사항
- 상품 업로드 시 품질 기준 정의
- 자동/수동 검증 프로세스
- 관리자 승인 시스템

#### 구현 방안

##### 2.2.1 상품 업로드 기준

**필수 항목**
- 상품명 (3-100자)
- 설명 (최소 50자)
- 이미지 (1장 이상, 권장: 3장)
- 카테고리/서브카테고리
- 가격 (최소 1,000원)
- AI 통계 데이터 (6개 항목 모두)

**품질 기준**
- 설명의 상세도 점수 (AI 기반)
- 이미지 품질 (해상도, 명확도)
- 태그 정확도

##### 2.2.2 검증 프로세스

**자동 검증**
- 필수 항목 체크
- 형식 검증 (이메일, URL 등)
- 이미지 크기/형식 검증
- 스팸 필터링

**수동 검증 (관리자)**
- 상품 설명 품질
- 적절한 카테고리 분류
- 가격 정당성

##### 2.2.3 데이터베이스 구조
```sql
ALTER TABLE Products 
ADD COLUMN status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'pending',
ADD COLUMN submitted_at DATETIME NULL,
ADD COLUMN approved_at DATETIME NULL,
ADD COLUMN approved_by INT NULL,
ADD COLUMN rejected_at DATETIME NULL,
ADD COLUMN rejection_reason TEXT NULL,
ADD COLUMN quality_score INT NULL COMMENT '0-100',
ADD INDEX idx_status (status),
ADD INDEX idx_submitted_at (submitted_at DESC);
```

##### 2.2.4 검증 로직
```javascript
// features/product/productValidation.js
const VALIDATION_RULES = {
  name: {
    minLength: 3,
    maxLength: 100,
    required: true
  },
  description: {
    minLength: 50,
    maxLength: 5000,
    required: true
  },
  price: {
    min: 1000,
    max: 1000000,
    required: true
  },
  images: {
    minCount: 1,
    maxCount: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  stats: {
    required: ['teamwork', 'stability', 'speed', 'creativity', 'productivity', 'maintainability'],
    min: 0,
    max: 100
  }
};

async function validateProduct(productData) {
  const errors = [];
  
  // 필수 항목 체크
  if (!productData.name || productData.name.length < VALIDATION_RULES.name.minLength) {
    errors.push({
      field: 'name',
      message: `상품명은 최소 ${VALIDATION_RULES.name.minLength}자 이상이어야 합니다.`
    });
  }
  
  // 설명 품질 체크
  if (productData.description.length < VALIDATION_RULES.description.minLength) {
    errors.push({
      field: 'description',
      message: `설명은 최소 ${VALIDATION_RULES.description.minLength}자 이상이어야 합니다.`
    });
  }
  
  // AI 통계 검증
  for (const stat of VALIDATION_RULES.stats.required) {
    if (!productData.stats[stat] || productData.stats[stat] < 0 || productData.stats[stat] > 100) {
      errors.push({
        field: `stats.${stat}`,
        message: `${stat}은(는) 0-100 사이 값이어야 합니다.`
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// 품질 점수 계산
async function calculateQualityScore(productData) {
  let score = 0;
  
  // 설명 길이 (최대 30점)
  score += Math.min(productData.description.length / 20, 30);
  
  // 이미지 개수 (최대 20점)
  score += Math.min(productData.images.length * 5, 20);
  
  // AI 통계 완성도 (최대 30점)
  const statsComplete = Object.values(productData.stats)
    .filter(v => v > 0).length;
  score += (statsComplete / 6) * 30;
  
  // 태그 개수 (최대 10점)
  score += Math.min(productData.tags.length * 2, 10);
  
  // 카테고리 정확도 (최대 10점)
  score += productData.category_id && productData.sub_category_id ? 10 : 0;
  
  return Math.round(score);
}
```

##### 2.2.5 API 엔드포인트
```javascript
// features/product/productRoutes.js
router.post('/products', auth, upload.array('images', 5), async (req, res) => {
  // 상품 등록 (status: 'pending')
  const validation = await validateProduct(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }
  
  const qualityScore = await calculateQualityScore(req.body);
  
  // qualityScore >= 70이면 자동 승인, 아니면 관리자 심사
  const status = qualityScore >= 70 ? 'approved' : 'pending';
  
  // ...
});

router.get('/products/pending', auth, requireAdmin, async (req, res) => {
  // 승인 대기 상품 목록 (관리자)
});

router.put('/products/:id/approve', auth, requireAdmin, async (req, res) => {
  // 상품 승인
});

router.put('/products/:id/reject', auth, requireAdmin, async (req, res) => {
  // 상품 거부
});
```

##### 2.2.6 구현 파일
- `features/product/productValidation.js`
- `features/product/productService.js` (수정)
- `frontend/src/pages/seller/ProductCreate.jsx`
- `frontend/src/pages/admin/ProductApproval.jsx`

##### 2.2.7 체크리스트
- [ ] Products 테이블 status 컬럼 추가
- [ ] 자동 검증 로직
- [ ] 품질 점수 계산
- [ ] 관리자 승인 API
- [ ] 관리자 승인 대시보드
- [ ] 셀러 알림 (승인/거부)

---

### 2.3 AI 추천 챗봇

#### 요구사항
- 사용자가 원하는 프로젝트 유형 입력
- 프로젝트에 맞는 AI 추천
- 상세 페이지로 바로 이동

#### 구현 방안

##### 2.3.1 챗봇 플로우
```
사용자 입력: "스마트폰 앱을 만들고 싶어요"
    ↓
프로젝트 유형 분석 (카테고리 매칭)
    ↓
추천 AI 목록 생성
    ↓
상세 정보 제공 + 상세 페이지 링크
```

##### 2.3.2 프로젝트 템플릿 (관리자가 등록)
```sql
CREATE TABLE project_templates (
  template_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_ids JSON, -- 관련 카테고리 배열
  keywords JSON, -- 키워드 배열
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE template_product_matches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  template_id INT NOT NULL,
  product_id INT NOT NULL,
  compatibility ENUM('perfect', 'good', 'fair', 'poor') NOT NULL,
  FOREIGN KEY (template_id) REFERENCES project_templates(template_id),
  FOREIGN KEY (product_id) REFERENCES Products(id),
  INDEX idx_template_id (template_id)
);
```

##### 2.3.3 추천 알고리즘
- 키워드 매칭 (사용자 입력 ↔ 템플릿 키워드)
- 카테고리 매칭
- 시너지 점수 고려
- 인기도 (다운로드 수, 평점) 고려

##### 2.3.4 API 엔드포인트
```
POST /api/chatbot/recommend - AI 추천 요청
GET /api/project-templates - 프로젝트 템플릿 목록
POST /api/project-templates - 템플릿 생성 (관리자)
```

##### 2.3.5 구현 위치
- `features/chatbot/chatbotService.js`
- `features/chatbot/chatbotController.js`
- 프론트엔드: 챗봇 컴포넌트

##### 2.3.6 체크리스트
- [ ] project_templates 테이블 생성
- [ ] 템플릿-상품 매칭 테이블 생성
- [ ] 추천 알고리즘 구현
- [ ] 챗봇 UI 컴포넌트
- [ ] 관리자 템플릿 등록 UI

---

---

## 📦 상품 상세 페이지 개선

### 현재 상태
- ✅ Hero Section (이름, 가격, 평점)
- ✅ 기본 통계 (Total Hires, Completion Rate 등)
- ✅ 레이더 차트 (6개 능력치)
- ✅ 리뷰 섹션

### 추가할 기능

#### 2.4.1 능력치 해석 섹션 (레이더 차트 아래)

**목적**: 숫자만 보여주지 말고 "이게 무슨 의미인지" 설명

**구현 내용**:
```jsx
// 위치: 레이더 차트 바로 아래
<AbilityInsights>
  <InsightCard type="strength">
    <Icon>💪</Icon>
    <Title>강점</Title>
    <Description>
      Teamwork(95)와 Creativity(93)가 뛰어나 
      협업 중심 프로젝트에 최적
    </Description>
  </InsightCard>
  
  <InsightCard type="warning">
    <Icon>⚠️</Icon>
    <Title>보완 추천</Title>
    <Description>
      Speed(88)가 보통 수준 - Backend AI와 조합 시 효율 향상
    </Description>
  </InsightCard>
</AbilityInsights>
```

**데이터 구조**:
```javascript
// 백엔드에서 자동 계산
const insights = {
  strengths: [
    {
      stat: 'teamwork',
      value: 95,
      description: '협업 중심 프로젝트에 최적',
      rank: '상위 5%'
    }
  ],
  weaknesses: [
    {
      stat: 'speed',
      value: 88,
      suggestion: 'Backend AI와 조합 추천'
    }
  ]
};
```

**API 엔드포인트**:
```
GET /api/products/:id/insights
Response: {
  strengths: [...],
  weaknesses: [...],
  overallGrade: 'A+'
}
```

**구현 파일**:
- `features/product/productService.js` - `generateInsights()` 함수
- `frontend/src/components/ProductDetail/AbilityInsights.jsx`

**체크리스트**:
- [ ] 능력치 자동 분석 로직 (90+ 강점, 75 이하 약점)
- [ ] 강점/약점 카드 컴포넌트
- [ ] 3개 국어 번역 (insights 텍스트)
- [ ] 반응형 디자인 (모바일 대응)

---

#### 2.4.2 적합한 프로젝트 섹션

**목적**: "이 AI를 어떤 프로젝트에 써야 할까?" 답변

**구현 내용**:
```jsx
<SuitableProjects>
  <SectionTitle>
    <Icon>🎯</Icon>
    이런 프로젝트에 딱이에요
  </SectionTitle>
  
  <ProjectGrid>
    <ProjectCard match="perfect">
      <MatchBadge>✅ 최적</MatchBadge>
      <ProjectName>기술 문서 작성</ProjectName>
      <Reason>높은 문서화 능력 + 체계적 구조</Reason>
      <Stats>
        <StatItem>Maintainability: 93</StatItem>
        <StatItem>Creativity: 88</StatItem>
      </Stats>
    </ProjectCard>
    
    <ProjectCard match="good">
      <MatchBadge>○ 적합</MatchBadge>
      <ProjectName>팀 프로젝트</ProjectName>
      <Reason>팀워크 95점으로 협업에 강함</Reason>
    </ProjectCard>
    
    <ProjectCard match="caution">
      <MatchBadge>△ 보완 필요</MatchBadge>
      <ProjectName>빠른 프로토타입</ProjectName>
      <Reason>속도 보완 위해 다른 AI 추가 권장</Reason>
      <RecommendedCombo>
        <Avatar>FastCoder</Avatar>
        <Text>와 조합 추천</Text>
      </RecommendedCombo>
    </ProjectCard>
  </ProjectGrid>
</SuitableProjects>
```

**데이터베이스 설계**:
```sql
CREATE TABLE project_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  required_stats JSON, -- {"speed": 80, "teamwork": 70}
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_project_matches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  project_type_id INT NOT NULL,
  match_level ENUM('perfect', 'good', 'fair', 'poor'),
  match_score INT, -- 0-100
  reason TEXT,
  FOREIGN KEY (product_id) REFERENCES Products(id),
  FOREIGN KEY (project_type_id) REFERENCES project_types(id),
  INDEX idx_product_id (product_id)
);
```

**API 엔드포인트**:
```
GET /api/products/:id/suitable-projects
Response: {
  projects: [
    {
      name: '기술 문서 작성',
      match_level: 'perfect',
      match_score: 95,
      reason: '높은 문서화 능력',
      required_stats: {...}
    }
  ]
}
```

**매칭 로직**:
```javascript
// features/product/productService.js
async function calculateProjectMatch(product, projectType) {
  const requiredStats = projectType.required_stats;
  let matchScore = 0;
  let totalWeight = 0;
  
  for (const [stat, requiredValue] of Object.entries(requiredStats)) {
    const productValue = product.stats[stat];
    const weight = requiredValue / 100; // 가중치
    
    if (productValue >= requiredValue) {
      matchScore += 100 * weight;
    } else {
      matchScore += (productValue / requiredValue) * 100 * weight;
    }
    
    totalWeight += weight;
  }
  
  const finalScore = matchScore / totalWeight;
  
  return {
    match_level: getMatchLevel(finalScore),
    match_score: Math.round(finalScore),
    reason: generateReason(product, projectType)
  };
}

function getMatchLevel(score) {
  if (score >= 90) return 'perfect';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}
```

**구현 파일**:
- `features/product/productService.js` - 매칭 로직
- `features/project/projectTypeModel.js`
- `frontend/src/components/ProductDetail/SuitableProjects.jsx`

**체크리스트**:
- [ ] project_types 테이블 생성
- [ ] 기본 프로젝트 타입 데이터 삽입 (10개 이상)
- [ ] 매칭 알고리즘 구현
- [ ] API 엔드포인트 구현
- [ ] 프론트엔드 컴포넌트
- [ ] 관리자가 프로젝트 타입 추가할 수 있는 UI (선택)

---

#### 2.4.3 추천 조합 섹션 (상품 하단)

**목적**: "이 AI와 함께 쓰면 좋은 다른 AI" 추천

**구현 내용**:
```jsx
<RecommendedCombos>
  <SectionTitle>
    <Icon>🤝</Icon>
    함께 사용하면 좋은 AI
  </SectionTitle>
  
  <ComboCards>
    <ComboCard>
      <ComboAvatars>
        <Avatar current>
          <Image src={currentProduct.image} />
          <Name>MarkdownMaster</Name>
        </Avatar>
        <PlusIcon>+</PlusIcon>
        <Avatar>
          <Image src={recommendedProduct.image} />
          <Name>SheetBot</Name>
        </Avatar>
      </ComboAvatars>
      
      <SynergyBadge score={94}>
        <Icon>⚡</Icon>
        시너지 94점
      </SynergyBadge>
      
      <ComboReason>
        문서 + 스프레드시트 완벽 조합
        <br/>
        데이터 분석 프로젝트에 최적
      </ComboReason>
      
      <ActionButtons>
        <ViewDetailsButton>조합 상세</ViewDetailsButton>
        <AddToTeamButton>팀에 추가</AddToTeamButton>
      </ActionButtons>
    </ComboCard>
  </ComboCards>
</RecommendedCombos>
```

**API 엔드포인트**:
```
GET /api/products/:id/recommended-combos
Query: ?limit=3
Response: {
  combos: [
    {
      product: {...},
      synergy_score: 94,
      reason: '문서 + 스프레드시트 완벽 조합',
      project_examples: ['데이터 분석', 'BI 대시보드']
    }
  ]
}
```

**추천 로직**:
```javascript
// 기존 synergies 테이블 활용
async function getRecommendedCombos(productId, limit = 3) {
  const combos = await db.query(`
    SELECT 
      p.*,
      s.synergy_score,
      s.reason,
      COUNT(o.id) as popularity
    FROM synergies s
    JOIN Products p ON (
      CASE 
        WHEN s.product_id_1 = ? THEN s.product_id_2
        ELSE s.product_id_1
      END = p.id
    )
    LEFT JOIN order_items oi1 ON oi1.product_id = ?
    LEFT JOIN order_items oi2 ON oi2.product_id = p.id 
      AND oi2.order_id = oi1.order_id
    WHERE s.product_id_1 = ? OR s.product_id_2 = ?
      AND s.synergy_score >= 85
    GROUP BY p.id
    ORDER BY s.synergy_score DESC, popularity DESC
    LIMIT ?
  `, [productId, productId, productId, productId, limit]);
  
  return combos;
}
```

**구현 파일**:
- `features/product/productService.js` - `getRecommendedCombos()`
- `frontend/src/components/ProductDetail/RecommendedCombos.jsx`

**체크리스트**:
- [ ] 추천 조합 로직 구현
- [ ] 인기도 기반 정렬 (같이 구매한 횟수)
- [ ] API 엔드포인트
- [ ] 프론트엔드 컴포넌트
- [ ] "팀에 추가" 버튼 → 팀 구성 페이지 이동

---

## 🤝 팀 구성 페이지 개선

### 현재 상태
- ✅ 왼쪽: AI 목록 (카테고리별 필터)
- ✅ 오른쪽: 팀 카드 (멤버, 레이더 차트, 시너지 점수)

### 추가할 기능

#### 3.1 시너지 이유 설명

**목적**: 시너지 점수만 보여주지 말고 "왜 시너지가 좋은지" 설명

**구현 내용**:
```jsx
<TeamCard>
  {/* 기존: 팀원 목록 + 레이더 차트 */}
  
  {/* 추가: 시너지 분석 */}
  <SynergyAnalysis>
    <SynergyHeader>
      <SynergyScore>
        <ScoreNumber>102</ScoreNumber>
        <ScoreGrade>최고</ScoreGrade>
      </SynergyScore>
      
      <SynergyLevel>
        <ProgressBar value={102} max={120} color="green" />
        <LevelText>A+ 등급 팀</LevelText>
      </SynergyLevel>
    </SynergyHeader>
    
    <SynergyReasons>
      <SectionTitle>
        <Icon>🤝</Icon>
        왜 이 조합이 좋을까요?
      </SectionTitle>
      
      <ReasonList>
        <ReasonItem>
          <Icon>🔄</Icon>
          <ReasonContent>
            <Title>완벽한 역할 분담</Title>
            <Description>
              문서화(MarkdownMaster 95) + 데이터(SheetBot 92)로 
              업무 효율 200% 향상
            </Description>
          </ReasonContent>
        </ReasonItem>
        
        <ReasonItem>
          <Icon>⚡</Icon>
          <ReasonContent>
            <Title>능력 시너지</Title>
            <Description>
              두 AI 모두 Creativity 90+로 
              창의적 솔루션 도출에 강함
            </Description>
          </ReasonContent>
        </ReasonItem>
      </ReasonList>
    </SynergyReasons>
  </SynergyAnalysis>
</TeamCard>
```

**시너지 이유 자동 생성 로직**:
```javascript
// features/team/teamService.js
async function generateSynergyReasons(teamMembers) {
  const reasons = [];
  
  // 1. 역할 분담 체크
  const categories = [...new Set(teamMembers.map(m => m.category))];
  if (categories.length >= 3) {
    reasons.push({
      type: 'role_distribution',
      icon: '🔄',
      title: '완벽한 역할 분담',
      description: `${categories.join(', ')} 조합으로 전체 개발 프로세스 커버`
    });
  }
  
  // 2. 능력 시너지 체크
  const stats = ['teamwork', 'creativity', 'speed'];
  for (const stat of stats) {
    const avgValue = teamMembers.reduce((sum, m) => 
      sum + m.stats[stat], 0) / teamMembers.length;
    
    if (avgValue >= 90) {
      reasons.push({
        type: 'ability_synergy',
        icon: '⚡',
        title: `높은 ${stat}`,
        description: `팀 평균 ${Math.round(avgValue)}점으로 ${stat} 특화`
      });
    }
  }
  
  // 3. 시너지 테이블에서 이유 가져오기
  for (let i = 0; i < teamMembers.length - 1; i++) {
    for (let j = i + 1; j < teamMembers.length; j++) {
      const synergy = await getSynergyBetween(
        teamMembers[i].id, 
        teamMembers[j].id
      );
      
      if (synergy && synergy.reason) {
        reasons.push({
          type: 'pair_synergy',
          icon: '🎯',
          title: '특별한 조합',
          description: synergy.reason
        });
      }
    }
  }
  
  return reasons.slice(0, 4); // 최대 4개
}
```

**API 엔드포인트**:
```
POST /api/teams/analyze-synergy
Request: {
  member_ids: [1, 5, 10]
}
Response: {
  synergy_score: 102,
  grade: 'A+',
  reasons: [...]
}
```

**구현 파일**:
- `features/team/teamService.js` - `generateSynergyReasons()`
- `frontend/src/components/TeamBuilder/SynergyAnalysis.jsx`

**체크리스트**:
- [ ] 시너지 이유 생성 로직
- [ ] synergies 테이블에 reason 컬럼 추가 (없으면)
- [ ] API 엔드포인트
- [ ] 프론트엔드 컴포넌트
- [ ] 실시간 업데이트 (팀원 추가/제거 시)

---

#### 3.2 팀 보강 제안

**목적**: 현재 팀의 약점을 보완할 AI 추천

**구현 내용**:
```jsx
<TeamSuggestions>
  <SuggestionTitle>
    <Icon>💡</Icon>
    팀 보강 추천
  </SuggestionTitle>
  
  {/* 약점 표시 */}
  <WeakPoints>
    <WeakPoint severity="high">
      <Badge color="red">Speed 부족</Badge>
      <Description>
        현재 팀 평균 Speed: 68점<br/>
        빠른 개발이 필요한 프로젝트에는 부적합
      </Description>
    </WeakPoint>
  </WeakPoints>
  
  {/* 추천 AI */}
  <RecommendedAIs>
    {recommendations.map(rec => (
      <RecommendationCard key={rec.ai.id}>
        <AIInfo>
          <Avatar src={rec.ai.image} />
          <div>
            <Name>{rec.ai.name}</Name>
            <Category>{rec.ai.category}</Category>
          </div>
        </AIInfo>
        
        <Impact>
          <ImpactTitle>추가 시 변화</ImpactTitle>
          <ImpactStats>
            <StatChange>
              <StatName>Speed</StatName>
              <Change positive>
                <Before>68</Before>
                <Arrow>→</Arrow>
                <After>84</After>
                <Diff>(+16)</Diff>
              </Change>
            </StatChange>
          </ImpactStats>
        </Impact>
        
        <Actions>
          <ViewButton>상세 보기</ViewButton>
          <AddButton>팀에 추가</AddButton>
        </Actions>
      </RecommendationCard>
    ))}
  </RecommendedAIs>
</TeamSuggestions>
```

**추천 로직**:
```javascript
// features/team/teamService.js
async function getTeamRecommendations(teamMembers) {
  // 1. 팀 능력치 계산
  const teamStats = calculateTeamStats(teamMembers);
  
  // 2. 약점 찾기
  const weaknesses = [];
  for (const [stat, value] of Object.entries(teamStats)) {
    if (value < 75) {
      weaknesses.push({
        stat,
        value,
        severity: value < 60 ? 'high' : 'medium'
      });
    }
  }
  
  // 3. 보완 AI 찾기
  const recommendations = [];
  
  for (const weakness of weaknesses) {
    const ais = await Product.findAll({
      include: [{ model: AIStats, as: 'stats' }],
      where: {
        [`$stats.${weakness.stat}$`]: { [Op.gte]: 85 },
        id: { [Op.notIn]: teamMembers.map(m => m.id) }
      },
      order: [[{ model: AIStats, as: 'stats' }, weakness.stat, 'DESC']],
      limit: 3
    });
    
    for (const ai of ais) {
      const impact = calculateImpact(teamStats, ai);
      const synergyScore = await calculateTeamSynergy([...teamMembers, ai]);
      
      recommendations.push({
        ai,
        reason: `${weakness.stat} 보완`,
        impact,
        synergy_score: synergyScore
      });
    }
  }
  
  return recommendations
    .sort((a, b) => b.synergy_score - a.synergy_score)
    .slice(0, 5);
}
```

**API 엔드포인트**:
```
POST /api/teams/recommendations
Request: {
  member_ids: [1, 5]
}
Response: {
  weaknesses: [...],
  recommendations: [...]
}
```

**구현 파일**:
- `features/team/teamService.js` - 추천 로직
- `frontend/src/components/TeamBuilder/TeamSuggestions.jsx`

**체크리스트**:
- [ ] 약점 감지 로직
- [ ] 추천 AI 찾기 로직
- [ ] 추가 시 영향 계산
- [ ] API 엔드포인트
- [ ] 프론트엔드 컴포넌트
- [ ] "팀에 추가" 버튼 기능

---

#### 3.3 팀 밸런스 시각화

**목적**: 팀 구성이 균형잡혔는지 시각적으로 표시

**구현 내용**:
```jsx
<TeamBalance>
  <BalanceTitle>
    <Icon>⚖️</Icon>
    팀 밸런스
  </BalanceTitle>
  
  {/* 카테고리별 분포 */}
  <CategoryDistribution>
    <DistributionBar>
      {categories.map(cat => (
        <Segment 
          key={cat.id}
          width={`${cat.percentage}%`}
          color={cat.color}
          title={`${cat.name}: ${cat.count}명`}
        />
      ))}
    </DistributionBar>
  </CategoryDistribution>
  
  {/* 능력치 균형 */}
  <StatsBalance>
    {Object.entries(teamStats).map(([stat, value]) => (
      <StatBalanceBar key={stat}>
        <Label>{stat}</Label>
        <Bar value={value} color={getBalanceColor(value)} />
        <StatusIcon>
          {value >= 80 ? '✓' : value >= 60 ? '△' : '✗'}
        </StatusIcon>
      </StatBalanceBar>
    ))}
  </StatsBalance>
  
  {/* 밸런스 점수 */}
  <BalanceScore>
    <ScoreCircle value={balanceScore} max={100}>
      <ScoreNumber>{balanceScore}</ScoreNumber>
      <ScoreLabel>밸런스</ScoreLabel>
    </ScoreCircle>
    
    <BalanceAdvice>
      {balanceScore >= 80 ? 
        '균형잡힌 팀 구성입니다!' :
        '일부 역할이 부족합니다. 보완을 권장합니다.'
      }
    </BalanceAdvice>
  </BalanceScore>
</TeamBalance>
```

**밸런스 계산 로직**:
```javascript
function calculateTeamBalance(teamMembers) {
  // 1. 카테고리 분포
  const categoryCount = {};
  teamMembers.forEach(m => {
    categoryCount[m.category] = (categoryCount[m.category] || 0) + 1;
  });
  
  // 2. 능력치 균형
  const stats = ['teamwork', 'stability', 'speed', 'creativity', 'productivity', 'maintainability'];
  const statValues = {};
  
  stats.forEach(stat => {
    const avg = teamMembers.reduce((sum, m) => sum + m.stats[stat], 0) / teamMembers.length;
    statValues[stat] = Math.round(avg);
  });
  
  // 3. 밸런스 점수 (표준편차 기반)
  const mean = Object.values(statValues).reduce((a, b) => a + b) / stats.length;
  const variance = Object.values(statValues)
    .reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / stats.length;
  const stdDev = Math.sqrt(variance);
  
  // 표준편차가 낮을수록 균형잡힘
  const balanceScore = Math.max(0, 100 - stdDev * 2);
  
  return {
    categories: categoryCount,
    stats: statValues,
    balanceScore: Math.round(balanceScore)
  };
}
```

**구현 파일**:
- `features/team/teamService.js` - 밸런스 계산
- `frontend/src/components/TeamBuilder/TeamBalance.jsx`

**체크리스트**:
- [ ] 밸런스 계산 로직
- [ ] 카테고리 분포 시각화
- [ ] 능력치 균형 바
- [ ] 밸런스 점수 계산
- [ ] 조언 메시지 생성

---

## 🏠 메인 페이지 개선

### 현재 상태
- ✅ Hero 배너
- ✅ AI 그리드 (카테고리별)
- ✅ Top Creators 섹션

### 추가할 기능

#### 3.4 Hero 배너 강화

**목적**: 첫 인상 강화 + 빠른 시작 유도

**구현 내용**:
```jsx
<HeroBanner>
  <HeroContent>
    <MainTitle>
      最高のAI開発者を発見し、
      <br/>
      <Highlight>共に創りましょう</Highlight>
    </MainTitle>
    
    <SubTitle>
      AI開発者を組み合わせて、自分だけの最強チームを作れます。
      <br/>
      <Stats>
        <StatBadge>300+ AI開発者</StatBadge>
        <StatBadge>10,000+ チーム作成</StatBadge>
      </Stats>
    </SubTitle>
    
    <CTAButtons>
      <PrimaryButton size="lg">
        <Icon>🔍</Icon>
        AIを探す
      </PrimaryButton>
      <SecondaryButton size="lg">
        <Icon>🤖</Icon>
        チーム構成を始める
      </SecondaryButton>
    </CTAButtons>
    
    {/* ✨ 추가: 빠른 프로젝트 매칭 */}
    <QuickMatch>
      <QuickMatchTitle>
        <Icon>⚡</Icon>
        あなたのプロジェクトは?
      </QuickMatchTitle>
      
      <QuickMatchButtons>
        <MatchButton onClick={() => navigate('/products?project=web')}>
          <Icon>💻</Icon>
          <Text>Webアプリ</Text>
        </MatchButton>
        
        <MatchButton onClick={() => navigate('/products?project=mobile')}>
          <Icon>📱</Icon>
          <Text>モバイルアプリ</Text>
        </MatchButton>
        
        <MatchButton onClick={() => navigate('/products?project=ai')}>
          <Icon>🤖</Icon>
          <Text>AI/ML</Text>
        </MatchButton>
      </QuickMatchButtons>
    </QuickMatch>
  </HeroContent>
</HeroBanner>
```

**구현 파일**:
- `frontend/src/components/Home/HeroBanner.jsx`

**체크리스트**:
- [ ] Hero 배너 리디자인
- [ ] 빠른 매칭 버튼
- [ ] 통계 배지 (실시간 카운트)
- [ ] 애니메이션 효과
- [ ] 반응형 디자인

---

#### 3.5 카테고리별 베스트 섹션

**목적**: 각 카테고리 최고 AI를 한눈에

**구현 내용**:
```jsx
<CategoryBest>
  <SectionHeader>
    <SectionTitle>カテゴリー別ベスト</SectionTitle>
    <ViewAllLink>すべて見る →</ViewAllLink>
  </SectionHeader>
  
  <CategoryGrid>
    {categories.map(category => (
      <CategoryCard key={category.id}>
        <CategoryHeader>
          <CategoryIcon>{category.icon}</CategoryIcon>
          <CategoryName>{category.name}</CategoryName>
          <CategoryCount>{category.product_count}個</CategoryCount>
        </CategoryHeader>
        
        <BestAI>
          <AIAvatar src={category.best_ai.image} />
          <AIInfo>
            <AIName>{category.best_ai.name}</AIName>
            <AIRating>
              <Stars value={category.best_ai.rating} />
              <RatingText>{category.best_ai.rating}</RatingText>
            </AIRating>
            <AIPrice>¥{category.best_ai.price.toLocaleString()}</AIPrice>
          </AIInfo>
          <ViewButton>詳細</ViewButton>
        </BestAI>
      </CategoryCard>
    ))}
  </CategoryGrid>
</CategoryBest>
```

**API 엔드포인트**:
```
GET /api/categories/best-products
Response: {
  categories: [
    {
      id: 1,
      name: 'Frontend',
      icon: '💻',
      product_count: 45,
      best_ai: {...}
    }
  ]
}
```

**구현 파일**:
- `features/category/categoryService.js`
- `frontend/src/components/Home/CategoryBest.jsx`

**체크리스트**:
- [ ] 카테고리별 베스트 조회 API
- [ ] 베스트 선정 기준 (평점 + 판매량)
- [ ] 프론트엔드 컴포넌트
- [ ] 반응형 그리드

---

#### 3.6 인기 팀 조합 섹션

**목적**: 성공 사례 보여주기

**구현 내용**:
```jsx
<PopularTeams>
  <SectionHeader>
    <SectionTitle>
      <Icon>🔥</Icon>
      人気のチーム組み合わせ
    </SectionTitle>
    <ViewAllLink>もっと見る →</ViewAllLink>
  </SectionHeader>
  
  <TeamPresets>
    {presets.map(preset => (
      <PresetCard key={preset.id}>
        <PresetBadge>
          {preset.usage_count}チーム使用中
        </PresetBadge>
        
        <PresetName>{preset.name}</PresetName>
        <PresetDescription>
          {preset.description}
        </PresetDescription>
        
        <PresetMembers>
          <MemberAvatars>
            {preset.members.map(member => (
              <Avatar 
                key={member.id}
                src={member.image}
                alt={member.name}
              />
            ))}
          </MemberAvatars>
          <MemberCount>{preset.members.length} AI</MemberCount>
        </PresetMembers>
        
        <PresetStats>
          <Stat>
            <Icon>⚡</Icon>
            <Label>シナジー</Label>
            <Value>{preset.synergy}点</Value>
          </Stat>
          <Stat>
            <Icon>💰</Icon>
            <Label>価格</Label>
            <Value>¥{preset.total_price.toLocaleString()}</Value>
          </Stat>
        </PresetStats>
        
        <PresetActions>
          <ViewButton>詳細を見る</ViewButton>
          <UseButton>この組み合わせを使う</UseButton>
        </PresetActions>
      </PresetCard>
    ))}
  </TeamPresets>
</PopularTeams>
```

**API 엔드포인트**:
```
GET /api/team-presets/popular
Query: ?limit=6
Response: {
  presets: [...]
}
```

**구현 파일**:
- `features/template/templateService.js` (기존 활용)
- `frontend/src/components/Home/PopularTeams.jsx`

**체크리스트**:
- [ ] 인기 조합 조회 API (usage_count 순)
- [ ] 프론트엔드 컴포넌트
- [ ] "사용하기" 버튼 → 팀 구성 페이지 이동
- [ ] 슬라이더 또는 그리드 레이아웃

---

## 🟢 Priority 3: UI/UX 개선 (기타)

### 3.7 팀 시너지 시각화 개선

#### 요구사항
- 팀 시너지를 색상별로 구분하여 표시
- 시각적으로 이해하기 쉽게

#### 구현 방안

##### 3.1.1 색상 코딩 시스템
- **높은 시너지 (90-100)**: 초록색 (#4CAF50)
- **좋은 시너지 (80-89)**: 청록색 (#00BCD4)
- **보통 시너지 (70-79)**: 노란색 (#FFC107)
- **낮은 시너지 (60-69)**: 주황색 (#FF9800)
- **매우 낮음 (<60)**: 빨간색 (#F44336)

##### 3.1.2 시각화 방법
- 카드 배경색 그라데이션
- 시너지 점수에 따른 테두리 색상
- 아이콘 색상 (별, 하트 등)

##### 3.1.3 구현 위치
- 프론트엔드: 팀 구성 페이지, 상품 상세 페이지

##### 3.1.4 체크리스트
- [ ] 색상 팔레트 정의
- [ ] 시너지 카드 컴포넌트 수정
- [ ] 반응형 디자인 확인

---

### 3.2 레이더 차트 그래픽 요소

#### 요구사항
- 상품 상세 페이지에 AI 능력치를 레이더 차트로 표시
- 기존 통계 데이터 활용

#### 구현 방안

##### 3.2.1 차트 라이브러리
- **Chart.js**: 간단하고 가벼움
- **Recharts**: React 전용
- **D3.js**: 고도 커스터마이징 가능

##### 3.2.2 데이터 구조
- 기존 `ai_stats` 테이블 활용
- 6개 항목: teamwork, stability, speed, creativity, productivity, maintainability

##### 3.2.3 구현 위치
- 프론트엔드: 상품 상세 페이지
- 컴포넌트: `RadarChart.js`

##### 3.2.4 체크리스트
- [ ] 차트 라이브러리 선택 및 설치
- [ ] 레이더 차트 컴포넌트 구현
- [ ] 반응형 디자인
- [ ] 애니메이션 효과 (선택사항)

---

### 3.3 AIパートナー 메인 배너

#### 요구사항
- 메인 페이지에 "AIパートナー" 배너 추가
- 콘셉트: "共創（きょうそう）：共に創る"
- 메시지: "自分に 맞는 AIパートナーを探して強チームを作ろう"

#### 구현 방안

##### 3.3.1 배너 디자인
- 큰 타이틀: "AIパートナー"
- 서브 타이틀: "共創（きょうそう）：共に創る"
- 설명: "自分に 맞く AIパートナーを探して強チームを作ろう"
- CTA 버튼: "AIを探す"

##### 3.3.2 구현 위치
- 프론트엔드: 메인 페이지 (`HomePage.js`)
- 배너 컴포넌트: `HeroBanner.js`

##### 3.3.3 체크리스트
- [ ] 배너 디자인 (Figma 등)
- [ ] HeroBanner 컴포넌트 구현
- [ ] 반응형 디자인
- [ ] 애니메이션 효과 (선택사항)

---

### 3.4 팀 구성 및 상품 안내 설명

#### 요구사항
- 사용자가 팀 구성 기능을 이해할 수 있는 안내
- 상품 선택 가이드 제공

#### 구현 방안

##### 3.4.1 안내 페이지/모달
- **팀 구성 가이드**: 시너지 시스템 설명
- **상품 선택 가이드**: 프로젝트 유형별 추천
- **FAQ 섹션**: 자주 묻는 질문

##### 3.4.2 구현 위치
- 프론트엔드: 도움말 페이지 또는 온보딩 모달

##### 3.4.3 체크리스트
- [ ] 안내 콘텐츠 작성
- [ ] 가이드 UI 컴포넌트
- [ ] 온보딩 플로우 (선택사항)

---

## 🔵 Priority 4: 고급 기능

### 4.1 관리자 템플릿/상품세트 등록

#### 요구사항
- 관리자가 프로젝트 템플릿 등록
- 각 템플릿에 추천 상품세트 구성
- 상품 적합성 표시 (동그라미◎, 동그라미○, 세모△, 엑스✕)

#### 구현 방안

##### 4.1.1 데이터베이스 구조 (2.3 참고)
```sql
-- project_templates 테이블 (2.3.2 참고)
-- template_product_matches 테이블 (2.3.2 참고)
-- compatibility: 'perfect'◎, 'good'○, 'fair'△, 'poor'✕
```

##### 4.1.2 관리자 UI
- 템플릿 등록 폼
- 상품 매칭 테이블 (적합성 선택)
- 미리보기 기능

##### 4.1.3 사용자 UI
- 프로젝트 템플릿 선택 페이지
- 템플릿별 추천 상품 테이블
- 적합성 아이콘 표시

##### 4.1.4 체크리스트
- [ ] 관리자 템플릿 관리 페이지
- [ ] 상품 매칭 UI
- [ ] 사용자 템플릿 선택 페이지
- [ ] 적합성 아이콘 표시

---

### 4.2 퍼포먼스 최적화

#### 개선 영역
1. **프론트엔드**
   - 코드 스플리팅
   - 이미지 최적화 (lazy loading)
   - 번들 크기 최적화

2. **백엔드**
   - API 응답 시간 최적화
   - 데이터베이스 쿼리 최적화
   - 캐싱 전략 (Redis)

3. **인프라**
   - CDN 도입
   - 로드 밸런싱
   - 자동 스케일링

##### 4.2.1 체크리스트
- [ ] 프론트엔드 번들 분석
- [ ] 이미지 최적화
- [ ] API 응답 시간 측정
- [ ] 캐싱 전략 수립
- [ ] 부하 테스트

---

## 📅 구현 일정

### Week 1-2: 핵심 안정성 (Priority 1)
```
✅ Day 1-3: 동시성 처리 (Optimistic Locking)
✅ Day 4-6: 결제 트랜잭션 처리
✅ Day 7-10: 성능 최적화 (인덱스)
✅ Day 11-14: 환불 시스템 기본 구현
```

### Week 3-4: 상품 페이지 임팩트 강화
```
✅ Day 15-17: 능력치 해석 섹션
✅ Day 18-20: 적합한 프로젝트 섹션
✅ Day 21-23: 추천 조합 섹션
✅ Day 24-28: 테스트 및 버그 수정
```

### Week 5-6: 팀 구성 페이지 임팩트 강화
```
✅ Day 29-31: 시너지 이유 설명
✅ Day 32-34: 팀 보강 제안
✅ Day 35-36: 팀 밸런스 시각화
✅ Day 37-38: 프로젝트 템플릿
✅ Day 39-42: 테스트 및 버그 수정
```

### Week 7-8: 필수 비즈니스 기능
```
✅ Day 43-46: 상품 승인 시스템
✅ Day 47-49: 유저 탈퇴 처리
✅ Day 50-52: 환불 시스템 완성
✅ Day 53-56: 통합 테스트
```

### Week 9-10: 메인 페이지 & 마무리
```
✅ Day 57-59: Hero 배너 강화
✅ Day 60-62: 카테고리별 베스트
✅ Day 63-65: 인기 팀 조합
✅ Day 66-70: 최종 QA 및 버그 수정
```

### ✅ 최종 체크리스트

#### 데이터베이스
- [ ] Products 테이블: version, status, quality_score 컬럼 추가
- [ ] project_types 테이블 생성
- [ ] product_project_matches 테이블 생성
- [ ] refunds 테이블 생성
- [ ] failed_payments 테이블 생성
- [ ] project_templates 테이블 생성
- [ ] template_members 테이블 생성
- [ ] user_deletions 테이블 생성
- [ ] 모든 성능 인덱스 추가

#### 백엔드 API
- [ ] 상품 인사이트 API
- [ ] 적합 프로젝트 API
- [ ] 추천 조합 API
- [ ] 팀 시너지 분석 API
- [ ] 팀 추천 API
- [ ] 환불 관리 API
- [ ] 상품 승인 API
- [ ] 프로젝트 템플릿 API

#### 프론트엔드
- [ ] 상품 상세 - 능력치 해석 컴포넌트
- [ ] 상품 상세 - 적합 프로젝트 컴포넌트
- [ ] 상품 상세 - 추천 조합 컴포넌트
- [ ] 팀 구성 - 시너지 분석 컴포넌트
- [ ] 팀 구성 - 팀 보강 제안 컴포넌트
- [ ] 팀 구성 - 밸런스 시각화
- [ ] 팀 구성 - 템플릿 선택
- [ ] 메인 - Hero 배너 개선
- [ ] 메인 - 카테고리 베스트
- [ ] 메인 - 인기 조합
- [ ] 환불 신청 페이지
- [ ] 관리자 - 환불 관리
- [ ] 관리자 - 상품 승인

#### 테스트
- [ ] 동시성 테스트 (부하 테스트)
- [ ] 트랜잭션 롤백 테스트
- [ ] 성능 테스트 (before/after)
- [ ] 환불 플로우 테스트
- [ ] 상품 승인 플로우 테스트

#### 문서화
- [ ] API 문서 업데이트
- [ ] 환불 정책 문서
- [ ] 상품 등록 가이드
- [ ] 관리자 매뉴얼

---

## 📝 참고 문서

- [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- [SUBSCRIPTION_SYSTEM_DESIGN.md](./SUBSCRIPTION_SYSTEM_DESIGN.md)
- [SECURITY_SYSTEM_DOCUMENTATION.md](./SECURITY_SYSTEM_DOCUMENTATION.md)

---

## 🎯 우선순위 요약

### 🔴 최우선 (Week 1-4)
- 동시성 처리
- 트랜잭션 안정성
- 성능 최적화
- 상품 페이지 임팩트

### 🟡 높음 (Week 5-8)
- 팀 구성 페이지 임팩트
- 환불 시스템
- 상품 승인 시스템
- 유저 탈퇴 처리

### 🟢 중간 (Week 9-10)
- 메인 페이지 개선
- 프로젝트 템플릿

### 🔵 낮음 (시간 있으면)
- AI 챗봇
- 개인화 추천

---

**작성일**: 2025-01-17  
**목표 완료일**: 2025-12-30  
**현재 진행**: Week 0 → Week 1 시작 준비
