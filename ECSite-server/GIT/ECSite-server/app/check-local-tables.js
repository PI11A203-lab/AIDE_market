// check-local-tables.js
// 로컬 MySQL의 테이블 목록 확인
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

async function checkLocalTables() {
    try {
        await localDB.authenticate();
        console.log('✅ 로컬 MySQL 연결 성공\n');
        
        // 모든 테이블 이름 확인
        const [tables] = await localDB.query(
            "SELECT TABLE_NAME as name FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME",
            { replacements: [process.env.LOCAL_DB_NAME || 'aide_market'] }
        );
        
        console.log('📋 로컬 MySQL 테이블 목록:');
        tables.forEach((t, i) => {
            console.log(`${i + 1}. ${t.name}`);
        });
        
        console.log(`\n총 ${tables.length}개 테이블\n`);
        
        // user_tags 관련 테이블 찾기
        const tableNames = tables.map(t => t.name);
        const userTagsTables = tableNames.filter(t => 
            t.toLowerCase().includes('user') && t.toLowerCase().includes('tag')
        );
        
        if (userTagsTables.length > 0) {
            console.log('🔍 user_tags 관련 테이블:');
            userTagsTables.forEach(t => console.log(`  - ${t}`));
        } else {
            console.log('⚠️ user_tags 관련 테이블을 찾을 수 없습니다.');
        }
        
    } catch (error) {
        console.error('❌ 오류:', error.message);
        process.exit(1);
    } finally {
        await localDB.close();
    }
}

checkLocalTables();

