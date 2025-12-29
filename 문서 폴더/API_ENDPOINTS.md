# AIDE Market API 엔드포인트 문서

> 프론트엔드 개발자를 위한 API 엔드포인트 가이드

**Base URL**: `http://localhost:8081`

> 💡 **프론트엔드 개발 참고**: Base URL은 환경 변수로 관리하는 것을 권장합니다.
> ```javascript
> const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';
> ```

---

## 📦 1. 상품 관련 (Products)

### 1.1 전체 상품 목록 (페이지네이션 + 필터)
```http
GET /api/products
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `category` (optional): 카테고리 ID로 필터링
- `sort` (optional): 정렬 옵션
  - `download` (기본값): 다운로드순
  - `rating`: 평점순
  - `price`: 가격 낮은순
  - `priceDesc`: 가격 높은순
- `search` (optional): 검색어 (상품명, 설명에서 검색)

**예시:**
```javascript
// 기본 목록 (다운로드순)
GET /api/products

// 페이지네이션
GET /api/products?page=2&limit=20

// 카테고리 필터 + 검색
GET /api/products?category=1&search=React&sort=rating

// 평점순 정렬
GET /api/products?sort=rating&limit=10
```

**응답:**
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

### 1.2 상품 상세 정보 (AI 통계 + 태그 + 시너지 포함)
```http
GET /api/products/:id
```

**Path Parameters:**
- `id`: 상품 ID

**예시:**
```javascript
GET /api/products/3
```

**응답:**
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

### 1.3 AI 통계 조회 (육각형 차트용)
```http
GET /api/products/:id/stats
```

**Path Parameters:**
- `id`: 상품 ID

**예시:**
```javascript
GET /api/products/3/stats
```

**응답:**
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

### 1.4 추천 AI 조회 (시너지)
```http
GET /api/products/:id/synergies
```

**Path Parameters:**
- `id`: 상품 ID

**Query Parameters:**
- `limit` (optional): 최대 개수 (기본값: 5)

**예시:**
```javascript
GET /api/products/3/synergies?limit=5
```

**응답:**
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

### 1.5 카테고리별 대표 상품 조회 (메인 페이지용)
```http
GET /api/products/featured/category/:categoryId
```

**Path Parameters:**
- `categoryId`: 카테고리 ID

**Query Parameters:**
- `limit` (optional): 반환할 상품 개수 (기본값: 4)

**예시:**
```javascript
// 기본: 4개 상품
GET /api/products/featured/category/1

// 6개 상품
GET /api/products/featured/category/1?limit=6
```

**응답:**
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

> 💡 **프론트엔드 개발 참고**: 특정 카테고리의 대표 상품만 필요할 때 이 엔드포인트를 사용하면 됩니다. 다운로드 수와 평점이 높은 순으로 정렬됩니다.

---

### 1.6 카테고리별 상품 목록
```http
GET /api/products/category/:categoryId
```

**Path Parameters:**
- `categoryId`: 카테고리 ID

**Query Parameters:**
- `subcategory` (optional): 서브카테고리 ID
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `sort` (optional): 정렬 옵션

**예시:**
```javascript
GET /api/products/category/1?page=1&limit=10&sort=download
GET /api/products/category/1?subcategory=2
```

**응답:**
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

### 1.7 태그별 상품 목록
```http
GET /api/products/by-tag/:tagId
```

**Path Parameters:**
- `tagId`: 태그 ID

**Query Parameters:**
- `page` (optional): 페이지 번호
- `limit` (optional): 페이지당 항목 수

**예시:**
```javascript
GET /api/products/by-tag/1?page=1&limit=10
```

**응답:**
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

### 1.8 상품 생성
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

**응답:**
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

### 1.9 상품 구매
```http
POST /api/products/purchase/:id
```

**Path Parameters:**
- `id`: 상품 ID

**응답:**
```json
{
  "result": true
}
```

---

## 📁 2. 카테고리 관련 (Categories)

### 2.1 전체 카테고리 목록
```http
GET /api/categories
```

**응답:**
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

### 2.2 메인 페이지용: 카테고리 목록과 각 카테고리의 대표 상품
```http
GET /api/categories/with-products
```

**Query Parameters:**
- `productsLimit` (optional): 각 카테고리별 대표 상품 개수 (기본값: 4)

**예시:**
```javascript
// 기본: 각 카테고리당 4개 상품
GET /api/categories/with-products

