# AIDE Market API エンドポイント文書

> フロントエンド開発者向け API エンドポイントガイド

**Base URL**: `http://localhost:8081`

> 💡 **フロントエンド開発の参考**: Base URL は環境変数で管理することを推奨します。
> ```javascript
> const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';
> ```

---

## 📦 1. 商品関連 (Products)

### 1.1 商品一覧（ページネーション + フィルタ）
```http
GET /api/products
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1）
- `limit` (任意): 1ページあたりの件数（デフォルト: 20）
- `category` (任意): カテゴリIDでフィルタ
- `sort` (任意): ソート指定
  - `download` (デフォルト): ダウンロード数順
  - `rating`: 評価順
  - `price`: 価格の安い順
  - `priceDesc`: 価格の高い順
- `search` (任意): 検索語（商品名・説明から検索）

**例:**
```javascript
// 一覧（ダウン로ード数順）
GET /api/products

// ページネーション
GET /api/products?page=2&limit=20

// カテゴリフィルタ + 検索
GET /api/products?category=1&search=React&sort=rating

// 評価順ソート
GET /api/products?sort=rating&limit=10
```

**レスポンス:**
```json
{
  "products": [
    {
      "id": 3,
      "name": "CodePix",
      "price": 15000,
      "seller": "佐藤健太",
      "description": "バニラJavaScript開発の専門家...",
      "imageUrl": "uploads/ai/codepix.png",
      "soldout": 0,
      "category_id": 1,
      "sub_category_id": 1,
      "download_count": 1250,
      "view_count": 3400,
      "rating_average": "4.80",
      "rating_count": 85,
      "category_name": "フロントエンド",
      "subcategory_name": "JavaScript",
      "createdAt": "2025-11-18T20:50:57.000Z"
    }
  ],
  "pagination": {
    "total": 70,
    "page": 1,
    "limit": 20,
    "totalPages": 4
  }
}
```

---

### 1.2 商品詳細（AI統計・タグ・シナジー含む）
```http
GET /api/products/:id
```

**Path Parameters:**
- `id`: 商品ID

**例:**
```javascript
GET /api/products/3
```

**レスポンス:**
```json
{
  "product": {
    "id": 3,
    "name": "CodePix",
    "price": 15000,
    "seller": "佐藤健太",
    "description": "バニラJavaScript開発の専門家...",
    "imageUrl": "uploads/ai/codepix.png",
    "soldout": 0,
    "category_id": 1,
    "sub_category_id": 1,
    "download_count": 1250,
    "view_count": 3400,
    "rating_average": "4.80",
    "rating_count": 85,
    "category_name": "フロントエンド",
    "subcategory_name": "JavaScript",
    "tech_stack": "JavaScript",
    "createdAt": "2025-11-18T20:50:57.000Z",
    "updatedAt": "2025-11-18T20:50:57.000Z"
  },
  "stats": {
    "id": 1,
    "product_id": 3,
    "teamwork": 79,
    "stability": 82,
    "speed": 73,
    "creativity": 70,
    "productivity": 81,
    "maintainability": 97
  },
  "tags": [
    {
      "id": 1,
      "name": "JavaScript",
      "created_at": "2025-11-18T11:37:59.000Z"
    }
  ],
  "synergies": [
    {
      "id": 4,
      "name": "T-Guard",
      "price": 22000,
      "seller": "田中美咲",
      "imageUrl": "uploads/ai/tguard.png",
      "rating_average": "4.90",
      "rating_count": 98,
      "synergy_score": 85,
      "synergy_description": "フロントエンド開発で相性抜群"
    }
  ]
}
```

---

### 1.3 AI統計取得（六角チャート用）
```http
GET /api/products/:id/stats
```

**Path Parameters:**
- `id`: 商品ID

**例:**
```javascript
GET /api/products/3/stats
```

**レスポンス:**
```json
{
  "stats": {
    "id": 1,
    "product_id": 3,
    "teamwork": 79,
    "stability": 82,
    "speed": 73,
    "creativity": 70,
    "productivity": 81,
    "maintainability": 97,
    "created_at": "2025-11-18T11:54:57.000Z"
  }
}
```

---

### 1.4 おすすめAI取得（シナジー）
```http
GET /api/products/:id/synergies
```

**Path Parameters:**
- `id`: 商品ID

**Query Parameters:**
- `limit` (任意): 最大件数（デフォルト: 5）

**例:**
```javascript
GET /api/products/3/synergies?limit=5
```

**レスポンス:**
```json
{
  "synergies": [
    {
      "id": 4,
      "name": "T-Guard",
      "price": 22000,
      "seller": "田中美咲",
      "description": "TypeScript型安全開発の専門家...",
      "imageUrl": "uploads/ai/tguard.png",
      "download_count": 1450,
      "view_count": 3800,
      "rating_average": "4.90",
      "rating_count": 98,
      "synergy_score": 85,
      "synergy_description": "フロントエンド開発で相性抜群"
    }
  ]
}
```

---

### 1.5 カテゴリ別代表商品取得（メインページ用）
```http
GET /api/products/featured/category/:categoryId
```

**Path Parameters:**
- `categoryId`: カテゴリID

**Query Parameters:**
- `limit` (任意): 返却する商品数（デフォルト: 4）

**例:**
```javascript
// デフォルト: 4件
GET /api/products/featured/category/1

