// check-docker-reviews.js
// Docker MySQL (localhost:3307)에서 product_reviews 데이터 확인
const mysql = require('mysql2/promise');

async function checkReviews() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'aide_market',
    charset: 'utf8mb4'
  });

  try {
    console.log('🔍 Docker MySQL에서 product_reviews 데이터 조회 중...\n');
    
    // 전체 개수 확인
    const [count] = await connection.query('SELECT COUNT(*) as count FROM product_reviews');
    console.log(`📊 총 리뷰 개수: ${count[0].count}개\n`);

    // 모든 리뷰 조회
    const [reviews] = await connection.query('SELECT * FROM product_reviews ORDER BY id');
    
    if (reviews.length === 0) {
      console.log('⚠️ 리뷰 데이터가 없습니다.');
      return;
    }

    console.log('📋 리뷰 목록:\n');
    reviews.forEach((review, index) => {
      console.log(`--- Review ${review.id} ---`);
      console.log(`  ID: ${review.id}`);
      console.log(`  User ID: ${review.user_id}`);
      console.log(`  Product ID: ${review.product_id}`);
      console.log(`  Order Item ID: ${review.order_item_id || 'NULL'}`);
      console.log(`  Rating: ${review.rating}`);
      console.log(`  Title: ${review.title || 'NULL'}`);
      console.log(`  Review Text: ${review.review_text ? review.review_text.substring(0, 50) + '...' : 'NULL'}`);
      console.log(`  Review Images: ${review.review_images ? (review.review_images.length > 50 ? review.review_images.substring(0, 50) + '...' : review.review_images) : 'NULL'}`);
      console.log(`  Helpful Count: ${review.helpful_count}`);
      console.log(`  Created At: ${review.created_at}`);
      console.log(`  Updated At: ${review.updated_at}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ 오류:', error.message);
  } finally {
    await connection.end();
    console.log('🔌 연결 종료');
  }
}

checkReviews().catch(console.error);