// 각 카테고리당 6개 상품
GET /api/categories/with-products?productsLimit=6
```

**응답:**
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

> 💡 **프론트엔드 개발 참고**: 메인 페이지의 카테고리 표에 각 카테고리의 대표 상품을 표시할 때 이 엔드포인트를 사용하면 됩니다.

---

### 2.3 서브카테고리 목록
```http
GET /api/categories/:id/subcategories
```

**Path Parameters:**
- `id`: 카테고리 ID

**응답:**
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

### 2.4 카테고리 생성
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

## 📂 2.5 서브카테고리 관련 (SubCategories)

### 2.5.1 전체 서브카테고리 목록
```http
GET /api/subcategories
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `category_id` (optional): 카테고리 ID로 필터링

**예시:**
```javascript
// 전체 목록
GET /api/subcategories

// 페이지네이션
GET /api/subcategories?page=2&limit=10

// 특정 카테고리의 서브카테고리
GET /api/subcategories?category_id=1
```

**응답:**
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

### 2.5.2 카테고리별 서브카테고리 목록
```http
GET /api/subcategories/category/:categoryId
```

**Path Parameters:**
- `categoryId`: 카테고리 ID

**응답:**
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

### 2.5.3 ID로 서브카테고리 조회
```http
GET /api/subcategories/:id
```

**Path Parameters:**
- `id`: 서브카테고리 ID

**응답:**
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

### 2.5.4 서브카테고리 생성
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

**응답:**
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

### 2.5.5 서브카테고리 업데이트
```http
PUT /api/subcategories/:id
```

**Path Parameters:**
- `id`: 서브카테고리 ID

**Request Body:**
```json
{
  "name": "TypeScript",
  "tech_stack": "TypeScript, TS"
}
```

**응답:**
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

### 2.5.6 서브카테고리 삭제
```http
DELETE /api/subcategories/:id
```

**Path Parameters:**
- `id`: 서브카테고리 ID

**응답:**
```json
{
  "result": true
}
```

> ⚠️ **주의**: 해당 서브카테고리를 사용하는 상품이 있으면 삭제할 수 없습니다.

---

## 👥 2.6 팀 구성 관련 (Team Compositions)

### 2.6.1 사용자별 팀 구성 목록
```http
GET /api/team-compositions/users/:userId
```

**Path Parameters:**
- `userId`: 사용자 ID

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**예시:**
```javascript
GET /api/team-compositions/users/1
GET /api/team-compositions/users/1?page=2&limit=10
```

**응답:**
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
      "name": "프론트엔드 팀",
      "total_synergy_score": 420,
      "created_at": "2025-11-18T11:37:59.000Z",
      "updated_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 2.6.2 전체 팀 구성 목록 (관리자용)
```http
GET /api/team-compositions
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**예시:**
```javascript
GET /api/team-compositions
GET /api/team-compositions?page=2&limit=10
```

**응답:**
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
      "name": "프론트엔드 팀",
      "total_synergy_score": 420,
      "created_at": "2025-11-18T11:37:59.000Z",
      "updated_at": "2025-11-18T11:37:59.000Z"
    }
  ]
}
```

---

### 2.6.3 ID로 팀 구성 조회
```http
GET /api/team-compositions/:id
```

**Path Parameters:**
- `id`: 팀 구성 ID

**응답:**
```json
{
  "teamComposition": {
    "id": 1,
    "user_id": 1,
    "name": "프론트엔드 팀",
    "total_synergy_score": 420,
    "created_at": "2025-11-18T11:37:59.000Z",
    "updated_at": "2025-11-18T11:37:59.000Z"
  }
}
```

---

### 2.6.4 팀 구성 생성
```http
POST /api/team-compositions
```

**Request Body:**
```json
{
  "user_id": 1,
  "name": "백엔드 팀",
  "total_synergy_score": 380
}
```

**응답:**
```json
{
  "teamComposition": {
    "id": 2,
    "user_id": 1,
    "name": "백엔드 팀",
    "total_synergy_score": 380,
    "created_at": "2025-11-18T20:50:57.000Z",
    "updated_at": "2025-11-18T20:50:57.000Z"
  }
}
```

---

### 2.6.5 팀 구성 업데이트
```http
PUT /api/team-compositions/:id
```

**Path Parameters:**
- `id`: 팀 구성 ID

**Request Body:**
```json
{
  "name": "풀스택 팀",
  "total_synergy_score": 450
}
```

