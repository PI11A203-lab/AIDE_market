-- ============================================

-- AIDE Market - 신규 테이블 생성 스크립트

-- MySQL 9.3.0

-- ============================================

-- 1. 사용자 테이블

CREATE TABLE IF NOT EXISTS users (

  id INT PRIMARY KEY AUTO_INCREMENT,

  username VARCHAR(50) NOT NULL UNIQUE,

  email VARCHAR(100) NOT NULL UNIQUE,

  password_hash VARCHAR(255) NOT NULL,

  role ENUM('admin', 'user') DEFAULT 'user',

  profile_image VARCHAR(500),

  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),

  INDEX idx_username (username)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 메일 서버 설정

CREATE TABLE IF NOT EXISTS user_mail_settings (

  id INT PRIMARY KEY AUTO_INCREMENT,

  user_id INT NOT NULL,

  smtp_server VARCHAR(100),

  smtp_port INT,

  smtp_user VARCHAR(100),

  smtp_password VARCHAR(255),

  from_address VARCHAR(100),

  from_name VARCHAR(100),

  is_enabled TINYINT(1) DEFAULT 0,

  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE KEY unique_user_mail (user_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 상품 찜/좋아요

CREATE TABLE IF NOT EXISTS product_favorites (

  id INT PRIMARY KEY AUTO_INCREMENT,

  user_id INT NOT NULL,

  product_id INT NOT NULL,

  category_id INT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,

  UNIQUE KEY unique_favorite (user_id, product_id),

  INDEX idx_user_category (user_id, category_id),

  INDEX idx_created_at (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 장바구니

CREATE TABLE IF NOT EXISTS carts (

  id INT PRIMARY KEY AUTO_INCREMENT,

  user_id INT NOT NULL,

  status ENUM('active', 'ordered') DEFAULT 'active',

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_user_status (user_id, status)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 장바구니 아이템

CREATE TABLE IF NOT EXISTS cart_items (

  id INT PRIMARY KEY AUTO_INCREMENT,

  cart_id INT NOT NULL,

  product_id INT NOT NULL,

  quantity INT DEFAULT 1,

  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

  UNIQUE KEY unique_cart_item (cart_id, product_id),

  INDEX idx_cart_id (cart_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 주문

CREATE TABLE IF NOT EXISTS orders (

  id INT PRIMARY KEY AUTO_INCREMENT,

  user_id INT NOT NULL,

  order_number VARCHAR(50) UNIQUE,

  status ENUM('pending', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',

  total_amount INT NOT NULL,

  payment_method VARCHAR(50),

  purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),

  INDEX idx_user_date (user_id, purchased_at),

  INDEX idx_order_number (order_number),

  INDEX idx_status (status)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. 주문 아이템

CREATE TABLE IF NOT EXISTS order_items (

  id INT PRIMARY KEY AUTO_INCREMENT,

  order_id INT NOT NULL,

  product_id INT NOT NULL,

  quantity INT DEFAULT 1,

  unit_price INT NOT NULL,

  has_review TINYINT(1) DEFAULT 0,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,

  FOREIGN KEY (product_id) REFERENCES products(id),

  INDEX idx_order_id (order_id),

  INDEX idx_product_review (product_id, has_review)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. 상품 리뷰

CREATE TABLE IF NOT EXISTS product_reviews (

  id INT PRIMARY KEY AUTO_INCREMENT,

  user_id INT NOT NULL,

  product_id INT NOT NULL,

  order_item_id INT NOT NULL,

  rating DECIMAL(2,1) NOT NULL,

  review_text TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),

  FOREIGN KEY (product_id) REFERENCES products(id),

  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,

  UNIQUE KEY one_review_per_purchase (order_item_id),

  INDEX idx_product_rating (product_id, rating),

  INDEX idx_user_id (user_id),

  CHECK (rating >= 1.0 AND rating <= 5.0)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. 팀 구성

CREATE TABLE IF NOT EXISTS team_compositions (

  id INT PRIMARY KEY AUTO_INCREMENT,

  user_id INT NOT NULL,

  name VARCHAR(100) NOT NULL,

  total_synergy_score INT DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_user_id (user_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. 팀 멤버

CREATE TABLE IF NOT EXISTS team_members (

  id INT PRIMARY KEY AUTO_INCREMENT,

  team_id INT NOT NULL,

  product_id INT NOT NULL,

  category_id INT,

  position INT,

  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (team_id) REFERENCES team_compositions(id) ON DELETE CASCADE,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,

  UNIQUE KEY unique_team_member (team_id, product_id),

  INDEX idx_team_id (team_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================

-- 테이블 생성 완료

-- ============================================

