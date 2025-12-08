-- ============================================
-- 관리자 대시보드 DB 마이그레이션
-- ============================================

-- 1. products 테이블에 created_by 컬럼 추가 (이미 있으면 스킵)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS created_by INT NULL,
  ADD INDEX IF NOT EXISTS idx_products_created_by (created_by),
  ADD CONSTRAINT IF NOT EXISTS fk_products_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- 2. product_reviews 테이블에 helpful_count 컬럼 추가
ALTER TABLE product_reviews
  ADD COLUMN IF NOT EXISTS helpful_count INT DEFAULT 0;

-- 3. product_reviews 인덱스 추가 (쿼리 성능 향상)
ALTER TABLE product_reviews
  ADD INDEX IF NOT EXISTS idx_product_reviews_product_id (product_id),
  ADD INDEX IF NOT EXISTS idx_product_reviews_created_at (created_at);

-- 4. orders 테이블 인덱스 추가 (쿼리 성능 향상)
ALTER TABLE orders
  ADD INDEX IF NOT EXISTS idx_orders_purchased_at (purchased_at),
  ADD INDEX IF NOT EXISTS idx_orders_status (status);

-- 5. order_items 인덱스 추가
ALTER TABLE order_items
  ADD INDEX IF NOT EXISTS idx_order_items_product_id (product_id);

-- 6. 기존 상품들에 created_by 설정 (seller 컬럼이 TEXT로 저장되어 있는 경우)
-- seller 이름이 username과 일치한다고 가정
UPDATE products p
JOIN users u ON p.seller = u.username
SET p.created_by = u.id
WHERE p.created_by IS NULL AND p.seller IS NOT NULL;

-- 7. 아직 created_by가 NULL인 상품은 admin 계정으로 설정
UPDATE products
SET created_by = (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE created_by IS NULL;

-- ============================================
-- 확인 쿼리
-- ============================================

-- 확인 1: products.created_by가 제대로 설정되었는지
SELECT 
  COUNT(*) as total,
  COUNT(created_by) as with_creator,
  COUNT(*) - COUNT(created_by) as without_creator
FROM products;

-- 확인 2: 관리자별 상품 수
SELECT 
  u.username,
  u.role,
  COUNT(p.id) as product_count
FROM users u
LEFT JOIN products p ON u.id = p.created_by
WHERE u.role = 'admin'
GROUP BY u.id, u.username, u.role;

-- 확인 3: product_reviews 컬럼 확인
DESCRIBE product_reviews;

-- ============================================
-- 롤백 쿼리 (필요시 사용)
-- ============================================
-- products.created_by 제거
-- ALTER TABLE products DROP FOREIGN KEY fk_products_created_by;
-- ALTER TABLE products DROP INDEX idx_products_created_by;
-- ALTER TABLE products DROP COLUMN created_by;

-- product_reviews.helpful_count 제거
-- ALTER TABLE product_reviews DROP COLUMN helpful_count;