**응답:**
```json
{
  "teamComposition": {
    "id": 1,
    "user_id": 1,
    "name": "풀스택 팀",
    "total_synergy_score": 450,
    "created_at": "2025-11-18T11:37:59.000Z",
    "updated_at": "2025-11-18T21:00:00.000Z"
  }
}
```

---

### 2.6.6 팀 구성 삭제
```http
DELETE /api/team-compositions/:id
```

**Path Parameters:**
- `id`: 팀 구성 ID

**응답:**
```json
{
  "result": true
}
```

> ⚠️ **주의**: 팀 구성 삭제 시 관련된 팀 멤버(team_members)도 함께 삭제됩니다 (CASCADE).

---

## 👤 2.7 팀 멤버 관련 (Team Members)

### 2.7.1 팀별 멤버 목록 조회
```http
GET /api/team-members/teams/:teamId
```

**Path Parameters:**
- `teamId`: 팀 구성 ID

**응답:**
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

### 2.7.2 ID로 팀 멤버 조회
```http
GET /api/team-members/:id
```

**Path Parameters:**
- `id`: 팀 멤버 ID

**응답:**
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

### 2.7.3 팀 멤버 추가
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

**응답:**
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

> 💡 **참고**: `position`을 제공하지 않으면 자동으로 현재 팀의 최대 position + 1이 설정됩니다. 같은 팀에 같은 상품을 중복으로 추가할 수 없습니다 (unique constraint).

---

### 2.7.4 팀 멤버 업데이트
```http
PUT /api/team-members/:id
```

**Path Parameters:**
- `id`: 팀 멤버 ID

**Request Body:**
```json
{
  "category_id": 2,
  "position": 3
}
```

**응답:**
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

### 2.7.5 팀 멤버 삭제 (ID로)
```http
DELETE /api/team-members/:id
```

**Path Parameters:**
- `id`: 팀 멤버 ID

**응답:**
```json
{
  "result": true
}
```

---

### 2.7.6 팀 멤버 삭제 (team_id와 product_id로)
```http
DELETE /api/team-members/teams/:teamId/products/:productId
```

**Path Parameters:**
- `teamId`: 팀 구성 ID
- `productId`: 상품 ID

**응답:**
```json
{
  "result": true
}
```

---

## 📧 2.8 사용자 메일 설정 관련 (User Mail Settings)

### 2.8.1 사용자별 메일 설정 조회
```http
GET /api/user-mail-settings/users/:userId
```

**Path Parameters:**
- `userId`: 사용자 ID

**응답:**
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

> 🔒 **보안 참고**: 응답에서 `smtp_password`는 보안상 제외됩니다.

---

### 2.8.2 ID로 메일 설정 조회
```http
GET /api/user-mail-settings/:id
```

**Path Parameters:**
- `id`: 메일 설정 ID

**응답:**
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

### 2.8.3 전체 메일 설정 목록 조회 (관리자용)
```http
GET /api/user-mail-settings
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**예시:**
```javascript
GET /api/user-mail-settings
GET /api/user-mail-settings?page=2&limit=10
```

**응답:**
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

### 2.8.4 메일 설정 생성 또는 업데이트 (upsert)
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

**응답:**
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

> 💡 **참고**: `user_id`가 이미 존재하면 업데이트, 없으면 생성됩니다. `smtp_port`는 1부터 65535 사이의 값이어야 합니다.

---

### 2.8.5 메일 설정 업데이트
```http
PUT /api/user-mail-settings/:id
```

**Path Parameters:**
- `id`: 메일 설정 ID

**Request Body:**
```json
{
  "smtp_server": "smtp.outlook.com",
  "smtp_port": 465,
  "is_enabled": false
}
```

**응답:**
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

> 💡 **참고**: 제공된 필드만 업데이트됩니다 (partial update).

---

### 2.8.6 메일 설정 삭제 (ID로)
```http
DELETE /api/user-mail-settings/:id
```

**Path Parameters:**
- `id`: 메일 설정 ID

**응답:**
```json
{
  "result": true
}
```

---

### 2.8.7 메일 설정 삭제 (user_id로)
```http
DELETE /api/user-mail-settings/users/:userId
```

**Path Parameters:**
- `userId`: 사용자 ID

**응답:**
```json
{
  "result": true
}
```

---

## 🏷️ 3. 태그 관련 (Tags)

### 3.1 전체 태그 목록
```http
GET /api/tags
```

**응답:**
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

### 3.2 태그 생성
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

## 🎫 3.3 쿠폰 관련 (Coupons)

### 3.3.1 전체 쿠폰 목록 조회
```http
GET /api/coupons
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `activeOnly` (optional): 활성화된 쿠폰만 조회 (기본값: false)

