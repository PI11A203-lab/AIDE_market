// migrate-docker-to-railway.js
// Docker MySQL (localhost:3307)에서 Railway MySQL로 모든 데이터 마이그레이션
const mysql = require('mysql2/promise');
require('dotenv').config();

// 테이블 생성 함수
async function createTableIfNotExists(dockerDB, railwayDB, tableName, railwayTableName) {
  try {
    // Railway에 테이블이 이미 있는지 확인
    const [railwayTableExists] = await railwayDB.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
      [process.env.DB_NAME || 'railway', railwayTableName]
    );

    if (railwayTableExists.length > 0) {
      return false; // 이미 존재
    }

    // Docker에서 테이블 구조 가져오기
    const [createTable] = await dockerDB.query(`SHOW CREATE TABLE \`${tableName}\``);
    let createTableSQL = createTable[0]['Create Table'];

    // 테이블명 변경
    createTableSQL = createTableSQL.replace(new RegExp(`\`${tableName}\``, 'g'), `\`${railwayTableName}\``);
    
    // 외래키 참조 수정 (대소문자 문제 해결)
    createTableSQL = createTableSQL.replace(/REFERENCES `tags` \(`id`\)/g, 'REFERENCES `Tags` (`id`)');
    createTableSQL = createTableSQL.replace(/REFERENCES `products` \(`id`\)/g, 'REFERENCES `Products` (`id`)');
    createTableSQL = createTableSQL.replace(/REFERENCES `users` \(`id`\)/g, 'REFERENCES `Users` (`id`)');
    createTableSQL = createTableSQL.replace(/REFERENCES `orders` \(`id`\)/g, 'REFERENCES `Orders` (`id`)');
    createTableSQL = createTableSQL.replace(/REFERENCES `categories` \(`id`\)/g, 'REFERENCES `Categories` (`id`)');
    
    // 외래키 제약 조건 이름 중복 방지 (고유한 이름으로 변경)
    const constraintNameRegex = /CONSTRAINT `([^`]+)` FOREIGN KEY/g;
    let constraintCounter = 1;
    createTableSQL = createTableSQL.replace(constraintNameRegex, (match, constraintName) => {
      const newName = `${railwayTableName}_fk_${constraintCounter++}`;
      return `CONSTRAINT \`${newName}\` FOREIGN KEY`;
    });

    // Railway에 테이블 생성
    await railwayDB.query(createTableSQL);
    console.log(`   ✅ ${railwayTableName} 테이블 생성 완료`);
    return true;
  } catch (err) {
    console.error(`   ⚠️ ${railwayTableName} 테이블 생성 실패:`, err.message);
    return false;
  }
}

