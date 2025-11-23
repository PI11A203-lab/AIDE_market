// db/add-products-columns.js - Products 테이블에 누락된 컬럼 추가
require('dotenv').config();
const models = require('./initializer');

async function addProductsColumns() {
    try {
        console.log('🔧 Products 테이블에 누락된 컬럼 추가 중...\n');

        // 데이터베이스 연결 확인
        await models.sequelize.authenticate();
        console.log('✓ 데이터베이스 연결 성공\n');

        // 현재 존재하는 컬럼 확인
        const [existingColumns] = await models.sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'Products'
        `);
        
        const columnNames = existingColumns.map(col => col.COLUMN_NAME);
        console.log(`현재 컬럼: ${columnNames.join(', ')}\n`);

        // 필요한 컬럼 목록
        const requiredColumns = [
            {
                name: 'tech_stack',
                type: 'VARCHAR(100) NULL',
                index: false
            }
        ];

        // 각 컬럼 추가
        for (const col of requiredColumns) {
            if (columnNames.includes(col.name)) {
                console.log(`✓ ${col.name} 컬럼이 이미 존재합니다.`);
                continue;
            }

            try {
                const alterQuery = `ALTER TABLE Products ADD COLUMN ${col.name} ${col.type}`;
                await models.sequelize.query(alterQuery);
                console.log(`✓ ${col.name} 컬럼을 추가했습니다.`);
            } catch (error) {
                if (error.message.includes('Duplicate column name')) {
                    console.log(`ℹ️ ${col.name} 컬럼이 이미 존재합니다.`);
                } else {
                    throw error;
                }
            }
        }

        console.log('\n✅ 마이그레이션 완료');
    } catch (error) {
        console.error('❌ 마이그레이션 중 오류 발생:', error.message);
        console.error('상세:', error);
        process.exit(1);
    } finally {
        await models.sequelize.close();
        console.log('🔌 데이터베이스 연결을 닫았습니다');
    }
}

// 스크립트가 직접 실행된 경우
if (require.main === module) {
    addProductsColumns();
}

module.exports = addProductsColumns;

