// check-docker-all-data.js
// Docker MySQL (localhost:3307)에서 모든 테이블 데이터 확인
const mysql = require('mysql2/promise');

async function checkAllData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'aide_market',
    charset: 'utf8mb4'
  });

  try {
    console.log('🔍 Docker MySQL에서 모든 테이블 조회 중...\n');
    
    // 모든 테이블 목록 가져오기
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'aide_market' ORDER BY TABLE_NAME"
    );

    console.log(`📊 총 테이블 개수: ${tables.length}개\n`);
    console.log('='.repeat(80));

    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      
      try {
        // 각 테이블의 데이터 개수 확인
        const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
        const count = countResult[0].count;

        console.log(`\n📋 테이블: ${tableName}`);
        console.log(`   데이터 개수: ${count}개`);

        if (count > 0) {
          // 처음 5개 행만 조회 (너무 많으면 출력이 길어짐)
          const [rows] = await connection.query(`SELECT * FROM \`${tableName}\` LIMIT 5`);
          
          if (rows.length > 0) {
            console.log(`   샘플 데이터 (최대 5개):`);
            
            // 컬럼명 출력
            const columns = Object.keys(rows[0]);
            console.log(`   컬럼: ${columns.join(', ')}`);
            
            // 각 행 출력 (간단하게)
            rows.forEach((row, index) => {
              const values = columns.map(col => {
                const val = row[col];
                if (val === null || val === undefined) return 'NULL';
                if (typeof val === 'string' && val.length > 30) return val.substring(0, 30) + '...';
                if (typeof val === 'object') return JSON.stringify(val).substring(0, 30) + '...';
                return String(val);
              });
              console.log(`   [${index + 1}] ${values.join(' | ')}`);
            });

            if (count > 5) {
              console.log(`   ... 외 ${count - 5}개 더 있음`);
            }
          }
        } else {
          console.log(`   ⚠️ 데이터 없음`);
        }
        
        console.log('-'.repeat(80));
      } catch (err) {
        console.log(`\n❌ 테이블 ${tableName} 조회 오류: ${err.message}`);
        console.log('-'.repeat(80));
      }
    }

    // 주요 테이블 요약
    console.log('\n\n📊 주요 테이블 요약:');
    const importantTables = ['users', 'products', 'product_reviews', 'orders', 'order_items', 'categories', 'tags'];
    
    for (const tableName of importantTables) {
      try {
        const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
        const count = countResult[0].count;
        console.log(`   ${tableName}: ${count}개`);
      } catch (err) {
        // 테이블이 없으면 무시
      }
    }

  } catch (error) {
    console.error('❌ 오류:', error.message);
    console.error('상세 오류:', error.stack);
  } finally {
    await connection.end();
    console.log('\n🔌 연결 종료');
  }
}

checkAllData().catch(console.error);

