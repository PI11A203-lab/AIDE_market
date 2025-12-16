// migrate-mysql-to-railway.js
// 로컬 MySQL에서 Railway MySQL로 데이터 복사
require('dotenv').config();
const { Sequelize } = require('sequelize');
const models = require('../db/initializer');

console.log('🚀 MySQL → Railway MySQL 마이그레이션 시작...\n');

// 로컬 MySQL 연결 (기본값)
const localDB = new Sequelize(
    process.env.LOCAL_DB_NAME || 'aide_market',
    process.env.LOCAL_DB_USERNAME || 'root',
    process.env.LOCAL_DB_PASSWORD || 'root',
    {
        host: process.env.LOCAL_DB_HOST || '127.0.0.1',
        port: process.env.LOCAL_DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    }
);

// Railway MySQL 연결 (.env 또는 환경변수에서)
const railwayDB = new Sequelize(
    process.env.DB_NAME || 'railway',
    process.env.DB_USERNAME || 'root',
    process.env.DB_PASSWORD || 'VxhuRqkRYOMakXaCHsQupBJOuKvQkamT',
    {
        host: process.env.DB_HOST || 'shinkansen.proxy.rlwy.net',
        port: process.env.DB_PORT || 27913,
        dialect: 'mysql',
        logging: console.log,
        dialectOptions: {
            connectTimeout: 60000
        }
    }
);

async function migrateData() {
    try {
        // Railway MySQL 연결 테스트
        await railwayDB.authenticate();
        console.log('✅ Railway MySQL 연결 성공');

        // 로컬 MySQL 연결 테스트
        await localDB.authenticate();
        console.log('✅ 로컬 MySQL 연결 성공\n');

        // Railway에 테이블 생성
        console.log('📋 Railway MySQL 테이블 생성 중...');
        await models.sequelize.sync({ alter: false });
        console.log('✅ Railway MySQL 테이블 생성 완료\n');

        // 로컬 MySQL에서 모든 테이블 조회
        const [tables] = await localDB.query(
            "SELECT TABLE_NAME as name FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
            { replacements: [process.env.LOCAL_DB_NAME || 'aide_market'] }
        );
        
        console.log('발견된 테이블:', tables.map(t => t.name));

        if (tables.length === 0) {
            console.log('⚠️ 마이그레이션할 테이블이 없습니다.');
            return;
        }

        // 테이블 이름 매핑 (로컬 → Railway)
        // Railway MySQL은 대문자로 시작하는 테이블 이름을 사용
        const tableNameMap = {
            'products': 'Products',
            'tags': 'Tags',
            'categories': 'Categories',
            'banners': 'Banners',
            'producttags': 'ProductTags'
        };

        // 각 테이블의 데이터를 Railway로 복사
        for (const table of tables) {
            const localTableName = table.name;
            // Railway 테이블 이름 확인 (매핑이 있으면 사용, 없으면 원래 이름)
            const railwayTableName = tableNameMap[localTableName.toLowerCase()] || localTableName;
            console.log(`\n📦 ${localTableName} → ${railwayTableName} 테이블 마이그레이션 중...`);

            // Railway에 테이블이 있는지 확인
            const [railwayTables] = await railwayDB.query(
                "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
                { replacements: [process.env.DB_NAME || 'railway', railwayTableName] }
            );

            if (railwayTables.length === 0) {
                console.log(`   ⚠️ Railway에 ${railwayTableName} 테이블이 없습니다. 건너뜁니다.`);
                continue;
            }

            // 로컬에서 데이터 가져오기
            const [rows] = await localDB.query(`SELECT * FROM ${localTableName}`);
            
            if (rows.length === 0) {
                console.log(`   ${localTableName}: 데이터 없음`);
                continue;
            }

            console.log(`   ${localTableName}: ${rows.length}개 행 발견`);

            // Railway 테이블의 실제 컬럼 확인
            const [railwayColumns] = await railwayDB.query(
                `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
                { replacements: [process.env.DB_NAME || 'railway', railwayTableName] }
            );
            const railwayColumnNames = railwayColumns.map(c => c.COLUMN_NAME);
            const railwayColumnNamesLower = railwayColumnNames.map(c => c.toLowerCase());

            // Railway에 데이터 삽입
            let successCount = 0;
            let errorCount = 0;

            for (const row of rows) {
                try {
                    // Railway 테이블에 있는 컬럼만 필터링
                    const filteredRow = {};
                    const filteredValues = [];
                    const filteredColumns = [];

                    for (const [key, value] of Object.entries(row)) {
                        // 컬럼 이름 매핑 (created_at -> createdAt 등)
                        let railwayColumnName = null;
                        
                        // 먼저 정확히 일치하는 컬럼 찾기
                        if (railwayColumnNames.includes(key)) {
                            railwayColumnName = key;
                        } else {
                            // 대소문자 구분 없이 찾기
                            railwayColumnName = railwayColumnNames.find(c => c.toLowerCase() === key.toLowerCase());
                            
                            // 특수 매핑: created_at -> createdAt, updated_at -> updatedAt
                            if (!railwayColumnName) {
                                if (key === 'created_at') {
                                    railwayColumnName = railwayColumnNames.find(c => c.toLowerCase() === 'createdat');
                                } else if (key === 'updated_at') {
                                    railwayColumnName = railwayColumnNames.find(c => c.toLowerCase() === 'updatedat');
                                }
                            }
                        }

                        // Railway 테이블에 컬럼이 있고, 아직 추가되지 않았으면 추가
                        if (railwayColumnName && !filteredColumns.includes(railwayColumnName)) {
                            filteredRow[railwayColumnName] = value;
                            filteredColumns.push(railwayColumnName);
                            filteredValues.push(value === null || value === undefined ? null : value); // NULL/undefined 값 명시적 처리
                        }
                    }

                    if (filteredColumns.length === 0) {
                        errorCount++;
                        continue;
                    }

                    const columns = filteredColumns.join(', ');
                    const placeholders = filteredColumns.map(() => '?').join(', ');

                    // id가 있으면 INSERT IGNORE 사용
                    const hasId = filteredColumns.includes('id');
                    const insertQuery = hasId 
                        ? `INSERT IGNORE INTO ${railwayTableName} (${columns}) VALUES (${placeholders})`
                        : `INSERT INTO ${railwayTableName} (${columns}) VALUES (${placeholders})`;

                    await railwayDB.query(insertQuery, { replacements: filteredValues });
                    successCount++;
                } catch (err) {
                    errorCount++;
                    if (errorCount <= 5) { // 처음 5개 에러만 출력
                        console.error(`   ⚠️ 행 삽입 오류:`, err.message);
                    }
                }
            }

            console.log(`   ✅ ${railwayTableName}: ${successCount}개 성공${errorCount > 0 ? `, ${errorCount}개 실패` : ''}`);
        }

        console.log('\n✅ 모든 데이터 마이그레이션 완료!');
        
    } catch (error) {
        console.error('❌ 마이그레이션 오류:', error);
        console.error('상세 오류:', error.stack);
        process.exit(1);
    } finally {
        await localDB.close();
        await railwayDB.close();
        console.log('\n🔌 데이터베이스 연결 종료');
    }
}

migrateData();

