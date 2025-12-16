// check-and-create-tables.js
// Railway MySQL에 테이블이 있는지 확인하고 없으면 생성
require('dotenv').config();
const models = require('../db/initializer');

async function checkAndCreateTables() {
    try {
        console.log('🔍 Railway MySQL 테이블 확인 중...\n');
        
        // 모든 테이블 목록 조회
        const [tables] = await models.sequelize.query(
            "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
            { replacements: [process.env.DB_NAME || 'railway'] }
        );
        
        const existingTables = tables.map(t => t.TABLE_NAME.toLowerCase());
        console.log('✅ 기존 테이블:', existingTables.join(', '));
        console.log(`총 ${existingTables.length}개 테이블\n`);
        
        // Sequelize로 모든 테이블 생성 (alter: false = 기존 테이블 수정 안 함, 새 테이블만 생성)
        console.log('📋 누락된 테이블 생성 중...');
        await models.sequelize.sync({ alter: false }); // alter: false = 기존 테이블 유지, 새 테이블만 생성
        
        // 다시 확인
        const [tablesAfter] = await models.sequelize.query(
            "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
            { replacements: [process.env.DB_NAME || 'railway'] }
        );
        
        const newTables = tablesAfter.map(t => t.TABLE_NAME.toLowerCase());
        console.log('\n✅ 생성 후 테이블:', newTables.join(', '));
        console.log(`총 ${newTables.length}개 테이블\n`);
        
        console.log('✅ 테이블 확인 및 생성 완료!');
        
    } catch (error) {
        console.error('❌ 오류:', error);
        console.error('상세 오류:', error.stack);
        process.exit(1);
    } finally {
        await models.sequelize.close();
        console.log('\n🔌 데이터베이스 연결 종료');
    }
}

checkAndCreateTables();

