// 데이터베이스 연결 테스트 스크립트
const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

const Sequelize = require('sequelize');
const config = require('./config/config.js')[process.env.NODE_ENV || 'development'];

console.log('\n=== 데이터베이스 연결 테스트 ===');
console.log('설정된 DB 정보:');
console.log('  Host:', config.host);
console.log('  Port:', config.port);
console.log('  Database:', config.database);
console.log('  Username:', config.username);
console.log('  Password:', config.password ? '***' : '(없음)');
console.log('');

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: 'mysql',
        logging: false
    }
);

// 연결 테스트
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ 데이터베이스 연결 성공!');
        
        // 간단한 쿼리 테스트
        const [results] = await sequelize.query('SELECT DATABASE() as current_db');
        console.log('현재 연결된 데이터베이스:', results[0].current_db);
        
        // orders 테이블 확인
        try {
            const [orders] = await sequelize.query('SELECT COUNT(*) as count FROM orders');
            console.log('orders 테이블 레코드 수:', orders[0].count);
        } catch (err) {
            console.log('⚠️ orders 테이블 조회 실패:', err.message);
        }
        
        await sequelize.close();
        console.log('\n연결 테스트 완료!');
        process.exit(0);
    } catch (error) {
        console.error('❌ 데이터베이스 연결 실패:');
        console.error('  에러:', error.message);
        console.error('\n확인 사항:');
        console.error('  1. MySQL 서버가 실행 중인지 확인');
        console.error('  2. Host, Port, Username, Password가 올바른지 확인');
        console.error('  3. 데이터베이스가 존재하는지 확인');
        process.exit(1);
    }
}

testConnection();