// 6件
GET /api/products/featured/category/1?limit=6
```

**レスポンス:**
```json
{
  "products": [
    {
      "id": 3,
      "name": "CodePix",
      "price": 15000,
      "seller": "佐藤健太",
      "imageUrl": "uploads/ai/codepix.png",
      "soldout": 0,
      "download_count": 1250,
      "view_count": 3400,
      "rating_average": "4.80",
      "rating_count": 85,
      "category_name": "フロントエンド",
      "subcategory_name": "JavaScript"
    }
  ]
}
```

> 💡 **フロントエンド開発の参考**: 特定カテゴリの代表商品だけ必要なときにこのエンドポイントを使用します。ダウンロード数・評価の高い順でソートされます。

---

### 1.6 カテゴリ別商品一覧
```http
GET /api/products/category/:categoryId
```

**Path Parameters:**
- `categoryId`: カテゴリID

**Query Parameters:**
- `subcategory` (任意): サブカテゴリID
- `page` (任意): ページ番号（デフォルト: 1）
- `limit` (任意): 1ページあたりの件数（デフォルト: 20）
- `sort` (任意): ソート指定

**例:**
```javascript
GET /api/products/category/1?page=1&limit=10&sort=download
GET /api/products/category/1?subcategory=2
```

**レスポンス:**
```json
{
  "products": [
    {
      "id": 3,
      "name": "CodePix",
      "subcategory_name": "JavaScript",
      ...
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 1.7 タグ別商品一覧
```http
GET /api/products/by-tag/:tagId
```

**Path Parameters:**
- `tagId`: タグID

**Query Parameters:**
- `page` (任意): ページ番号
- `limit` (任意): 1ページあたりの件数

**例:**
```javascript
GET /api/products/by-tag/1?page=1&limit=10
```

**レスポンス:**
```json
{
  "products": [...],
  "pagination": {
    "total": 30,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 1.8 商品作成
```http
POST /api/products
```

**Request Body:**
```json
{
  "name": "NewAI",
  "description": "AI説明",
  "price": 50000,
  "seller": "販売者名",
  "imageUrl": "uploads/ai/newai.png",
  "category_id": 1,
  "sub_category_id": 1
}
```

**レスポンス:**
```json
{
  "result": {
    "id": 73,
    "name": "NewAI",
    "price": 50000,
    ...
  }
}
```

---

### 1.9 商品購入
```http
POST /api/products/purchase/:id
```

**Path Parameters:**
- `id`: 商品ID

**レスポンス:**
```json
{
  "result": true
}
```

---

## 📁 2. カテゴリ関連 (Categories)

### 2.1 カテゴリ一覧
```http
GET /api/categories
```

**レスポンス:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "frontend",
      "name_ja": "フロントエンド",
      "description": "ユーザーインターフェース開発AI",
      "product_count": 10,
      "created_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 2.2 メインページ用: カテゴリ一覧と各カテゴリの代表商品
```http
GET /api/categories/with-products
```

**Query Parameters:**
- `productsLimit` (任意): カテゴリ別代表商品数（デフォルト: 4）

**例:**
```javascript
// デフォルト: カテゴリあたり4件
GET /api/categories/with-products

// カテゴリあたり6件
GET /api/categories/with-products?productsLimit=6
```

**レスポンス:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "frontend",
      "name_ja": "フロントエンド",
      "description": "ユーザーインターフェース開発AI",
      "product_count": 10,
      "created_at": "2025-11-18T11:37:59.000Z",
      "featured_products": [
        {
          "id": 3,
          "name": "CodePix",
          "price": 15000,
          "seller": "佐藤健太",
          "imageUrl": "uploads/ai/codepix.png",
          "soldout": 0,
          "download_count": 1250,
          "view_count": 3400,
          "rating_average": "4.80",
          "rating_count": 85,
          "category_name": "フロントエンド",
          "subcategory_name": "JavaScript"
        }
      ]
    }
  ]
}
```

> 💡 **フロントエンド開発の参考**: メインページのカテゴリ表に各カテゴリの代表商品を表示するときにこのエンドポイントを使用します。

---

### 2.3 サブカテゴリ一覧
```http
GET /api/categories/:id/subcategories
```

**Path Parameters:**
- `id`: カテゴリID

**レスポンス:**
```json
{
  "subcategories": [
    {
      "id": 1,
      "category_id": 1,
      "name": "JavaScript",
      "tech_stack": "JavaScript",
      "product_count": 1,
      "created_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 2.4 カテゴリ作成
```http
POST /api/categories
```

**Request Body:**
```json
{
  "name": "new_category",
  "name_ja": "新カテゴリ",
  "description": "説明"
}
```

---

## 📂 2.5 サブカテゴリ関連 (SubCategories)

### 2.5.1 サブカテゴリ一覧
```http
GET /api/subcategories
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)
- `category_id` (任意): カテゴリIDでフィルタ

**例:**
```javascript
// 一覧
GET /api/subcategories

// ページネーション
GET /api/subcategories?page=2&limit=10

// 特定カテゴリのサブカテゴリ
GET /api/subcategories?category_id=1
```

**レスポンス:**
```json
{
  "total": 70,
  "page": 1,
  "limit": 20,
  "totalPages": 4,
  "subcategories": [
    {
      "id": 1,
      "category_id": 1,
      "name": "JavaScript",
      "tech_stack": "JavaScript",
      "created_at": "2025-11-18T11:37:59.000Z",
      "category": {
        "id": 1,
        "name": "frontend",
        "name_ja": "フロントエンド"
      }
    }
  ]
}
```

---

### 2.5.2 カテゴリ別サブカテゴリ一覧
```http
GET /api/subcategories/category/:categoryId
```

**Path Parameters:**
- `categoryId`: カテゴリID

**レスポンス:**
```json
{
  "subcategories": [
    {
      "id": 1,
      "category_id": 1,
      "name": "JavaScript",
      "tech_stack": "JavaScript",
      "created_at": "2025-11-18T11:37:59.000Z",
      "category": {
        "id": 1,
        "name": "frontend",
        "name_ja": "フロントエンド"
      }
    }
  ]
}
```

---

### 2.5.3 IDでサブカテゴリ取得
```http
GET /api/subcategories/:id
```

**Path Parameters:**
- `id`: サブカテゴリID

**レスポンス:**
```json
{
  "subcategory": {
    "id": 1,
    "category_id": 1,
    "name": "JavaScript",
    "tech_stack": "JavaScript",
    "created_at": "2025-11-18T11:37:59.000Z",
    "category": {
      "id": 1,
      "name": "frontend",
      "name_ja": "フロントエンド"
    }
  }
}
```

---

### 2.5.4 サブカテゴリ作成
```http
POST /api/subcategories
```

**Request Body:**
```json
{
  "category_id": 1,
  "name": "TypeScript",
  "tech_stack": "TypeScript"
}
```

**レスポンス:**
```json
{
  "subcategory": {
    "id": 71,
    "category_id": 1,
    "name": "TypeScript",
    "tech_stack": "TypeScript",
    "created_at": "2025-11-18T20:50:57.000Z"
  }
}
```

---

### 2.5.5 サブカテゴリ更新
```http
PUT /api/subcategories/:id
```

**Path Parameters:**
- `id`: サブカテゴリID

**Request Body:**
```json
{
  "name": "TypeScript",
  "tech_stack": "TypeScript, TS"
}
```

**レスポンス:**
```json
{
  "subcategory": {
    "id": 1,
    "category_id": 1,
    "name": "TypeScript",
    "tech_stack": "TypeScript, TS",
    "created_at": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 2.5.6 サブカテゴリ削除
```http
DELETE /api/subcategories/:id
```

**Path Parameters:**
- `id`: サブカテゴリID

**レスポンス:**
```json
{
  "result": true
}
```

> ⚠️ **注意**: 当該サブカテゴリを使用している商品がある場合は削除できません。

---

## 👥 2.6 チーム構成 関連 (Team Compositions)

### 2.6.1 ユーザー別 チーム構成 一覧
```http
GET /api/team-compositions/users/:userId
```

**Path Parameters:**
- `userId`: ユーザーID

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)

**例:**
```javascript
GET /api/team-compositions/users/1
GET /api/team-compositions/users/1?page=2&limit=10
```

**レスポンス:**
```json
{
  "total": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1,
  "teamCompositions": [
    {
      "id": 1,
      "user_id": 1,
      "name": "フロントエンドチーム",
      "total_synergy_score": 420,
      "created_at": "2025-11-18T11:37:59.000Z",
      "updated_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 2.6.2 全体 チーム構成 一覧 （管理者用）
```http
GET /api/team-compositions
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)

**例:**
```javascript
GET /api/team-compositions
GET /api/team-compositions?page=2&limit=10
```

**レスポンス:**
```json
{
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "teamCompositions": [
    {
      "id": 1,
      "user_id": 1,
      "name": "フロントエンドチーム",
      "total_synergy_score": 420,
      "created_at": "2025-11-18T11:37:59.000Z",
      "updated_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 2.6.3 IDで チーム構成 取得
```http
GET /api/team-compositions/:id
```

**Path Parameters:**
- `id`: チーム構成 ID

**レスポンス:**
```json
{
  "teamComposition": {
    "id": 1,
    "user_id": 1,
    "name": "フロントエンドチーム",
    "total_synergy_score": 420,
    "created_at": "2025-11-18T11:37:59.000Z",
    "updated_at": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 2.6.4 チーム構成 作成
```http
POST /api/team-compositions
```

**Request Body:**
```json
{
  "user_id": 1,
  "name": "バックエンドチーム",
  "total_synergy_score": 380
}
```

**レスポンス:**
```json
{
  "teamComposition": {
    "id": 2,
    "user_id": 1,
    "name": "バックエンドチーム",
    "total_synergy_score": 380,
    "created_at": "2025-11-18T20:50:57.000Z",
    "updated_at": "2025-11-18T20:50:57.000Z"
  }
}
```

---

### 2.6.5 チーム構成 更新
```http
PUT /api/team-compositions/:id
```

**Path Parameters:**
- `id`: チーム構成 ID

**Request Body:**
```json
{
  "name": "フルスタックチーム",
  "total_synergy_score": 450
}
```

**レスポンス:**
```json
{
  "teamComposition": {
    "id": 1,
    "user_id": 1,
    "name": "フルスタックチーム",
    "total_synergy_score": 450,
    "created_at": "2025-11-18T11:37:59.000Z",
    "updated_at": "2025-11-18T21:00:00.000Z"
  }
}
```

---

### 2.6.6 チーム構成 削除
```http
DELETE /api/team-compositions/:id
```

**Path Parameters:**
- `id`: チーム構成 ID

**レスポンス:**
```json
{
  "result": true
}
```

> ⚠️ **注意**: チーム構成削除時、関連するチームメンバー(team_members)も削除されます (CASCADE)。

---

## 👤 2.7 チームメンバー 관련 (Team Members)

### 2.7.1 チーム別メンバー一覧取得
```http
GET /api/team-members/teams/:teamId
```

**Path Parameters:**
- `teamId`: チーム構成 ID

**レスポンス:**
```json
{
  "teamMembers": [
    {
      "id": 1,
      "team_id": 1,
      "product_id": 3,
      "category_id": 1,
      "position": 1,
      "added_at": "2025-11-18T11:37:59.000Z",
      "product": {
        "id": 3,
        "name": "CodePix",
        "price": 15000,
        "seller": "佐藤健太",
        "imageUrl": "uploads/ai/codepix.png",
        "description": "バニラJavaScript開発の専門家...",
        "category_id": 1,
        "sub_category_id": 1,
        "rating_average": "4.80",
        "rating_count": 85
      },
      "category": {
        "id": 1,
        "name": "frontend",
        "name_ja": "フロントエンド"
      }
    }
  ]
}
```

---

### 2.7.2 IDで チームメンバー 取得
```http
GET /api/team-members/:id
```

**Path Parameters:**
- `id`: チームメンバー ID

**レスポンス:**
```json
{
  "teamMember": {
    "id": 1,
    "team_id": 1,
    "product_id": 3,
    "category_id": 1,
    "position": 1,
    "added_at": "2025-11-18T11:37:59.000Z",
    "product": {
      "id": 3,
      "name": "CodePix",
      "price": 15000,
      "seller": "佐藤健太",
      "imageUrl": "uploads/ai/codepix.png",
      "description": "バニラJavaScript開発の専門家..."
    },
    "category": {
      "id": 1,
      "name": "frontend",
      "name_ja": "フロントエンド"
    }
  }
}
```

---

### 2.7.3 チームメンバー 追加
```http
POST /api/team-members
```

**Request Body:**
```json
{
  "team_id": 1,
  "product_id": 5,
  "category_id": 1,
  "position": 2
}
```

**レスポンス:**
```json
{
  "teamMember": {
    "id": 2,
    "team_id": 1,
    "product_id": 5,
    "category_id": 1,
    "position": 2,
    "added_at": "2025-11-18T20:50:57.000Z"
  }
}
```

> 💡 **参考**: `position` を指定しない場合、現在のチームの最大 position + 1 が自動設定されます。同一チームに同一商品を重複追加できません（unique constraint）。

---

### 2.7.4 チームメンバー 更新
```http
PUT /api/team-members/:id
```

**Path Parameters:**
- `id`: チームメンバー ID

**Request Body:**
```json
{
  "category_id": 2,
  "position": 3
}
```

**レスポンス:**
```json
{
  "teamMember": {
    "id": 1,
    "team_id": 1,
    "product_id": 3,
    "category_id": 2,
    "position": 3,
    "added_at": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 2.7.5 チームメンバー 削除 (IDで)
```http
DELETE /api/team-members/:id
```

**Path Parameters:**
- `id`: チームメンバー ID

**レスポンス:**
```json
{
  "result": true
}
```

---

### 2.7.6 チームメンバー 削除 （team_id・product_id指定）
```http
DELETE /api/team-members/teams/:teamId/products/:productId
```

**Path Parameters:**
- `teamId`: チーム構成 ID
- `productId`: 商品ID

**レスポンス:**
```json
{
  "result": true
}
```

---

## 📧 2.8 ユーザーメール設定関連 (User Mail Settings)

### 2.8.1 ユーザー別 メール設定 取得
```http
GET /api/user-mail-settings/users/:userId
```

**Path Parameters:**
- `userId`: ユーザーID

**レスポンス:**
```json
{
  "mailSetting": {
    "id": 1,
    "user_id": 1,
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "user@example.com",
    "from_address": "user@example.com",
    "from_name": "User Name",
    "is_enabled": true,
    "updated_at": "2025-11-18T20:50:57.000Z"
  }
}
```

> 🔒 **セキュリティ参考**: レスポンスでは `smtp_password` はセキュリティ上含まれません.

---

### 2.8.2 IDで メール設定 取得
```http
GET /api/user-mail-settings/:id
```

**Path Parameters:**
- `id`: メール設定ID

**レスポンス:**
```json
{
  "mailSetting": {
    "id": 1,
    "user_id": 1,
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "user@example.com",
    "from_address": "user@example.com",
    "from_name": "User Name",
    "is_enabled": true,
    "updated_at": "2025-11-18T20:50:57.000Z"
  }
}
```

---

### 2.8.3 メール設定一覧取得（管理者用）
```http
GET /api/user-mail-settings
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)

**例:**
```javascript
GET /api/user-mail-settings
GET /api/user-mail-settings?page=2&limit=10
```

**レスポンス:**
```json
{
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "mailSettings": [
    {
      "id": 1,
      "user_id": 1,
      "smtp_server": "smtp.gmail.com",
      "smtp_port": 587,
      "smtp_user": "user@example.com",
      "from_address": "user@example.com",
      "from_name": "User Name",
      "is_enabled": true,
      "updated_at": "2025-11-18T20:50:57.000Z"
    }
  ]
}
```

---

### 2.8.4 メール設定作成または更新（upsert）
```http
POST /api/user-mail-settings
```

**Request Body:**
```json
{
  "user_id": 1,
  "smtp_server": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "user@example.com",
  "smtp_password": "password123",
  "from_address": "user@example.com",
  "from_name": "User Name",
  "is_enabled": true
}
```

**レスポンス:**
```json
{
  "mailSetting": {
    "id": 1,
    "user_id": 1,
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "user@example.com",
    "from_address": "user@example.com",
    "from_name": "User Name",
    "is_enabled": true,
    "updated_at": "2025-11-18T20:50:57.000Z"
  },
  "created": true
}
```

> 💡 **参考**: `user_id` が既に存在すれば更新、なければ作成されます. `smtp_port` は 1〜65535 の値である必要があります.

---

### 2.8.5 メール設定 更新
```http
PUT /api/user-mail-settings/:id
```

**Path Parameters:**
- `id`: メール設定ID

**Request Body:**
```json
{
  "smtp_server": "smtp.outlook.com",
  "smtp_port": 465,
  "is_enabled": false
}
```

**レスポンス:**
```json
{
  "mailSetting": {
    "id": 1,
    "user_id": 1,
    "smtp_server": "smtp.outlook.com",
    "smtp_port": 465,
    "smtp_user": "user@example.com",
    "from_address": "user@example.com",
    "from_name": "User Name",
    "is_enabled": false,
    "updated_at": "2025-11-18T21:00:00.000Z"
  }
}
```

> 💡 **参考**: 指定したフィールドのみ更新されます（partial update）.

---

### 2.8.6 メール設定削除（ID指定）
```http
DELETE /api/user-mail-settings/:id
```

**Path Parameters:**
- `id`: メール設定ID

**レスポンス:**
```json
{
  "result": true
}
```

---

### 2.8.7 メール設定削除（user_id指定）
```http
DELETE /api/user-mail-settings/users/:userId
```

**Path Parameters:**
- `userId`: ユーザーID

**レスポンス:**
```json
{
  "result": true
}
```

---

## 🏷️ 3. タグ 관련 (Tags)

### 3.1 全体 タグ 一覧
```http
GET /api/tags
```

**レスポンス:**
```json
{
  "tags": [
    {
      "id": 1,
      "name": "JavaScript",
      "product_count": 1,
      "created_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 3.2 タグ 作成
```http
POST /api/tags
```

**Request Body:**
```json
{
  "name": "新タグ"
}
```

---

## 🎫 3.3 クーポン 관련 (Coupons)

### 3.3.1 全体 クーポン 一覧 取得
```http
GET /api/coupons
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)
- `activeOnly` (任意): 有効な クーポンのみ 取得 （デフォルト: false)

**例:**
```javascript
// 一覧
GET /api/coupons

// 有効な クーポンのみ
GET /api/coupons?activeOnly=true

// ページネーション
GET /api/coupons?page=2&limit=10
```

**レスポンス:**
```json
{
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "coupons": [
    {
      "coupon_id": 1,
      "code": "SAVE20",
      "discount_type": "rate",
      "discount_value": "20.00",
      "max_discount": "5000.00",
      "min_order": "10000.00",
      "expires_at": "2025-12-31T23:59:59.000Z",
      "is_active": true,
      "created_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 3.3.2 IDで クーポン 取得
```http
GET /api/coupons/:id
```

**Path Parameters:**
- `id`: クーポン ID

**レスポンス:**
```json
{
  "coupon": {
    "coupon_id": 1,
    "code": "SAVE20",
    "discount_type": "rate",
    "discount_value": "20.00",
    "max_discount": "5000.00",
    "min_order": "10000.00",
    "expires_at": "2025-12-31T23:59:59.000Z",
    "is_active": true,
    "created_at": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 3.3.3 クーポン コードで取得
```http
GET /api/coupons/code/:code
```

**Path Parameters:**
- `code`: クーポン 코드

**例:**
```javascript
GET /api/coupons/code/SAVE20
```

**レスポンス:**
```json
{
  "coupon": {
    "coupon_id": 1,
    "code": "SAVE20",
    "discount_type": "rate",
    "discount_value": "20.00",
    "max_discount": "5000.00",
    "min_order": "10000.00",
    "expires_at": "2025-12-31T23:59:59.000Z",
    "is_active": true,
    "created_at": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 3.3.4 クーポン 有効性検証と割引計算
```http
POST /api/coupons/validate
```

**Request Body:**
```json
{
  "code": "SAVE20",
  "orderAmount": "25000"
}
```

**レスポンス:**
```json
{
  "coupon": {
    "coupon_id": 1,
    "code": "SAVE20",
    "discount_type": "rate",
    "discount_value": "20.00",
    "max_discount": "5000.00",
    "min_order": "10000.00",
    "expires_at": "2025-12-31T23:59:59.000Z",
    "is_active": true,
    "created_at": "2025-11-18T11:37:59.000Z"
  },
  "discountAmount": "5000.00",
  "finalAmount": "20000.00"
}
```

> 💡 **参考**: クーポンコードの有効性を検証し、注文金額に対する割引額と最終金額を計算します。クーポンが期限切れ・無効・最低注文金額未満の場合はエラーを返します。

---

### 3.3.5 クーポン 作成
```http
POST /api/coupons
```

**Request Body:**
```json
{
  "code": "NEWYEAR30",
  "discount_type": "rate",
  "discount_value": 30,
  "max_discount": 10000,
  "min_order": 20000,
  "expires_at": "2025-12-31T23:59:59.000Z",
  "is_active": true
}
```

**レスポンス:**
```json
{
  "coupon": {
    "coupon_id": 2,
    "code": "NEWYEAR30",
    "discount_type": "rate",
    "discount_value": "30.00",
    "max_discount": "10000.00",
    "min_order": "20000.00",
    "expires_at": "2025-12-31T23:59:59.000Z",
    "is_active": true,
    "created_at": "2025-11-18T20:50:57.000Z"
  }
}
```

> 💡 **参考**: 
> - `discount_type`: "amount" (固定金額) または "rate"（率）
> - `discount_value`: 割引値（金額または率）
> - `max_discount`: 率割引時の最大割引額（任意）
> - `min_order`: 最低注文金額（任意）
> - コードは自動的に大文字に変換されます

---

### 3.3.6 クーポン 更新
```http
PUT /api/coupons/:id
```

**Path Parameters:**
- `id`: クーポン ID

**Request Body:**
```json
{
  "is_active": false,
  "expires_at": "2026-01-31T23:59:59.000Z"
}
```

**レスポンス:**
```json
{
  "coupon": {
    "coupon_id": 1,
    "code": "SAVE20",
    "discount_type": "rate",
    "discount_value": "20.00",
    "max_discount": "5000.00",
    "min_order": "10000.00",
    "expires_at": "2026-01-31T23:59:59.000Z",
    "is_active": false,
    "created_at": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 3.3.7 クーポン 削除
```http
DELETE /api/coupons/:id
```

**Path Parameters:**
- `id`: クーポン ID

**レスポンス:**
```json
{
  "result": true
}
```

---

## 👤 3.4 ユーザー関連 (Users)

> ⚠️ **注意**: `bcrypt` パッケージが必要です。インストールは `npm install bcrypt`を実行してください.

### 3.4.1 全体 ユーザー 一覧 取得
```http
GET /api/users
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)

**例:**
```javascript
GET /api/users
GET /api/users?page=2&limit=10
```

**レスポンス:**
```json
{
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5,
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "profile_image": "uploads/profiles/user1.jpg",
      "createdAt": "2025-11-18T11:37:59.000Z",
      "updatedAt": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

> 🔒 **セキュリティ参考**: レスポンスでは `password_hash` は含まれません.

---

### 3.4.2 IDで ユーザー 取得
```http
GET /api/users/:id
```

**Path Parameters:**
- `id`: ユーザーID

**レスポンス:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "profile_image": "uploads/profiles/user1.jpg",
    "createdAt": "2025-11-18T11:37:59.000Z",
    "updatedAt": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 3.4.3 ユーザー名でユーザー 取得
```http
GET /api/users/username/:username
```

**Path Parameters:**
- `username`: ユーザー명

**例:**
```javascript
GET /api/users/username/john_doe
```

**レスポンス:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "profile_image": "uploads/profiles/user1.jpg",
    "createdAt": "2025-11-18T11:37:59.000Z",
    "updatedAt": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 3.4.4 ユーザー 作成
```http
POST /api/users
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user",
  "profile_image": "uploads/profiles/user1.jpg"
}
```

**レスポンス:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "profile_image": "uploads/profiles/user1.jpg",
    "createdAt": "2025-11-18T20:50:57.000Z",
    "updatedAt": "2025-11-18T20:50:57.000Z"
  }
}
```

> 💡 **参考**: パスワードは自動的にbcryptでハッシュされます。`role` のデフォルトは "user" で、"admin" または "user" のみ指定可能です。

---

### 3.4.5 ユーザー 更新
```http
PUT /api/users/:id
```

**Path Parameters:**
- `id`: ユーザーID

**Request Body:**
```json
{
  "username": "john_doe_updated",
  "email": "john.updated@example.com",
  "role": "admin"
}
```

**レスポンス:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe_updated",
    "email": "john.updated@example.com",
    "role": "admin",
    "profile_image": "uploads/profiles/user1.jpg",
    "createdAt": "2025-11-18T11:37:59.000Z",
    "updatedAt": "2025-11-18T21:00:00.000Z"
  }
}
```

> 💡 **参考**: パスワードが指定された場合は自動的にハッシュされます. 指定したフィールドのみ更新されます（partial update）.

---

### 3.4.6 ユーザー 削除
```http
DELETE /api/users/:id
```

**Path Parameters:**
- `id`: ユーザーID

**レスポンス:**
```json
{
  "result": true
}
```

---

### 3.4.7 비밀번호 검증
```http
POST /api/users/:id/validate-password
```

**Path Parameters:**
- `id`: ユーザーID

**Request Body:**
```json
{
  "password": "securePassword123"
}
```

**レスポンス:**
```json
{
  "valid": true
}
```

---

## 📦 3.5 注文 관련 (Orders)

### 3.5.1 全体 注文 一覧 取得
```http
GET /api/orders
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)
- `user_id` (任意): ユーザーIDで フィルタ
- `status` (任意): 注文 상태로 フィルタ ('pending', 'completed', 'cancelled', 'refunded')

**例:**
```javascript
// 一覧
GET /api/orders

// ユーザー別 フィルタ
GET /api/orders?user_id=1

// 状態別 フィルタ
GET /api/orders?status=pending

// ページネーション
GET /api/orders?page=2&limit=10
```

**レスポンス:**
```json
{
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5,
  "orders": [
    {
      "id": 1,
      "user_id": 1,
      "order_number": "ORD-1703016000000-1234",
      "status": "completed",
      "total_amount": 15000,
      "payment_method": "credit_card",
      "card_company": "VISA",
      "exp_month": 12,
      "exp_year": 2025,
      "card_id": null,
      "purchased_at": "2025-11-18T11:37:59.000Z",
      "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

> 🔒 **セキュリティ参考**: レスポンスでは `card_number_encrypted` と `card_cvc_encrypted` は含まれません.

---

### 3.5.2 ユーザー別 注文 一覧 取得
```http
GET /api/orders/users/:userId
```

**Path Parameters:**
- `userId`: ユーザーID

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)

**例:**
```javascript
GET /api/orders/users/1
GET /api/orders/users/1?page=2&limit=10
```

**レスポンス:**
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
      "order_number": "ORD-1703016000000-1234",
      "status": "completed",
      "total_amount": 15000,
      "purchased_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 3.5.3 IDで 注文 取得
```http
GET /api/orders/:id
```

**Path Parameters:**
- `id`: 注文 ID

**レスポンス:**
```json
{
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "ORD-1703016000000-1234",
    "status": "completed",
    "total_amount": 15000,
    "payment_method": "credit_card",
    "card_company": "VISA",
    "exp_month": 12,
    "exp_year": 2025,
    "purchased_at": "2025-11-18T11:37:59.000Z",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 3.5.4 注文 번호로 注文 取得
```http
GET /api/orders/order-number/:orderNumber
```

**Path Parameters:**
- `orderNumber`: 注文 번호

**例:**
```javascript
GET /api/orders/order-number/ORD-1703016000000-1234
```

**レスポンス:**
```json
{
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "ORD-1703016000000-1234",
    "status": "completed",
    "total_amount": 15000,
    "purchased_at": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 3.5.5 注文 作成
```http
POST /api/orders
```

**Request Body:**
```json
{
  "user_id": 1,
  "total_amount": 15000,
  "payment_method": "credit_card",
  "card_company": "VISA",
  "card_number": "4111111111111111",
  "card_cvc": "123",
  "exp_month": 12,
  "exp_year": 2025,
  "status": "pending"
}
```

**レスポンス:**
```json
{
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "ORD-1703016000000-1234",
    "status": "pending",
    "total_amount": 15000,
    "payment_method": "credit_card",
    "card_company": "VISA",
    "exp_month": 12,
    "exp_year": 2025,
    "purchased_at": "2025-11-18T20:50:57.000Z"
  }
}
```

> 💡 **参考**: 
> - `order_number` は自動生成されます（形式: ORD-{timestamp}-{random})
> - カード情報（`card_number`, `card_cvc`）は自動的に暗号化して保存されます
> - `status` のデフォルトは "pending" です
> - `card_company` は 'VISA', 'Master', 'JCB', 'AMEX', 'Diners', 'etc' のいずれかである必要があります

---

### 3.5.6 注文 更新
```http
PUT /api/orders/:id
```

**Path Parameters:**
- `id`: 注文 ID

**Request Body:**
```json
{
  "status": "completed",
  "payment_method": "credit_card"
}
```

**レスポンス:**
```json
{
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "ORD-1703016000000-1234",
    "status": "completed",
    "total_amount": 15000,
    "payment_method": "credit_card",
    "purchased_at": "2025-11-18T11:37:59.000Z"
  }
}
```

> 💡 **参考**: 指定したフィールドのみ更新されます（partial update）. 注文 상태 변경 시 사용 가능한 상태: 'pending', 'completed', 'cancelled', 'refunded'

---

### 3.5.7 注文 削除
```http
DELETE /api/orders/:id
```

**Path Parameters:**
- `id`: 注文 ID

**レスポンス:**
```json
{
  "result": true
}
```

> ⚠️ **注意**: 注文削除時、関連する注文 アイテム(order_items)도 함께 削除됩니다 (CASCADE).

---

## 📋 3.6 注文 アイテム 관련 (Order Items)

### 3.6.1 全体 注文 アイテム 一覧 取得
```http
GET /api/order-items
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)
- `order_id` (任意): 注文 IDで フィルタ
- `product_id` (任意): 商品IDで フィルタ

**例:**
```javascript
// 一覧
GET /api/order-items

// 注文별 フィルタ
GET /api/order-items?order_id=1

// 商品別 フィルタ
GET /api/order-items?product_id=3

// ページネーション
GET /api/order-items?page=2&limit=10
```

**レスポンス:**
```json
{
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5,
  "orderItems": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 3,
      "quantity": 1,
      "unit_price": 15000,
      "has_review": false,
      "order": {
        "id": 1,
        "order_number": "ORD-1703016000000-1234",
        "total_amount": 15000,
        "status": "completed",
        "purchased_at": "2025-11-18T11:37:59.000Z"
      },
      "product": {
        "id": 3,
        "name": "CodePix",
        "price": 15000,
        "seller": "佐藤健太",
        "imageUrl": "uploads/ai/codepix.png",
        "description": "バニラJavaScript開発の専門家..."
      }
    }
  ]
}
```

---

### 3.6.2 注文별 注文 アイテム 一覧 取得
```http
GET /api/order-items/orders/:orderId
```

**Path Parameters:**
- `orderId`: 注文 ID

**レスポンス:**
```json
{
  "orderItems": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 3,
      "quantity": 1,
      "unit_price": 15000,
      "has_review": false,
      "product": {
        "id": 3,
        "name": "CodePix",
        "price": 15000,
        "seller": "佐藤健太",
        "imageUrl": "uploads/ai/codepix.png",
        "description": "バニラJavaScript開発の専門家...",
        "category_id": 1,
        "sub_category_id": 1
      }
    }
  ]
}
```

---

### 3.6.3 注文별 注文 アイテム 총합 계산
```http
GET /api/order-items/orders/:orderId/total
```

**Path Parameters:**
- `orderId`: 注文 ID

**レスポンス:**
```json
{
  "total": 30000
}
```

> 💡 **参考**: 注文의 모든 アイテム의 (quantity × unit_price) 합계를 계산합니다.

---

### 3.6.4 商品別 注文 アイテム 一覧 取得
```http
GET /api/order-items/products/:productId
```

**Path Parameters:**
- `productId`: 商品ID

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)

**レスポンス:**
```json
{
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "orderItems": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 3,
      "quantity": 1,
      "unit_price": 15000,
      "has_review": false
    }
  ]
}
```

---

### 3.6.5 IDで 注文 アイテム 取得
```http
GET /api/order-items/:id
```

**Path Parameters:**
- `id`: 注文 アイテム ID

**レスポンス:**
```json
{
  "orderItem": {
    "id": 1,
    "order_id": 1,
    "product_id": 3,
    "quantity": 1,
    "unit_price": 15000,
    "has_review": false,
    "order": {
      "id": 1,
      "order_number": "ORD-1703016000000-1234",
      "total_amount": 15000,
      "status": "completed"
    },
    "product": {
      "id": 3,
      "name": "CodePix",
      "price": 15000,
      "seller": "佐藤健太",
      "imageUrl": "uploads/ai/codepix.png",
      "description": "バニラJavaScript開発の専門家..."
    }
  }
}
```

---

### 3.6.6 注文 アイテム 作成
```http
POST /api/order-items
```

**Request Body:**
```json
{
  "order_id": 1,
  "product_id": 3,
  "quantity": 1,
  "unit_price": 15000,
  "has_review": false
}
```

**レスポンス:**
```json
{
  "orderItem": {
    "id": 1,
    "order_id": 1,
    "product_id": 3,
    "quantity": 1,
    "unit_price": 15000,
    "has_review": false
  }
}
```

> 💡 **参考**: `quantity` 기본값은 1입니다. `has_review` 기본값은 false입니다.

---

### 3.6.7 注文 アイテム 更新
```http
PUT /api/order-items/:id
```

**Path Parameters:**
- `id`: 注文 アイテム ID

**Request Body:**
```json
{
  "quantity": 2,
  "has_review": true
}
```

**レスポンス:**
```json
{
  "orderItem": {
    "id": 1,
    "order_id": 1,
    "product_id": 3,
    "quantity": 2,
    "unit_price": 15000,
    "has_review": true
  }
}
```

---

### 3.6.8 注文 アイテム 削除
```http
DELETE /api/order-items/:id
```

**Path Parameters:**
- `id`: 注文 アイテム ID

**レスポンス:**
```json
{
  "result": true
}
```

---

## 🎟️ 3.7 注文 クーポン 관련 (Order Coupons)

### 3.6.1 全体 注文 クーポン 一覧 取得
```http
GET /api/order-coupons
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)
- `order_id` (任意): 注文 IDで フィルタ
- `user_id` (任意): ユーザーIDで フィルタ
- `coupon_id` (任意): クーポン IDで フィルタ

**例:**
```javascript
// 一覧
GET /api/order-coupons

// 注文별 フィルタ
GET /api/order-coupons?order_id=1

// ユーザー別 フィルタ
GET /api/order-coupons?user_id=1

// ページネーション
GET /api/order-coupons?page=2&limit=10
```

**レスポンス:**
```json
{
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "orderCoupons": [
    {
      "order_coupon_id": 1,
      "order_id": 1,
      "user_id": 1,
      "coupon_id": 1,
      "applied_value": "3000.00",
      "created_at": "2025-11-18T11:37:59.000Z",
      "order": {
        "id": 1,
        "order_number": "ORD-1703016000000-1234",
        "total_amount": 15000,
        "status": "completed",
        "purchased_at": "2025-11-18T11:37:59.000Z"
      },
      "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      },
      "coupon": {
        "coupon_id": 1,
        "code": "SAVE20",
        "discount_type": "rate",
        "discount_value": "20.00"
      }
    }
  ]
}
```

---

### 3.6.2 注文별 注文 クーポン 一覧 取得
```http
GET /api/order-coupons/orders/:orderId
```

**Path Parameters:**
- `orderId`: 注文 ID

**レスポンス:**
```json
{
  "orderCoupons": [
    {
      "order_coupon_id": 1,
      "order_id": 1,
      "user_id": 1,
      "coupon_id": 1,
      "applied_value": "3000.00",
      "created_at": "2025-11-18T11:37:59.000Z",
      "coupon": {
        "coupon_id": 1,
        "code": "SAVE20",
        "discount_type": "rate",
        "discount_value": "20.00"
      }
    }
  ]
}
```

---

### 3.6.3 ユーザー別 注文 クーポン 一覧 取得
```http
GET /api/order-coupons/users/:userId
```

**Path Parameters:**
- `userId`: ユーザーID

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)

**レスポンス:**
```json
{
  "total": 10,
  "page": 1,
  "limit": 20,
  "totalPages": 1,
  "orderCoupons": [
    {
      "order_coupon_id": 1,
      "order_id": 1,
      "user_id": 1,
      "coupon_id": 1,
      "applied_value": "3000.00",
      "created_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 3.6.4 クーポン별 注文 クーポン 一覧 取得
```http
GET /api/order-coupons/coupons/:couponId
```

**Path Parameters:**
- `couponId`: クーポン ID

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)

**レスポンス:**
```json
{
  "total": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1,
  "orderCoupons": [
    {
      "order_coupon_id": 1,
      "order_id": 1,
      "user_id": 1,
      "coupon_id": 1,
      "applied_value": "3000.00",
      "created_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 3.6.5 IDで 注文 クーポン 取得
```http
GET /api/order-coupons/:id
```

**Path Parameters:**
- `id`: 注文 クーポン ID

**レスポンス:**
```json
{
  "orderCoupon": {
    "order_coupon_id": 1,
    "order_id": 1,
    "user_id": 1,
    "coupon_id": 1,
    "applied_value": "3000.00",
    "created_at": "2025-11-18T11:37:59.000Z",
    "order": {
      "id": 1,
      "order_number": "ORD-1703016000000-1234",
      "total_amount": 15000,
      "status": "completed"
    },
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "coupon": {
      "coupon_id": 1,
      "code": "SAVE20",
      "discount_type": "rate",
      "discount_value": "20.00"
    }
  }
}
```

---

### 3.6.6 注文 クーポン 作成
```http
POST /api/order-coupons
```

**Request Body:**
```json
{
  "order_id": 1,
  "user_id": 1,
  "coupon_id": 1,
  "applied_value": 3000
}
```

**レスポンス:**
```json
{
  "orderCoupon": {
    "order_coupon_id": 1,
    "order_id": 1,
    "user_id": 1,
    "coupon_id": 1,
    "applied_value": "3000.00",
    "created_at": "2025-11-18T20:50:57.000Z"
  }
}
```

> 💡 **参考**: 
> - 注文의 ユーザー와 `user_id`가 일치해야 합니다
> - 같은 注文에 같은 クーポン을 중복 적용할 수 없습니다
> - `applied_value`는 실제 적용된 할인 금액입니다

---

### 3.6.7 注文 クーポン 更新
```http
PUT /api/order-coupons/:id
```

**Path Parameters:**
- `id`: 注文 クーポン ID

**Request Body:**
```json
{
  "applied_value": 3500
}
```

**レスポンス:**
```json
{
  "orderCoupon": {
    "order_coupon_id": 1,
    "order_id": 1,
    "user_id": 1,
    "coupon_id": 1,
    "applied_value": "3500.00",
    "created_at": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 3.6.8 注文 クーポン 削除
```http
DELETE /api/order-coupons/:id
```

**Path Parameters:**
- `id`: 注文 クーポン ID

**レスポンス:**
```json
{
  "result": true
}
```

---

## 🏆 4. 랭킹 관련 (Rankings)

### 4.1 월간 TOP 5 랭킹
```http
GET /api/rankings/monthly
```

**Query Parameters:**
- `year` (任意): 연도 （デフォルト: 2025)
- `month` (任意): 월 （デフォルト: 11)

**例:**
```javascript
GET /api/rankings/monthly?year=2025&month=11
GET /api/rankings/monthly  // 기본값: 2025년 11월
```

**レスポンス:**
```json
{
  "rankings": [
    {
      "id": 23,
      "name": "Artelia",
      "price": 30000,
      "seller": "橋本光",
      "imageUrl": "uploads/ai/artelia.png",
      "rank_position": 1,
      "score": "1355.00",
      "category_name": "イメージ生成",
      "download_count": 1850,
      "rating_average": "4.90",
      "rating_count": 125
    }
  ]
}
```

---

## 📊 5. 통계 관련 (Stats / AI Stats)

### 5.1 마켓플레이스 全体 통계
```http
GET /api/stats/overview
```

**レスポンス:**
```json
{
  "stats": {
    "totalProducts": 70,
    "totalCategories": 7,
    "totalSubCategories": 70,
    "totalTags": 70,
    "totalDownloads": 87850,
    "totalViews": 226300,
    "averageRating": 4.75,
    "totalAIStats": 70,
    "totalSynergies": 101,
    "topCategory": {
      "id": 1,
      "name": "フロントエンド",
      "product_count": 10
    }
  }
}
```

---

### 5.2 AI Stats 全体 一覧 取得
```http
GET /api/stats
```

**Query Parameters:**
- `page` (任意): ページ番号（デフォルト: 1)
- `limit` (任意): 1ページあたりの件数（デフォルト: 20)

**例:**
```javascript
GET /api/stats
GET /api/stats?page=2&limit=10
```

**レスポンス:**
```json
{
  "stats": [
    {
      "id": 1,
      "product_id": 3,
      "teamwork": 79,
      "stability": 82,
      "speed": 73,
      "creativity": 70,
      "productivity": 81,
      "maintainability": 97,
      "created_at": "2025-11-18T11:54:57.000Z",
      "product": {
        "id": 3,
        "name": "CodePix",
        "price": 15000,
        "seller": "佐藤健太",
        "imageUrl": "uploads/ai/codepix.png"
      }
    }
  ],
  "pagination": {
    "total": 70,
    "page": 1,
    "limit": 20,
    "totalPages": 4
  }
}
```

---

### 5.3 AI Stats 取得 (IDで)
```http
GET /api/stats/:id
```

**Path Parameters:**
- `id`: Stats ID

**例:**
```javascript
GET /api/stats/1
```

**レスポンス:**
```json
{
  "stats": {
    "id": 1,
    "product_id": 3,
    "teamwork": 79,
    "stability": 82,
    "speed": 73,
    "creativity": 70,
    "productivity": 81,
    "maintainability": 97,
    "created_at": "2025-11-18T11:54:57.000Z",
    "product": {
      "id": 3,
      "name": "CodePix",
      "price": 15000,
      "seller": "佐藤健太",
      "imageUrl": "uploads/ai/codepix.png"
    }
  }
}
```

---

### 5.4 AI Stats 作成
```http
POST /api/stats
```

**Request Body:**
```json
{
  "product_id": 3,
  "teamwork": 79,
  "stability": 82,
  "speed": 73,
  "creativity": 70,
  "productivity": 81,
  "maintainability": 97
}
```

**참고:**
- 모든 필드는 선택사항이며, 기본값은 50입니다
- `product_id`는 필수입니다
- 각 값은 0-100 사이여야 합니다
- 하나의 상품당 하나의 statsのみ 존재할 수 있습니다

**レスポンス:**
```json
{
  "stats": {
    "id": 1,
    "product_id": 3,
    "teamwork": 79,
    "stability": 82,
    "speed": 73,
    "creativity": 70,
    "productivity": 81,
    "maintainability": 97,
    "created_at": "2025-11-18T11:54:57.000Z"
  }
}
```

---

### 5.5 AI Stats 更新
```http
PUT /api/stats/:id
```

**Path Parameters:**
- `id`: Stats ID

**Request Body:**
```json
{
  "teamwork": 85,
  "stability": 90,
  "speed": 80
}
```

**참고:**
- 모든 필드는 선택사항입니다
- 更新하려는 필드のみ 포함하면 됩니다
- 각 값은 0-100 사이여야 합니다

**レスポンス:**
```json
{
  "stats": {
    "id": 1,
    "product_id": 3,
    "teamwork": 85,
    "stability": 90,
    "speed": 80,
    "creativity": 70,
    "productivity": 81,
    "maintainability": 97,
    "created_at": "2025-11-18T11:54:57.000Z"
  }
}
```

---

### 5.6 AI Stats 削除
```http
DELETE /api/stats/:id
```

**Path Parameters:**
- `id`: Stats ID

**レスポンス:**
```json
{
  "result": true
}
```

---

### 5.7 商品別 AI Stats 作成/更新 (Upsert)
```http
POST /api/products/:id/stats
PUT /api/products/:id/stats
```

**Path Parameters:**
- `id`: 商品ID (product_id)

**Request Body:**
```json
{
  "teamwork": 79,
  "stability": 82,
  "speed": 73,
  "creativity": 70,
  "productivity": 81,
  "maintainability": 97
}
```

**참고:**
- 해당 상품의 stats가 없으면 作成하고, 있으면 更新합니다
- 모든 필드는 선택사항이며, 기본값은 50입니다
- 각 값은 0-100 사이여야 합니다

**レスポンス:**
```json
{
  "stats": {
    "id": 1,
    "product_id": 3,
    "teamwork": 79,
    "stability": 82,
    "speed": 73,
    "creativity": 70,
    "productivity": 81,
    "maintainability": 97,
    "created_at": "2025-11-18T11:54:57.000Z"
  }
}
```

---

## 🖼️ 6. 배너 관련 (Banners)

### 6.1 배너 一覧
```http
GET /banners
```

**レスポンス:**
```json
{
  "banners": [
    {
      "id": 1,
      "imageUrl": "uploads/banners/banner1.png",
      "href": "/products/1",
      "createdAt": "2025-11-16T07:40:16.000Z",
      "updatedAt": "2025-11-16T07:40:16.000Z"
    }
  ]
}
```

---

### 6.2 배너 作成
```http
POST /banners
```

**Request Body:**
```json
{
  "imageUrl": "uploads/banners/banner1.png",
  "href": "/products/1"
}
```

---

## 📤 7. 이미지 업로드 (Image)

### 7.1 이미지 업로드
```http
POST /image
```

**Request:**
- Content-Type: `multipart/form-data`
- Field: `image` (파일)

**レスポンス:**
```json
{
  "imageUrl": "uploads/1763279242452.jpeg"
}
```

---

## 📝 사용 예시 (JavaScript/React)

### API 설정 파일

```javascript
// src/config/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

export const marketplaceAPI = {
  // 상품 관련
  getProducts: (params) => 
    axios.get(`${API_BASE_URL}/api/products`, { params }),
  
  getProductDetail: (id) => 
    axios.get(`${API_BASE_URL}/api/products/${id}`),
  
  getProductStats: (id) =>
    axios.get(`${API_BASE_URL}/api/products/${id}/stats`),
  
  getProductSynergies: (id, limit = 5) =>
    axios.get(`${API_BASE_URL}/api/products/${id}/synergies`, { 
      params: { limit } 
    }),
  
  getProductsByCategory: (categoryId, params) =>
    axios.get(`${API_BASE_URL}/api/products/category/${categoryId}`, { params }),
  
  getProductsByTag: (tagId, params) =>
    axios.get(`${API_BASE_URL}/api/products/by-tag/${tagId}`, { params }),
  
  // 카테고리 관련
  getCategories: () => 
    axios.get(`${API_BASE_URL}/api/categories`),
  
  getCategoriesWithProducts: (productsLimit = 4) =>
    axios.get(`${API_BASE_URL}/api/categories/with-products`, {
      params: { productsLimit }
    }),
  
  getSubcategories: (categoryId) =>
    axios.get(`${API_BASE_URL}/api/categories/${categoryId}/subcategories`),
  
  // 카테고리별 대표 상품
  getFeaturedProductsByCategory: (categoryId, limit = 4) =>
    axios.get(`${API_BASE_URL}/api/products/featured/category/${categoryId}`, {
      params: { limit }
    }),
  
  // 랭킹 관련
  getMonthlyRankings: (year = 2025, month = 11) =>
    axios.get(`${API_BASE_URL}/api/rankings/monthly`, { 
      params: { year, month } 
    }),
  
  // 통계 관련
  getStats: () =>
    axios.get(`${API_BASE_URL}/api/stats/overview`),
  
  // タグ 관련
  getTags: () => 
    axios.get(`${API_BASE_URL}/api/tags`),
  
  // 배너 관련
  getBanners: () =>
    axios.get(`${API_BASE_URL}/banners`)
};
```

### React 컴포넌트 사용 예시

```javascript
import { useState, useEffect } from 'react';
import { marketplaceAPI } from '../config/api';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await marketplaceAPI.getProducts({
          page: 1,
          limit: 20,
          sort: 'download'
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // ...
};
```

---

## ⚠️ 에러 응답 형식

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "error": "에러 메시지"
}
```

**HTTP 상태 코드:**
- `200`: 성공
- `400`: 잘못된 요청
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 오류

---

## 📌 참고사항

1. 모든 날짜는 ISO 8601 형식 (UTC)으로 반환됩니다.
2. 페이지네이션은 1부터 시작합니다.
3. `soldout` 필드는 `0` (판매중) 또는 `1` (품절)입니다.
4. 이미지 업로드는 `multipart/form-data` 형식을 사용합니다.
5. 모든 새 API는 `/api` 접두사를 사용합니다.
6. AI 통계 데이터는 50~100 사이의 값을 가집니다.
7. 시너지 점수는 80~95 사이의 값을 가집니다.
8. 기본 정렬은 다운로드순(`download`)입니다.

---

## 🔄 하위 호환성

다음 기존 엔드포인트도 계속 사용 가능합니다:

- `GET /products` → `GET /api/products`와 동일
- `POST /products` → `POST /api/products`와 동일
- `GET /products/:id` → `GET /api/products/:id`와 동일
- `POST /products/purchase/:id` → `POST /api/products/purchase/:id`와 동일