// view-all-data.js - MySQL의 모든 데이터를 보기 좋게 표시
require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];
const models = require('../db/initializer');
const fs = require('fs');
const path = require('path');

async function viewAllData() {
    try {
        console.log('🔍 MySQL 데이터 전체 조회 중...\n');

        // MySQL 연결 테스트
        await models.sequelize.authenticate();
        console.log('✅ MySQL 연결 성공\n');

        // 모든 테이블 조회
        const [tables] = await models.sequelize.query(
            "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
            { replacements: [config.database] }
        );

        console.log(`📋 발견된 테이블: ${tables.length}개\n`);
        console.log('='.repeat(80));

        const allData = {};

        // 각 테이블의 모든 데이터 조회
        for (const table of tables) {
            const tableName = table.TABLE_NAME;
            const [rows] = await models.sequelize.query(`SELECT * FROM ${tableName}`);
            
            allData[tableName] = rows;

            console.log(`\n📦 ${tableName.toUpperCase()} 테이블`);
            console.log(`   총 ${rows.length}개 행\n`);
            
            if (rows.length === 0) {
                console.log('   (데이터 없음)');
            } else {
                rows.forEach((row, index) => {
                    console.log(`   [${index + 1}]`);
                    Object.keys(row).forEach(key => {
                        const value = row[key];
                        const displayValue = value === null ? '(null)' : 
                                           typeof value === 'string' && value.length > 50 ? 
                                           value.substring(0, 50) + '...' : value;
                        console.log(`      ${key}: ${displayValue}`);
                    });
                    console.log('');
                });
            }
            console.log('='.repeat(80));
        }

        // JSON 파일로 저장
        const outputPath = path.join(__dirname, 'mysql-data-export.json');
        fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2), 'utf8');
        console.log(`\n💾 데이터가 JSON 파일로 저장되었습니다: ${outputPath}\n`);

        console.log('✅ 데이터 조회 완료!');
        
    } catch (error) {
        console.error('❌ 조회 오류:', error);
        console.error('상세 오류:', error.stack);
        process.exit(1);
    } finally {
        await models.sequelize.close();
        console.log('\n🔌 데이터베이스 연결 종료');
    }
}

viewAllData();

