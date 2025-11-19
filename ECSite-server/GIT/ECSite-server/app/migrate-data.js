// migrate-data.js
require('dotenv').config();
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];
const models = require('../db/initializer');

console.log('🚀 마이그레이션 시작...');

// SQLite 연결 (app/database.sqlite3 파일 사용)
const sqliteDB = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite3'),
    logging: false
});

// MySQL 연결 (config에서 설정 가져오기)
const mysqlDB = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: 'mysql',
        logging: console.log,
        pool: config.pool || {}
    }
);

async function migrateData() {
    try {
        // MySQL 연결 테스트
        await mysqlDB.authenticate();
        console.log('✅ MySQL 연결 성공');

        // SQLite 연결 테스트
        await sqliteDB.authenticate();
        console.log('✅ SQLite 연결 성공\n');

        // MySQL에 테이블 생성 (Sequelize 모델 사용)
        console.log('📋 MySQL 테이블 생성 중...');
        await models.sequelize.sync({ alter: false });
        console.log('✅ MySQL 테이블 생성 완료\n');

        // 1. SQLite에서 모든 테이블 조회
        const [tables] = await sqliteDB.query(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        );
        
        console.log('발견된 테이블:', tables.map(t => t.name));

        if (tables.length === 0) {
            console.log('⚠️ 마이그레이션할 테이블이 없습니다.');
            return;
        }

        // 2. 각 테이블의 데이터를 MySQL로 복사
        for (const table of tables) {
            const tableName = table.name;
            console.log(`\n📦 ${tableName} 테이블 마이그레이션 중...`);

            // SQLite에서 테이블 스키마 확인
            const [schema] = await sqliteDB.query(`PRAGMA table_info(${tableName})`);
            console.log(`   컬럼: ${schema.map(s => s.name).join(', ')}`);

            // SQLite에서 데이터 가져오기
            const [rows] = await sqliteDB.query(`SELECT * FROM ${tableName}`);
            
            if (rows.length === 0) {
                console.log(`   ${tableName}: 데이터 없음`);
                continue;
            }

            console.log(`   ${tableName}: ${rows.length}개 행 발견`);

            // MySQL에 데이터 삽입 (중복 방지를 위해 INSERT IGNORE 사용)
            let successCount = 0;
            let errorCount = 0;

            for (const row of rows) {
                try {
                    const columns = Object.keys(row).join(', ');
                    const placeholders = Object.keys(row).map(() => '?').join(', ');
                    const values = Object.values(row);

                    // id가 있으면 INSERT IGNORE 사용, 없으면 일반 INSERT
                    const hasId = columns.includes('id');
                    const insertQuery = hasId 
                        ? `INSERT IGNORE INTO ${tableName} (${columns}) VALUES (${placeholders})`
                        : `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

                    await mysqlDB.query(insertQuery, { replacements: values });
                    successCount++;
                } catch (err) {
                    errorCount++;
                    console.error(`   ⚠️ 행 삽입 오류:`, err.message);
                }
            }

            console.log(`   ✅ ${tableName}: ${successCount}개 성공${errorCount > 0 ? `, ${errorCount}개 실패` : ''}`);
        }

        console.log('\n✅ 모든 데이터 마이그레이션 완료!');
        
    } catch (error) {
        console.error('❌ 마이그레이션 오류:', error);
        console.error('상세 오류:', error.stack);
        process.exit(1);
    } finally {
        await sqliteDB.close();
        await mysqlDB.close();
        console.log('\n🔌 데이터베이스 연결 종료');
    }
}

migrateData();