**예시:**
```javascript
// 전체 목록
GET /api/coupons

// 활성화된 쿠폰만
GET /api/coupons?activeOnly=true

// 페이지네이션
GET /api/coupons?page=2&limit=10
```

**응답:**
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

### 3.3.2 ID로 쿠폰 조회
```http
GET /api/coupons/:id
```

**Path Parameters:**
- `id`: 쿠폰 ID

**응답:**
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

### 3.3.3 쿠폰 코드로 조회
```http
GET /api/coupons/code/:code
```

**Path Parameters:**
- `code`: 쿠폰 코드

**예시:**
```javascript
GET /api/coupons/code/SAVE20
```

**응답:**
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

### 3.3.4 쿠폰 유효성 검사 및 할인 계산
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

**응답:**
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

> 💡 **참고**: 쿠폰 코드가 유효한지 검사하고, 주문 금액에 대한 할인 금액과 최종 금액을 계산합니다. 쿠폰이 만료되었거나 비활성화되었거나 최소 주문 금액을 충족하지 못하면 에러를 반환합니다.

---

### 3.3.5 쿠폰 생성
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

**응답:**
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

> 💡 **참고**: 
> - `discount_type`: "amount" (고정 금액) 또는 "rate" (비율)
> - `discount_value`: 할인 값 (금액 또는 비율)
> - `max_discount`: 비율 할인 시 최대 할인 금액 (선택)
> - `min_order`: 최소 주문 금액 (선택)
> - 코드는 자동으로 대문자로 변환됩니다

---

### 3.3.6 쿠폰 업데이트
```http
PUT /api/coupons/:id
```

**Path Parameters:**
- `id`: 쿠폰 ID

**Request Body:**
```json
{
  "is_active": false,
  "expires_at": "2026-01-31T23:59:59.000Z"
}
```

**응답:**
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

### 3.3.7 쿠폰 삭제
```http
DELETE /api/coupons/:id
```

**Path Parameters:**
- `id`: 쿠폰 ID

**응답:**
```json
{
  "result": true
}
```

---

## 👤 3.4 사용자 관련 (Users)

> ⚠️ **주의**: `bcrypt` 패키지가 필요합니다. 설치하려면 `npm install bcrypt`를 실행하세요.

### 3.4.1 전체 사용자 목록 조회
```http
GET /api/users
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**예시:**
```javascript
GET /api/users
GET /api/users?page=2&limit=10
```

**응답:**
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

> 🔒 **보안 참고**: 응답에서 `password_hash`는 보안상 제외됩니다.

---

### 3.4.2 ID로 사용자 조회
```http
GET /api/users/:id
```

**Path Parameters:**
- `id`: 사용자 ID

**응답:**
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

### 3.4.3 사용자명으로 사용자 조회
```http
GET /api/users/username/:username
```

**Path Parameters:**
- `username`: 사용자명

**예시:**
```javascript
GET /api/users/username/john_doe
```

**응답:**
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

### 3.4.4 사용자 생성
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

**응답:**
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

> 💡 **참고**: 비밀번호는 자동으로 bcrypt로 해시 처리됩니다. `role`은 기본값이 "user"이며 "admin" 또는 "user"만 허용됩니다.

---

### 3.4.5 사용자 업데이트
```http
PUT /api/users/:id
```

**Path Parameters:**
- `id`: 사용자 ID

**Request Body:**
```json
{
  "username": "john_doe_updated",
  "email": "john.updated@example.com",
  "role": "admin"
}
```

**응답:**
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

> 💡 **참고**: 비밀번호가 제공되면 자동으로 해시 처리됩니다. 제공된 필드만 업데이트됩니다 (partial update).

---

### 3.4.6 사용자 삭제
```http
DELETE /api/users/:id
```

**Path Parameters:**
- `id`: 사용자 ID

**응답:**
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
- `id`: 사용자 ID

**Request Body:**
```json
{
  "password": "securePassword123"
}
```

**응답:**
```json
{
  "valid": true
}
```

---

## 📦 3.5 주문 관련 (Orders)

### 3.5.1 전체 주문 목록 조회
```http
GET /api/orders
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `user_id` (optional): 사용자 ID로 필터링
- `status` (optional): 주문 상태로 필터링 ('pending', 'completed', 'cancelled', 'refunded')