async function migrateData() {
  // Docker MySQL 연결 (소스)
  const dockerDB = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'aide_market',
    charset: 'utf8mb4'
  });

  // Railway MySQL 연결 (타겟)
  const railwayDB = await mysql.createConnection({
    host: process.env.DB_HOST || 'shinkansen.proxy.rlwy.net',
    port: parseInt(process.env.DB_PORT || '27913'),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'VxhuRqkRYOMakXaCHsQupBJOuKvQkamT',
    database: process.env.DB_NAME || 'railway',
    charset: 'utf8mb4'
  });

  console.log('🔍 Docker MySQL에서 테이블 목록 조회 중...\n');

  try {
    // Docker MySQL의 모든 테이블 조회
    const [dockerTables] = await dockerDB.query(
      "SELECT TABLE_NAME as name FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'aide_market' ORDER BY TABLE_NAME"
    );

    console.log(`📊 발견된 테이블: ${dockerTables.length}개\n`);

    // 테이블명 매핑 (대소문자 처리)
    const tableNameMap = {
      'products': 'Products',
      'tags': 'Tags',
      'categories': 'Categories',
      'banners': 'Banners',
      'producttags': 'ProductTags',
      'users': 'Users',
      'orders': 'Orders'
    };

    // 마이그레이션 순서 정의 (외래키가 있는 테이블은 나중에)
    const migrationOrder = [
      'users', 'Users',
      'categories', 'Categories',
      'tags', 'Tags',
      'products', 'Products',
      'banners', 'Banners',
      'orders', 'Orders',
      'order_items',
      'coupons',
      'credit_cards',
      'order_coupons',
      'product_reviews',
      'product_favorites',
      'user_follows',
      'stats',
      'sub_categories',
      'carts',
      'cart_items',
      'payment_methods',
      'team_compositions',
      'team_members',
      'user_mail_settings',
      'producttags', 'ProductTags',
      'ai_stats',
      'product_synergies',
      'product_tags',
      'user_tags',
      'review_helpful',
      'synergies'
    ];

    let totalSuccess = 0;
    let totalError = 0;
    let totalSkipped = 0;
    let totalCreated = 0;

    // 테이블을 순서대로 마이그레이션
    const processedTables = new Set();
    
    for (const tableName of migrationOrder) {
      // Docker 테이블 목록에서 찾기
      const dockerTable = dockerTables.find(t => 
        t.name.toLowerCase() === tableName.toLowerCase() || 
        tableNameMap[t.name.toLowerCase()] === tableName
      );

      if (!dockerTable || processedTables.has(dockerTable.name)) {
        continue;
      }

      const dockerTableName = dockerTable.name;
      const railwayTableName = tableNameMap[dockerTableName.toLowerCase()] || dockerTableName;
      processedTables.add(dockerTableName);

      try {
        // Railway에 테이블이 존재하는지 확인
        let [railwayTableExists] = await railwayDB.query(
          "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
          [process.env.DB_NAME || 'railway', railwayTableName]
        );

        // 테이블이 없으면 생성 시도 (건너뜀 테이블들)
        if (railwayTableExists.length === 0) {
          const created = await createTableIfNotExists(dockerDB, railwayDB, dockerTableName, railwayTableName);
          if (!created) {
            console.log(`⚠️ Railway에 ${railwayTableName} 테이블이 없고 생성도 실패했습니다. 건너뜁니다.`);
            totalSkipped++;
            continue;
          }
          totalCreated++;
          // 다시 확인
          [railwayTableExists] = await railwayDB.query(
            "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
            [process.env.DB_NAME || 'railway', railwayTableName]
          );
        }

        console.log(`\n📦 ${dockerTableName} → ${railwayTableName} 테이블 마이그레이션 중...`);

        // Railway 테이블의 실제 컬럼명 확인
        const [railwayColumnsInfo] = await railwayDB.query(`SHOW COLUMNS FROM \`${railwayTableName}\``);
        const railwayColumnNames = railwayColumnsInfo.map(col => col.Field);
        const railwayColumnNamesLower = railwayColumnNames.map(c => c.toLowerCase());

        // Docker에서 데이터 조회
        const [rows] = await dockerDB.query(`SELECT * FROM \`${dockerTableName}\``);

        if (rows.length === 0) {
          console.log(`   ${dockerTableName}: 데이터 없음`);
          continue;
        }

        console.log(`   ${dockerTableName}: ${rows.length}개 행 발견`);

        // 외래키 매핑을 위한 참조 테이블 데이터 조회
        let userIdMap = null;
        let orderIdMap = null;
        
        if (railwayColumnNames.some(c => c.toLowerCase() === 'user_id')) {
          const [users] = await railwayDB.query(`SELECT id FROM \`Users\``);
          userIdMap = new Map(users.map(u => [u.id, u.id]));
        }
        
        if (railwayColumnNames.some(c => c.toLowerCase() === 'order_id')) {
          const [orders] = await railwayDB.query(`SELECT id FROM \`Orders\``);
          orderIdMap = new Map(orders.map(o => [o.id, o.id]));
        }

        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
          try {
            // 외래키 검증 (행 전체를 건너뛰기 위해 먼저 확인)
            let skipRow = false;
            if (userIdMap && row.user_id !== null && row.user_id !== undefined) {
              if (!userIdMap.has(row.user_id)) {
                skipRow = true;
              }
            }
            if (orderIdMap && row.order_id !== null && row.order_id !== undefined) {
              if (!orderIdMap.has(row.order_id)) {
                skipRow = true;
              }
            }
            
            if (skipRow) {
              errorCount++;
              continue;
            }

            const filteredRow = {};
            const filteredColumns = [];
            const filteredValues = [];

            for (const [key, value] of Object.entries(row)) {
              let targetColumnName = null;

              // 정확한 컬럼명 매칭
              if (railwayColumnNames.includes(key)) {
                targetColumnName = key;
              } else {
                // 대소문자 무시 매칭
                targetColumnName = railwayColumnNames.find(c => c.toLowerCase() === key.toLowerCase());

                // created_at -> createdAt, updated_at -> updatedAt 매핑
                if (!targetColumnName) {
                  if (key === 'created_at') {
                    targetColumnName = railwayColumnNames.find(c => c.toLowerCase() === 'createdat');
                  } else if (key === 'updated_at') {
                    targetColumnName = railwayColumnNames.find(c => c.toLowerCase() === 'updatedat');
                  }
                }
              }

              if (targetColumnName && !filteredColumns.includes(targetColumnName)) {
                let processedValue = value;

                // review_images 같은 JSON 컬럼 처리
                if (targetColumnName === 'review_images' || targetColumnName.toLowerCase().includes('images')) {
                  if (value === null || value === undefined || value === '') {
                    processedValue = null;
                  } else if (Array.isArray(value)) {
                    processedValue = JSON.stringify(value);
                  } else if (typeof value === 'string') {
                    if (value === 'Invalid value.' || value.trim() === '') {
                      processedValue = null;
                    } else {
                      try {
                        JSON.parse(value);
                        processedValue = value;
                      } catch (e) {
                        processedValue = null;
                      }
                    }
                  } else if (typeof value === 'object') {
                    processedValue = JSON.stringify(value);
                  } else {
                    processedValue = null;
                  }
                } else {
                  processedValue = (value === undefined || value === '') ? null : value;
                }

                filteredRow[targetColumnName] = processedValue;
                filteredColumns.push(targetColumnName);
                filteredValues.push(processedValue);
              }
            }

            if (filteredColumns.length === 0) {
              errorCount++;
              continue;
            }

            const columns = filteredColumns.join(', ');
            const placeholders = filteredColumns.map(() => '?').join(', ');

            // coupons 같은 테이블은 항상 INSERT IGNORE 사용 (중복 키 방지)
            const alwaysIgnore = ['coupons', 'credit_cards', 'order_coupons'].includes(dockerTableName.toLowerCase());
            const hasId = filteredColumns.includes('id');
            const insertQuery = (hasId || alwaysIgnore)
              ? `INSERT IGNORE INTO \`${railwayTableName}\` (${columns}) VALUES (${placeholders})`
              : `INSERT INTO \`${railwayTableName}\` (${columns}) VALUES (${placeholders})`;

            await railwayDB.query(insertQuery, filteredValues);
            successCount++;
          } catch (err) {
            errorCount++;
            if (errorCount <= 5) {
              console.error(`   ⚠️ 행 삽입 오류:`, err.message);
            }
          }
        }

        console.log(`   ✅ ${railwayTableName}: ${successCount}개 성공${errorCount > 0 ? `, ${errorCount}개 실패` : ''}`);
        totalSuccess += successCount;
        totalError += errorCount;
      } catch (err) {
        console.error(`   ❌ ${dockerTableName} 마이그레이션 오류:`, err.message);
        totalError++;
      }
    }

    // 나머지 테이블들도 마이그레이션 (순서에 없는 테이블들)
    for (const dockerTable of dockerTables) {
      if (processedTables.has(dockerTable.name)) {
        continue;
      }

      const dockerTableName = dockerTable.name;
      const railwayTableName = tableNameMap[dockerTableName.toLowerCase()] || dockerTableName;

      try {
        let [railwayTableExists] = await railwayDB.query(
          "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
          [process.env.DB_NAME || 'railway', railwayTableName]
        );

        if (railwayTableExists.length === 0) {
          const created = await createTableIfNotExists(dockerDB, railwayDB, dockerTableName, railwayTableName);
          if (!created) {
            console.log(`⚠️ Railway에 ${railwayTableName} 테이블이 없습니다. 건너뜁니다.`);
            totalSkipped++;
            continue;
          }
          totalCreated++;
        }

        console.log(`\n📦 ${dockerTableName} → ${railwayTableName} 테이블 마이그레이션 중...`);

        const [railwayColumnsInfo] = await railwayDB.query(`SHOW COLUMNS FROM \`${railwayTableName}\``);
        const railwayColumnNames = railwayColumnsInfo.map(col => col.Field);

        const [rows] = await dockerDB.query(`SELECT * FROM \`${dockerTableName}\``);

        if (rows.length === 0) {
          console.log(`   ${dockerTableName}: 데이터 없음`);
          continue;
        }

        console.log(`   ${dockerTableName}: ${rows.length}개 행 발견`);

        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
          try {
            const filteredRow = {};
            const filteredColumns = [];
            const filteredValues = [];

            for (const [key, value] of Object.entries(row)) {
              let targetColumnName = railwayColumnNames.find(c => c.toLowerCase() === key.toLowerCase());
              
              if (targetColumnName && !filteredColumns.includes(targetColumnName)) {
                let processedValue = (value === undefined || value === '') ? null : value;
                filteredRow[targetColumnName] = processedValue;
                filteredColumns.push(targetColumnName);
                filteredValues.push(processedValue);
              }
            }

            if (filteredColumns.length === 0) {
              errorCount++;
              continue;
            }

            const columns = filteredColumns.join(', ');
            const placeholders = filteredColumns.map(() => '?').join(', ');
            const hasId = filteredColumns.includes('id');
            const insertQuery = hasId
              ? `INSERT IGNORE INTO \`${railwayTableName}\` (${columns}) VALUES (${placeholders})`
              : `INSERT INTO \`${railwayTableName}\` (${columns}) VALUES (${placeholders})`;

            await railwayDB.query(insertQuery, filteredValues);
            successCount++;
          } catch (err) {
            errorCount++;
            if (errorCount <= 5) {
              console.error(`   ⚠️ 행 삽입 오류:`, err.message);
            }
          }
        }

        console.log(`   ✅ ${railwayTableName}: ${successCount}개 성공${errorCount > 0 ? `, ${errorCount}개 실패` : ''}`);
        totalSuccess += successCount;
        totalError += errorCount;
      } catch (err) {
        console.error(`   ❌ ${dockerTableName} 마이그레이션 오류:`, err.message);
        totalError++;
      }
    }

    console.log(`\n\n✅ 마이그레이션 완료!`);
    console.log(`   총 성공: ${totalSuccess}개`);
    console.log(`   총 실패: ${totalError}개`);
    console.log(`   건너뜀: ${totalSkipped}개 테이블`);
    console.log(`   생성됨: ${totalCreated}개 테이블`);

  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error);
    console.error('상세 오류:', error.stack);
    process.exit(1);
  } finally {
    await dockerDB.end();
    await railwayDB.end();
    console.log('\n🔌 데이터베이스 연결 종료');
  }
}

migrateData().catch(console.error);

