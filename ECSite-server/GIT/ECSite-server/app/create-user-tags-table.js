// create-user-tags-table.js
// 로컬 MySQL에서 user_tags 테이블 구조를 가져와서 Railway MySQL에 생성
require('dotenv').config();
const { Sequelize } = require('sequelize');

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

const railwayDB = new Sequelize(
    process.env.DB_NAME || 'railway',
    process.env.DB_USERNAME || 'root',
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'turntable.proxy.rlwy.net',
        port: process.env.DB_PORT || 17892,
        dialect: 'mysql',
        logging: console.log
    }
);

async function createUserTagsTable() {
    try {
        await localDB.authenticate();
        console.log('✅ 로컬 MySQL 연결 성공');

        await railwayDB.authenticate();
        console.log('✅ Railway MySQL 연결 성공\n');

        // 로컬에서 user_tags 테이블 구조 확인
        console.log('🔍 로컬 user_tags 테이블 구조 확인 중...');
        const [createTable] = await localDB.query('SHOW CREATE TABLE user_tags');
        const createTableSQL = createTable[0]['Create Table'];
        
        console.log('📋 테이블 생성 SQL:');
        console.log(createTableSQL);
        console.log('\n');

        // Railway에 테이블이 이미 있는지 확인
        const [existingTables] = await railwayDB.query(
            "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'user_tags'",
            { replacements: [process.env.DB_NAME || 'railway'] }
        );

        if (existingTables.length > 0) {
            console.log('⚠️ Railway에 이미 user_tags 테이블이 있습니다.');
            return;
        }

        // Railway에 테이블 생성
        // 외래키 제약조건에서 테이블 이름 수정 (tags -> Tags, users는 소문자로 유지)
        let modifiedSQL = createTableSQL;
        modifiedSQL = modifiedSQL.replace(/REFERENCES `tags`/gi, 'REFERENCES `Tags`');
        modifiedSQL = modifiedSQL.replace(/REFERENCES `users`/gi, 'REFERENCES `users`');
        
        console.log('📦 Railway MySQL에 user_tags 테이블 생성 중...');
        await railwayDB.query(modifiedSQL);
        console.log('✅ user_tags 테이블 생성 완료!');

    } catch (error) {
        console.error('❌ 오류:', error);
        console.error('상세 오류:', error.stack);
        process.exit(1);
    } finally {
        await localDB.close();
        await railwayDB.close();
        console.log('\n🔌 데이터베이스 연결 종료');
    }
}

createUserTagsTable();

