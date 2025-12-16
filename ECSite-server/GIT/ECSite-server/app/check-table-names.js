// check-table-names.js
// Railway MySQL의 실제 테이블 이름 확인
require('dotenv').config();
const { Sequelize } = require('sequelize');

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

async function checkTableNames() {
    try {
        await railwayDB.authenticate();
        console.log('✅ Railway MySQL 연결 성공\n');
        
        // 모든 테이블 이름 확인 (대소문자 포함)
        const [tables] = await railwayDB.query(
            "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME",
            { replacements: [process.env.DB_NAME || 'railway'] }
        );
        
        console.log('📋 Railway MySQL 테이블 목록:');
        tables.forEach((t, i) => {
            console.log(`${i + 1}. ${t.TABLE_NAME}`);
        });
        
        console.log(`\n총 ${tables.length}개 테이블\n`);
        
        // products, tags, user_tags 테이블이 있는지 확인
        const tableNames = tables.map(t => t.TABLE_NAME);
        const lowerTableNames = tableNames.map(t => t.toLowerCase());
        
        console.log('🔍 확인 중인 테이블:');
        console.log(`  products: ${tableNames.includes('products') ? '✅' : tableNames.includes('Products') ? '✅ (대문자 P)' : '❌ 없음'}`);
        console.log(`  tags: ${tableNames.includes('tags') ? '✅' : tableNames.includes('Tags') ? '✅ (대문자 T)' : '❌ 없음'}`);
        
        // user_tags 관련 모든 가능한 이름 확인
        const userTagsVariants = ['user_tags', 'UserTags', 'User_Tags', 'userTags', 'user-tags'];
        const foundUserTags = userTagsVariants.find(variant => 
            tableNames.includes(variant) || lowerTableNames.includes(variant.toLowerCase())
        );
        console.log(`  user_tags: ${foundUserTags ? `✅ (실제 이름: ${foundUserTags})` : '❌ 없음'}`);
        
        // user로 시작하는 모든 테이블 찾기
        const userTables = tableNames.filter(t => t.toLowerCase().includes('user') || t.toLowerCase().includes('tag'));
        if (userTables.length > 0) {
            console.log('\n📋 user 또는 tag가 포함된 테이블:');
            userTables.forEach(t => console.log(`  - ${t}`));
        }
        
    } catch (error) {
        console.error('❌ 오류:', error);
        process.exit(1);
    } finally {
        await railwayDB.close();
    }
}

checkTableNames();

