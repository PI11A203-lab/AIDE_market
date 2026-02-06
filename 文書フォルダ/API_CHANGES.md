# 🔄 API変更ガイド（フロントエンド向け）

> 決済構造の再実装に伴うAPI変更

**Base URL**: `http://localhost:8081`

---

## ⚠️ 主な変更点まとめ

1. **注文作成API**: `payment_id` ベースに変更（カード情報の直接送信不可）
2. **決済手段登録API**: フィールド名変更（`card_cvc` → `cvc`）
3. **注文取得レスポンス**: `orderItems`、`orderCoupons` を含む
4. **決済手段レスポンス**: 構造変更（カード情報が `creditCard` オブジェクトに分離）

---

## 📋 1. 注文作成APIの変更

### ❌ 旧方式（使用不可）
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

### ✅ 新方式
```http
POST /api/orders
Content-Type: application/json

{
  "user_id": 1,
  "total_amount": 50000,
  "payment_id": 1,  // ⚠️ 必須: 事前登録した決済手段ID
  "status": "pending"  // 任意（デフォルト: "pending"）
}
```

**変更内容:**
- ❌ 削除: `payment_method`, `card_company`, `card_number`, `card_cvc`, `exp_month`, `exp_year`, `card_id`
- ✅ 追加: `payment_id`（必須）
- 注文前に決済手段を登録すること

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
        "card_holder": "山田太郎",
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

## 📋 2. 決済手段登録APIの変更

### フィールド名の変更

**❌ 旧フィールド名:**
- `card_cvc`

**✅ 新フィールド名:**
- `cvc`

### リクエスト例
```http
POST /api/payment-methods
Content-Type: application/json

{
  "user_id": 1,
  "payment_method": "credit_card",  // 선택사항 (기본값: "credit_card")
  "card_company": "VISA",  // 선택사항
  "card_holder": "山田太郎",  // 任意
  "card_number": "1234567890123456",  // 必須（カード登録時）
  "cvc": "123",  // ⚠️ フィールド名変更: card_cvc → cvc
  "exp_month": 12,  // 任意
  "exp_year": 2025,  // 任意
  "is_default": true  // 任意（デフォルト: false）
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
    "card_holder": "山田太郎",
    "card_number": "****-****-****-3456",  // マスキング済み
    "exp_month": 12,
    "exp_year": 2025
  }
}
```

**変更内容:**
- カード情報はフラット構造で返却（従来通り）
- カード番号はマスキング済み（`****-****-****-1234`）

---

## 📋 3. 注文取得APIレスポンスの変更

### 注文取得レスポンスに追加されたフィールド

**✅ 追加フィールド:**
- `orderItems`: 購入商品一覧
- `orderCoupons`: 適用クーポン一覧

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
        "card_holder": "山田太郎",
        "exp_month": 12,
        "exp_year": 2025
      }
    },
    "orderItems": [  // ⚠️ 新規追加
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
    "orderCoupons": [  // ⚠️ 新規追加
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

**変更内容:**
- `orderItems`: 空配列または購入商品一覧
- `orderCoupons`: 空配列または適用クーポン一覧
- 各項目に関連情報（product, coupon）を含む

---

## 📋 4. 決済手段取得APIレスポンスの変更

### レスポンス構造の変更

**旧レスポンス:**
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

**新レスポンス:**
```json
{
  "paymentMethod": {
    "id": 1,
    "user_id": 1,
    "payment_method": "credit_card",
    "is_default": true,
    "card_id": 1,  // ⚠️ 追加
    "card_company": "VISA",  // creditCardからフラット化
    "card_holder": "山田太郎",  // ⚠️ 追加
    "card_number": "****-****-****-3456",  // マスキング済み
    "exp_month": 12,
    "exp_year": 2025
  }
}
```

**変更内容:**
- カード情報はフラット構造で返却（利用しやすさ）
- `card_id` フィールド追加
- `card_holder` フィールド追加
- カード番号はマスキング済み

---

## 📋 5. 注文一覧取得API

### レスポンス構造

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
      "orderItems": [ ... ],  // ⚠️ 新規追加
      "orderCoupons": [ ... ]  // ⚠️ 新規追加
    }
  ]
}
```

---

## 🔄 マイグレーションガイド

### フロントエンドで必要な修正

1. **注文作成ロジックの変更**
   ```javascript
   // ❌ 旧コード
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
   
   // ✅ 新コード
   // 1. 決済手段の登録（既に登録済みなら省略）
   const paymentMethod = await registerPaymentMethod({
     user_id: userId,
     card_company: cardCompany,
     card_number: cardNumber,
     cvc: cardCvc,  // フィールド名変更
     exp_month: expMonth,
     exp_year: expYear,
     is_default: true
   });
   
   // 2. 注文作成
   const orderData = {
     user_id: userId,
     total_amount: totalAmount,
     payment_id: paymentMethod.id  // 登録した決済手段IDを使用
   };
   ```

2. **決済手段登録のフィールド名変更**
   ```javascript
   // ❌ 旧
   card_cvc: "123"
   
   // ✅ 新
   cvc: "123"
   ```

3. **注文取得レスポンスの扱い**
   ```javascript
   // ✅ 新レスポンス構造
   const order = response.data.order;
   
   // 購入商品一覧
   const products = order.orderItems.map(item => item.product);
   
   // 適用クーポン一覧
   const coupons = order.orderCoupons.map(oc => oc.coupon);
   ```

---

## 📝 APIエンドポイント一覧

### 注文
- `POST /api/orders` - 注文作成（変更あり）
- `GET /api/orders` - 注文一覧取得（レスポンス変更）
- `GET /api/orders/:id` - 注文詳細取得（レスポンス変更）
- `GET /api/orders/order-number/:orderNumber` - 注文番号で取得（レスポンス変更）
- `GET /api/orders/users/:userId` - ユーザー別注文一覧（レスポンス変更）
- `PUT /api/orders/:id` - 注文更新
- `DELETE /api/orders/:id` - 注文削除

### 決済手段
- `POST /api/payment-methods` - 決済手段登録（フィールド名変更）
- `GET /api/payment-methods/:id` - 決済手段取得（レスポンス変更）
- `GET /api/payment-methods/users/:userId` - ユーザー別決済手段一覧（レスポンス変更）
- `PUT /api/payment-methods/:id` - 決済手段更新（フィールド名変更）
- `DELETE /api/payment-methods/:id` - 決済手段削除

---

## ⚠️ 注意事項

1. **注文作成前に決済手段の登録が必須**
   - 注文作成時 `payment_id` が必須のため、先に決済手段を登録してください。

2. **カード情報の暗号化**
   - カード番号とCVCはサーバーで自動的に暗号化して保存されます。
   - レスポンスにはマスキングされたカード番号のみ返却されます。

3. **決済手段の所有権検証**
   - 注文作成時にその決済手段が当該ユーザーのものであるか自動検証されます。

4. **注文取得レスポンス**
   - `orderItems` と `orderCoupons` は常に配列で返却されます（空配列の場合あり）。

---

## 📞 問い合わせ

API変更に関する問い合わせはバックエンドチームまでご連絡ください。

