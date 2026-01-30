# 🔄 API 변경사항 가이드 (프론트엔드 참고)

> 결제 구조 재구현으로 인한 API 변경사항

**Base URL**: `http://localhost:8081`

---

## ⚠️ 주요 변경사항 요약

1. **주문 생성 API**: `payment_id` 기반으로 변경 (카드 정보 직접 전송 불가)
2. **결제수단 등록 API**: 필드명 변경 (`card_cvc` → `cvc`)
3. **주문 조회 응답**: `orderItems`, `orderCoupons` 포함
4. **결제수단 응답**: 구조 변경 (카드 정보가 `creditCard` 객체로 분리)

---

## 📋 1. 주문 생성 API 변경

### ❌ 기존 방식 (더 이상 사용 불가)
```http
POST /api/orders
Content-Type: application/json

{
  "user_id": 1,
  "total_amount": 50000,
  "payment_method": "credit_card",
  "card_company": "VISA",
  "card_number": "1234567890123456",
  "card_cvc": "123",
  "exp_month": 12,
  "exp_year": 2025,
  "card_id": 1,
  "status": "pending"
}
```

### ✅ 새로운 방식
```http
POST /api/orders
Content-Type: application/json

{
  "user_id": 1,
  "total_amount": 50000,
  "payment_id": 1,  // ⚠️ 필수: 미리 등록한 결제수단 ID
  "status": "pending"  // 선택사항 (기본값: "pending")
}
```

**변경 사항:**
- ❌ 제거: `payment_method`, `card_company`, `card_number`, `card_cvc`, `exp_month`, `exp_year`, `card_id`
- ✅ 추가: `payment_id` (필수)
- 주문 전에 결제수단을 먼저 등록해야 함

**응답 예시:**
```json
{
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "ORD-1234567890-1234",
    "status": "pending",
    "total_amount": 50000,
    "payment_id": 1,
    "purchased_at": "2025-01-20T10:30:00.000Z",
    "user": {
      "id": 1,
      "username": "user1",
      "email": "user1@example.com"
    },
    "paymentMethod": {
      "id": 1,
      "user_id": 1,
      "payment_method": "credit_card",
      "is_default": true,
      "card_id": 1,
      "creditCard": {
        "card_id": 1,
        "card_company": "VISA",
        "card_holder": "홍길동",
        "exp_month": 12,
        "exp_year": 2025
      }
    },
    "orderItems": [],
    "orderCoupons": []
  }
}
```

---

## 📋 2. 결제수단 등록 API 변경

### 필드명 변경

**❌ 기존 필드명:**
- `card_cvc`

**✅ 새로운 필드명:**
- `cvc`

### 요청 예시
```http
POST /api/payment-methods
Content-Type: application/json

{
  "user_id": 1,
  "payment_method": "credit_card",  // 선택사항 (기본값: "credit_card")
  "card_company": "VISA",  // 선택사항
  "card_holder": "홍길동",  // 선택사항
  "card_number": "1234567890123456",  // 필수 (카드 정보 등록 시)
  "cvc": "123",  // ⚠️ 필드명 변경: card_cvc → cvc
  "exp_month": 12,  // 선택사항
  "exp_year": 2025,  // 선택사항
  "is_default": true  // 선택사항 (기본값: false)
}
```

### 응답 예시
```json
{
  "paymentMethod": {
    "id": 1,
    "user_id": 1,
    "payment_method": "credit_card",
    "is_default": true,
    "card_id": 1,
    "card_company": "VISA",
    "card_holder": "홍길동",
    "card_number": "****-****-****-3456",  // 마스킹 처리됨
    "exp_month": 12,
    "exp_year": 2025
  }
}
```

**변경 사항:**
- 카드 정보가 평면 구조로 반환됨 (기존과 동일)
- 카드 번호는 마스킹 처리됨 (`****-****-****-1234`)

---

## 📋 3. 주문 조회 API 응답 변경

### 주문 조회 응답에 추가된 필드

**✅ 추가된 필드:**
- `orderItems`: 구매한 상품 목록
- `orderCoupons`: 적용된 쿠폰 목록

### 응답 예시
```http
GET /api/orders/1
```

```json
{
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "ORD-1234567890-1234",
    "status": "completed",
    "total_amount": 50000,
    "payment_id": 1,
    "purchased_at": "2025-01-20T10:30:00.000Z",
    "user": {
      "id": 1,
      "username": "user1",
      "email": "user1@example.com"
    },
    "paymentMethod": {
      "id": 1,
      "user_id": 1,
      "payment_method": "credit_card",
      "is_default": true,
      "card_id": 1,
      "creditCard": {
        "card_id": 1,
        "card_company": "VISA",
        "card_holder": "홍길동",
        "exp_month": 12,
        "exp_year": 2025
      }
    },
    "orderItems": [  // ⚠️ 새로 추가됨
      {
        "id": 1,
        "order_id": 1,
        "product_id": 3,
        "quantity": 1,
        "unit_price": 50000,
        "has_review": false,
        "product": {
          "id": 3,
          "name": "CodePix",
          "price": 50000,
          "seller": "佐藤健太",
          "imageUrl": "uploads/ai/codepix.png",
          "description": "バニラJavaScript開発の専門家...",
          "category_id": 1,
          "sub_category_id": 1
        }
      }
    ],
    "orderCoupons": [  // ⚠️ 새로 추가됨
      {
        "order_coupon_id": 1,
        "order_id": 1,
        "user_id": 1,
        "coupon_id": 1,
        "applied_value": 5000,
        "created_at": "2025-01-20T10:30:00.000Z",
        "coupon": {
          "coupon_id": 1,
          "code": "SAVE10",
          "discount_type": "amount",
          "discount_value": 5000
        }
      }
    ]
  }
}
```