**예시:**
```javascript
// 전체 목록
GET /api/orders

// 사용자별 필터링
GET /api/orders?user_id=1

// 상태별 필터링
GET /api/orders?status=pending

// 페이징
GET /api/orders?page=2&limit=10
```

**응답:**
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

> 🔒 **보안 참고**: 응답에서 `card_number_encrypted`와 `card_cvc_encrypted`는 보안상 제외됩니다.

---

### 3.5.2 사용자별 주문 목록 조회
```http
GET /api/orders/users/:userId
```

**Path Parameters:**
- `userId`: 사용자 ID

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**예시:**
```javascript
GET /api/orders/users/1
GET /api/orders/users/1?page=2&limit=10
```

**응답:**
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

### 3.5.3 ID로 주문 조회
```http
GET /api/orders/:id
```

**Path Parameters:**
- `id`: 주문 ID

**응답:**
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

### 3.5.4 주문 번호로 주문 조회
```http
GET /api/orders/order-number/:orderNumber
```

**Path Parameters:**
- `orderNumber`: 주문 번호

**예시:**
```javascript
GET /api/orders/order-number/ORD-1703016000000-1234
```

**응답:**
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

### 3.5.5 주문 생성
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

**응답:**
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

> 💡 **참고**: 
> - `order_number`는 자동으로 생성됩니다 (형식: ORD-{timestamp}-{random})
> - 카드 정보(`card_number`, `card_cvc`)는 자동으로 암호화되어 저장됩니다
> - `status` 기본값은 "pending"입니다
> - `card_company`는 'VISA', 'Master', 'JCB', 'AMEX', 'Diners', 'etc' 중 하나여야 합니다

---

### 3.5.6 주문 업데이트
```http
PUT /api/orders/:id
```

**Path Parameters:**
- `id`: 주문 ID

**Request Body:**
```json
{
  "status": "completed",
  "payment_method": "credit_card"
}
```

**응답:**
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

> 💡 **참고**: 제공된 필드만 업데이트됩니다 (partial update). 주문 상태 변경 시 사용 가능한 상태: 'pending', 'completed', 'cancelled', 'refunded'

---

### 3.5.7 주문 삭제
```http
DELETE /api/orders/:id
```

**Path Parameters:**
- `id`: 주문 ID

**응답:**
```json
{
  "result": true
}
```

> ⚠️ **주의**: 주문 삭제 시 관련된 주문 아이템(order_items)도 함께 삭제됩니다 (CASCADE).

---

## 📋 3.6 주문 아이템 관련 (Order Items)

### 3.6.1 전체 주문 아이템 목록 조회
```http
GET /api/order-items
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `order_id` (optional): 주문 ID로 필터링
- `product_id` (optional): 상품 ID로 필터링

**예시:**
```javascript
// 전체 목록
GET /api/order-items

// 주문별 필터링
GET /api/order-items?order_id=1

// 상품별 필터링
GET /api/order-items?product_id=3

// 페이징
GET /api/order-items?page=2&limit=10
```

**응답:**
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

### 3.6.2 주문별 주문 아이템 목록 조회
```http
GET /api/order-items/orders/:orderId
```

**Path Parameters:**
- `orderId`: 주문 ID

**응답:**
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

### 3.6.3 주문별 주문 아이템 총합 계산
```http
GET /api/order-items/orders/:orderId/total
```

**Path Parameters:**
- `orderId`: 주문 ID

**응답:**
```json
{
  "total": 30000
}
```

> 💡 **참고**: 주문의 모든 아이템의 (quantity × unit_price) 합계를 계산합니다.

---

### 3.6.4 상품별 주문 아이템 목록 조회
```http
GET /api/order-items/products/:productId
```

**Path Parameters:**
- `productId`: 상품 ID

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**응답:**
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

### 3.6.5 ID로 주문 아이템 조회
```http
GET /api/order-items/:id
```

**Path Parameters:**
- `id`: 주문 아이템 ID

**응답:**
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

### 3.6.6 주문 아이템 생성
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

**응답:**
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

> 💡 **참고**: `quantity` 기본값은 1입니다. `has_review` 기본값은 false입니다.

---

### 3.6.7 주문 아이템 업데이트
```http
PUT /api/order-items/:id
```

**Path Parameters:**
- `id`: 주문 아이템 ID

**Request Body:**
```json
{
  "quantity": 2,
  "has_review": true
}
```

**응답:**
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

### 3.6.8 주문 아이템 삭제
```http
DELETE /api/order-items/:id
```

**Path Parameters:**
- `id`: 주문 아이템 ID

**응답:**
```json
{
  "result": true
}
```

---

## 🎟️ 3.7 주문 쿠폰 관련 (Order Coupons)

### 3.6.1 전체 주문 쿠폰 목록 조회
```http
GET /api/order-coupons
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `order_id` (optional): 주문 ID로 필터링
- `user_id` (optional): 사용자 ID로 필터링
- `coupon_id` (optional): 쿠폰 ID로 필터링

