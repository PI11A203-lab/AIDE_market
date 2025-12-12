// credit_cards 테이블의 card_holder 컬럼을 NULL 허용하도록 수정하는 스크립트
const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const Sequelize = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: 'mysql',
        logging: console.log
    }
);

async function fixCardHolder() {
    try {
        console.log('🔧 credit_cards 테이블의 card_holder 컬럼 수정 중...');
        
        // card_holder 컬럼을 NULL 허용하도록 변경
        await sequelize.query(`
            ALTER TABLE credit_cards 
            MODIFY COLUMN card_holder VARCHAR(100) NULL;
        `);
        
        console.log('✅ card_holder 컬럼이 NULL을 허용하도록 수정되었습니다.');
        
        // 변경 사항 확인
        const [results] = await sequelize.query(`
            SHOW COLUMNS FROM credit_cards WHERE Field = 'card_holder';
        `);
        
        if (results.length > 0) {
            console.log('\n📋 card_holder 컬럼 정보:');
            console.log(JSON.stringify(results[0], null, 2));
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ 에러 발생:', error.message);
        console.error('에러 상세:', error);
        process.exit(1);
    }
}

// 연결 테스트 후 실행
sequelize.authenticate()
    .then(() => {
        console.log('✅ MySQL 연결 성공');
        return fixCardHolder();
    })
    .catch(err => {
        console.error('❌ MySQL 연결 실패:', err.message);
        process.exit(1);
    });

