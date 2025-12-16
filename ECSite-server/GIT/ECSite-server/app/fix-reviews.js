// fix-reviews.js
// 로컬 MySQL (3306)에서 Docker MySQL (3307)로 product_reviews 데이터 복사
const mysql = require('mysql2/promise');

async function fixReviews() {
  const source = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'aide_market',
    charset: 'utf8mb4'
  });

  const target = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'aide_market',
    charset: 'utf8mb4'
  });

  console.log('🔍 로컬 MySQL에서 product_reviews 데이터 조회 중...');
  const [rows] = await source.query('SELECT * FROM product_reviews');
  console.log(`📦 발견된 리뷰: ${rows.length}개\n`);

  if (rows.length === 0) {
    console.log('⚠️ 복사할 데이터가 없습니다.');
    await source.end();
    await target.end();
    return;
  }

  // Docker MySQL의 product_reviews 테이블 구조 확인
  console.log('📋 Docker MySQL의 product_reviews 테이블 구조 확인 중...');
  const [targetColumns] = await target.query('SHOW COLUMNS FROM product_reviews');
  const targetColumnNames = targetColumns.map(col => col.Field);
  console.log(`   컬럼: ${targetColumnNames.join(', ')}\n`);

  let successCount = 0;
  let errorCount = 0;
  let skipCount = 0;

  for (const row of rows) {
    try {
      // Docker MySQL에 있는 컬럼만 필터링
      const filteredRow = {};
      const filteredColumns = [];
      const filteredValues = [];

      for (const [key, value] of Object.entries(row)) {
        if (targetColumnNames.includes(key)) {
          let processedValue = value;
          
          // review_images가 JSON 타입인 경우 처리
          if (key === 'review_images') {
            if (value === null || value === undefined || value === '') {
              processedValue = null;
            } else if (Array.isArray(value)) {
              // 배열인 경우 JSON 문자열로 변환
              processedValue = JSON.stringify(value);
            } else if (typeof value === 'string') {
              // 문자열인 경우 유효한 JSON인지 확인
              if (value === 'Invalid value.' || value.trim() === '') {
                processedValue = null;
              } else {
                try {
                  JSON.parse(value);
                  processedValue = value; // 유효한 JSON 문자열
                } catch (e) {
                  // 유효하지 않은 JSON이면 null로 설정
                  console.log(`   ⚠️ Review ${row.id}: review_images가 유효하지 않은 JSON입니다. NULL로 설정합니다.`);
                  processedValue = null;
                }
              }
            } else if (typeof value === 'object') {
              // 객체인 경우 JSON 문자열로 변환
              processedValue = JSON.stringify(value);
            } else {
              processedValue = null;
            }
          } else {
            // 다른 컬럼들은 그대로 사용 (undefined나 빈 문자열은 null로)
            if (value === undefined || value === '') {
              processedValue = null;
            } else {
              processedValue = value;
            }
          }
          
          filteredRow[key] = processedValue;
          filteredColumns.push(key);
          filteredValues.push(processedValue);
        }
      }

      if (filteredColumns.length === 0) {
        console.log(`⚠️ Review ${row.id}: 매칭되는 컬럼이 없습니다.`);
        skipCount++;
        continue;
      }

      // INSERT IGNORE를 사용하여 중복 방지
      const columns = filteredColumns.join(', ');
      const placeholders = filteredColumns.map(() => '?').join(', ');
      const query = `INSERT IGNORE INTO product_reviews (${columns}) VALUES (${placeholders})`;

      await target.query(query, filteredValues);
      successCount++;
      console.log(`   ✓ Review ${row.id} 복사 완료`);
    } catch (err) {
      errorCount++;
      console.log(`   ✗ Review ${row.id}: ${err.message}`);
      // 상세 오류 정보 출력
      if (err.message.includes('SQL syntax')) {
        console.log(`      데이터:`, JSON.stringify(row, null, 2));
      }
    }
  }

  console.log(`\n✅ 완료!`);
  console.log(`   성공: ${successCount}개`);
  console.log(`   실패: ${errorCount}개`);
  console.log(`   건너뜀: ${skipCount}개`);

  // 최종 확인
  const [targetCount] = await target.query('SELECT COUNT(*) as count FROM product_reviews');
  console.log(`\n📊 Docker MySQL의 product_reviews 총 개수: ${targetCount[0].count}개`);

  await source.end();
  await target.end();
  console.log('\n🔌 연결 종료');
}

fixReviews().catch(console.error);