**예시:**
```javascript
// 전체 목록
GET /api/order-coupons

// 주문별 필터링
GET /api/order-coupons?order_id=1

// 사용자별 필터링
GET /api/order-coupons?user_id=1

// 페이징
GET /api/order-coupons?page=2&limit=10
```

**응답:**
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

### 3.6.2 주문별 주문 쿠폰 목록 조회
```http
GET /api/order-coupons/orders/:orderId
```

**Path Parameters:**
- `orderId`: 주문 ID

**응답:**
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

### 3.6.3 사용자별 주문 쿠폰 목록 조회
```http
GET /api/order-coupons/users/:userId
```

**Path Parameters:**
- `userId`: 사용자 ID

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**응답:**
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

### 3.6.4 쿠폰별 주문 쿠폰 목록 조회
```http
GET /api/order-coupons/coupons/:couponId
```

**Path Parameters:**
- `couponId`: 쿠폰 ID

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**응답:**
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

### 3.6.5 ID로 주문 쿠폰 조회
```http
GET /api/order-coupons/:id
```

**Path Parameters:**
- `id`: 주문 쿠폰 ID

**응답:**
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

### 3.6.6 주문 쿠폰 생성
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

**응답:**
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

> 💡 **참고**: 
> - 주문의 사용자와 `user_id`가 일치해야 합니다
> - 같은 주문에 같은 쿠폰을 중복 적용할 수 없습니다
> - `applied_value`는 실제 적용된 할인 금액입니다

---

### 3.6.7 주문 쿠폰 업데이트
```http
PUT /api/order-coupons/:id
```

**Path Parameters:**
- `id`: 주문 쿠폰 ID

**Request Body:**
```json
{
  "applied_value": 3500
}
```

**응답:**
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

### 3.6.8 주문 쿠폰 삭제
```http
DELETE /api/order-coupons/:id
```

**Path Parameters:**
- `id`: 주문 쿠폰 ID

**응답:**
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
- `year` (optional): 연도 (기본값: 2025)
- `month` (optional): 월 (기본값: 11)

**예시:**
```javascript
GET /api/rankings/monthly?year=2025&month=11
GET /api/rankings/monthly  // 기본값: 2025년 11월
```

**응답:**
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

### 5.1 마켓플레이스 전체 통계
```http
GET /api/stats/overview
```

**응답:**
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

### 5.2 AI Stats 전체 목록 조회
```http
GET /api/stats
```

**Query Parameters:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**예시:**
```javascript
GET /api/stats
GET /api/stats?page=2&limit=10
```

**응답:**
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

### 5.3 AI Stats 조회 (ID로)
```http
GET /api/stats/:id
```

**Path Parameters:**
- `id`: Stats ID

**예시:**
```javascript
GET /api/stats/1
```

**응답:**
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

### 5.4 AI Stats 생성
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
- 하나의 상품당 하나의 stats만 존재할 수 있습니다

**응답:**
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

### 5.5 AI Stats 업데이트
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
- 업데이트하려는 필드만 포함하면 됩니다
- 각 값은 0-100 사이여야 합니다

**응답:**
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

### 5.6 AI Stats 삭제
```http
DELETE /api/stats/:id
```

**Path Parameters:**
- `id`: Stats ID

**응답:**
```json
{
  "result": true
}
```

---

### 5.7 상품별 AI Stats 생성/업데이트 (Upsert)
```http
POST /api/products/:id/stats
PUT /api/products/:id/stats
```

**Path Parameters:**
- `id`: 상품 ID (product_id)

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
- 해당 상품의 stats가 없으면 생성하고, 있으면 업데이트합니다
- 모든 필드는 선택사항이며, 기본값은 50입니다
- 각 값은 0-100 사이여야 합니다

**응답:**
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

### 6.1 배너 목록
```http
GET /banners
```

**응답:**
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

### 6.2 배너 생성
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

**응답:**
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
  
  // 태그 관련
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