**변경 사항:**
- `orderItems`: 빈 배열이거나 구매한 상품 목록
- `orderCoupons`: 빈 배열이거나 적용된 쿠폰 목록
- 각 항목에 관련 정보(product, coupon)가 포함됨

---

## 📋 4. 결제수단 조회 API 응답 변경

### 응답 구조 변경

**기존 응답:**
```json
{
  "paymentMethod": {
    "id": 1,
    "user_id": 1,
    "payment_method": "credit_card",
    "card_company": "VISA",
    "card_number_encrypted": "...",
    "exp_month": 12,
    "exp_year": 2025,
    "is_default": true
  }
}
```

**새로운 응답:**
```json
{
  "paymentMethod": {
    "id": 1,
    "user_id": 1,
    "payment_method": "credit_card",
    "is_default": true,
    "card_id": 1,  // ⚠️ 추가됨
    "card_company": "VISA",  // creditCard에서 평면화
    "card_holder": "홍길동",  // ⚠️ 추가됨
    "card_number": "****-****-****-3456",  // 마스킹 처리
    "exp_month": 12,
    "exp_year": 2025
  }
}
```

**변경 사항:**
- 카드 정보가 평면 구조로 반환됨 (사용 편의성)
- `card_id` 필드 추가
- `card_holder` 필드 추가
- 카드 번호는 마스킹 처리됨

---

## 📋 5. 주문 목록 조회 API

### 응답 구조

```http
GET /api/orders?page=1&limit=20&user_id=1&status=completed
```

**응답 예시:**
```json
{
  "total": 10,
  "page": 1,
  "limit": 20,
  "totalPages": 1,
  "orders": [
    {
      "id": 1,
      "user_id": 1,
      "order_number": "ORD-1234567890-1234",
      "status": "completed",
      "total_amount": 50000,
      "payment_id": 1,
      "purchased_at": "2025-01-20T10:30:00.000Z",
      "user": { ... },
      "paymentMethod": { ... },
      "orderItems": [ ... ],  // ⚠️ 새로 추가됨
      "orderCoupons": [ ... ]  // ⚠️ 새로 추가됨
    }
  ]
}
```

---

## 🔄 마이그레이션 가이드

### 프론트엔드 수정 필요 사항

1. **주문 생성 로직 변경**
   ```javascript
   // ❌ 기존 코드
   const orderData = {
     user_id: userId,
     total_amount: totalAmount,
     payment_method: "credit_card",
     card_company: cardCompany,
     card_number: cardNumber,
     card_cvc: cardCvc,  // 필드명 변경 필요
     exp_month: expMonth,
     exp_year: expYear
   };
   
   // ✅ 새로운 코드
   // 1단계: 결제수단 등록 (이미 등록되어 있다면 생략)
   const paymentMethod = await registerPaymentMethod({
     user_id: userId,
     card_company: cardCompany,
     card_number: cardNumber,
     cvc: cardCvc,  // 필드명 변경
     exp_month: expMonth,
     exp_year: expYear,
     is_default: true
   });
   
   // 2단계: 주문 생성
   const orderData = {
     user_id: userId,
     total_amount: totalAmount,
     payment_id: paymentMethod.id  // 등록한 결제수단 ID 사용
   };
   ```

2. **결제수단 등록 필드명 변경**
   ```javascript
   // ❌ 기존
   card_cvc: "123"
   
   // ✅ 새로운
   cvc: "123"
   ```

3. **주문 조회 응답 처리**
   ```javascript
   // ✅ 새로운 응답 구조
   const order = response.data.order;
   
   // 구매한 상품 목록
   const products = order.orderItems.map(item => item.product);
   
   // 적용된 쿠폰 목록
   const coupons = order.orderCoupons.map(oc => oc.coupon);
   ```

---

## 📝 API 엔드포인트 요약

### 주문 관련
- `POST /api/orders` - 주문 생성 (변경됨)
- `GET /api/orders` - 주문 목록 조회 (응답 변경)
- `GET /api/orders/:id` - 주문 상세 조회 (응답 변경)
- `GET /api/orders/order-number/:orderNumber` - 주문 번호로 조회 (응답 변경)
- `GET /api/orders/users/:userId` - 사용자별 주문 목록 (응답 변경)
- `PUT /api/orders/:id` - 주문 업데이트
- `DELETE /api/orders/:id` - 주문 삭제

### 결제수단 관련
- `POST /api/payment-methods` - 결제수단 등록 (필드명 변경)
- `GET /api/payment-methods/:id` - 결제수단 조회 (응답 변경)
- `GET /api/payment-methods/users/:userId` - 사용자별 결제수단 목록 (응답 변경)
- `PUT /api/payment-methods/:id` - 결제수단 업데이트 (필드명 변경)
- `DELETE /api/payment-methods/:id` - 결제수단 삭제

---

## ⚠️ 주의사항

1. **주문 생성 전 결제수단 등록 필수**
   - 주문 생성 시 `payment_id`가 필수이므로, 먼저 결제수단을 등록해야 합니다.

2. **카드 정보 암호화**
   - 카드 번호와 CVC는 서버에서 자동으로 암호화되어 저장됩니다.
   - 응답에는 마스킹된 카드 번호만 반환됩니다.

3. **결제수단 소유권 검증**
   - 주문 생성 시 해당 결제수단이 사용자의 것인지 자동으로 검증됩니다.

4. **주문 조회 응답**
   - `orderItems`와 `orderCoupons`는 항상 배열로 반환됩니다 (빈 배열일 수 있음).

---

## 📞 문의

API 변경사항에 대한 문의는 백엔드 팀에 연락해주세요.

