// fix-remaining-tables.js
// 실패한 테이블들 (order_items, order_coupons) 재마이그레이션
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixRemainingTables() {
  const dockerDB = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'aide_market',
    charset: 'utf8mb4'
  });

  const railwayDB = await mysql.createConnection({
    host: process.env.DB_HOST || 'shinkansen.proxy.rlwy.net',
    port: parseInt(process.env.DB_PORT || '27913'),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'VxhuRqkRYOMakXaCHsQupBJOuKvQkamT',
    database: process.env.DB_NAME || 'railway',
    charset: 'utf8mb4'
  });

  try {
    // Orders 테이블 확인 (대소문자 모두 확인)
    const [ordersExists] = await railwayDB.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND (TABLE_NAME = 'Orders' OR TABLE_NAME = 'orders')",
      [process.env.DB_NAME || 'railway']
    );

    if (ordersExists.length === 0) {
      console.log('⚠️ Orders/orders 테이블이 Railway에 없습니다. 먼저 Orders 테이블을 마이그레이션해야 합니다.');
      return;
    }

    const ordersTableName = ordersExists[0].TABLE_NAME;
    console.log(`✅ ${ordersTableName} 테이블 확인 완료\n`);

    // order_items 마이그레이션
    console.log('📦 order_items 테이블 마이그레이션 중...');
    const [orderItems] = await dockerDB.query('SELECT * FROM `order_items`');
    console.log(`   order_items: ${orderItems.length}개 행 발견`);

    const [orderItemsColumns] = await railwayDB.query('SHOW COLUMNS FROM `order_items`');
    const orderItemsColumnNames = orderItemsColumns.map(col => col.Field);

    let successCount = 0;
    let errorCount = 0;

    for (const row of orderItems) {
      try {
        const filteredColumns = [];
        const filteredValues = [];

        for (const [key, value] of Object.entries(row)) {
          const targetColumn = orderItemsColumnNames.find(c => c.toLowerCase() === key.toLowerCase());
          if (targetColumn && !filteredColumns.includes(targetColumn)) {
            filteredColumns.push(targetColumn);
            filteredValues.push(value === undefined || value === '' ? null : value);
          }
        }

        if (filteredColumns.length > 0) {
          const columns = filteredColumns.join(', ');
          const placeholders = filteredColumns.map(() => '?').join(', ');
          await railwayDB.query(
            `INSERT IGNORE INTO \`order_items\` (${columns}) VALUES (${placeholders})`,
            filteredValues
          );
          successCount++;
        } else {
          errorCount++;
        }
      } catch (err) {
        errorCount++;
        if (errorCount <= 5) {
          console.error(`   ⚠️ 행 삽입 오류:`, err.message);
        }
      }
    }

    console.log(`   ✅ order_items: ${successCount}개 성공${errorCount > 0 ? `, ${errorCount}개 실패` : ''}\n`);

    // order_coupons 마이그레이션
    console.log('📦 order_coupons 테이블 마이그레이션 중...');
    const [orderCoupons] = await dockerDB.query('SELECT * FROM `order_coupons`');
    console.log(`   order_coupons: ${orderCoupons.length}개 행 발견`);

    const [orderCouponsColumns] = await railwayDB.query('SHOW COLUMNS FROM `order_coupons`');
    const orderCouponsColumnNames = orderCouponsColumns.map(col => col.Field);

    // Orders 테이블의 ID 목록 가져오기
    const [orders] = await railwayDB.query(`SELECT id FROM \`${ordersTableName}\``);
    const orderIdMap = new Map(orders.map(o => [o.id, o.id]));

    successCount = 0;
    errorCount = 0;

    for (const row of orderCoupons) {
      try {
        // order_id 검증
        if (row.order_id && !orderIdMap.has(row.order_id)) {
          errorCount++;
          continue;
        }

        const filteredColumns = [];
        const filteredValues = [];

        for (const [key, value] of Object.entries(row)) {
          const targetColumn = orderCouponsColumnNames.find(c => c.toLowerCase() === key.toLowerCase());
          if (targetColumn && !filteredColumns.includes(targetColumn)) {
            filteredColumns.push(targetColumn);
            filteredValues.push(value === undefined || value === '' ? null : value);
          }
        }

        if (filteredColumns.length > 0) {
          const columns = filteredColumns.join(', ');
          const placeholders = filteredColumns.map(() => '?').join(', ');
          await railwayDB.query(
            `INSERT IGNORE INTO \`order_coupons\` (${columns}) VALUES (${placeholders})`,
            filteredValues
          );
          successCount++;
        } else {
          errorCount++;
        }
      } catch (err) {
        errorCount++;
        if (errorCount <= 5) {
          console.error(`   ⚠️ 행 삽입 오류:`, err.message);
        }
      }
    }

    console.log(`   ✅ order_coupons: ${successCount}개 성공${errorCount > 0 ? `, ${errorCount}개 실패` : ''}\n`);

    console.log('✅ 모든 테이블 수정 완료!');

  } catch (error) {
    console.error('❌ 오류:', error);
    console.error('상세 오류:', error.stack);
    process.exit(1);
  } finally {
    await dockerDB.end();
    await railwayDB.end();
    console.log('\n🔌 데이터베이스 연결 종료');
  }
}

fixRemainingTables().catch(console.error);

