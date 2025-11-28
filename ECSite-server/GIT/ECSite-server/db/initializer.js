'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

// Sequelizeインスタンス作成
const sequelize = config.url
    ? new Sequelize(config.url, config)
    : new Sequelize(config.database, config.username, config.password, config);

const db = { sequelize, Sequelize };

// モデル作成順序を定義（依存関係に基づく）
// 1. 独立したモデル（依存なし）
// 2. Category（自己参照のみ）
// 3. Product（Categoryに依存）
// 4. その他のモデル（Productに依存）
const modelLoadOrder = [
    'user',        // User - 依存なし (다른 테이블들이 참조)
    'banner',      // Banner - 依存なし
    'category',    // Category - 自己参照のみ
    'subcategory', // SubCategory - Categoryに依存
    'tag',         // Tag - 依存なし
    'product',     // Product - Categoryに依存
    'stats',       // Stats - Productに依存
    'synergy',     // Synergy - Productに依存
    'favorite',    // ProductFavorite - Product, Category에依存
    'review',      // ProductReview - Productに依存
    'teamcomposition', // TeamComposition - user_idに依存 (usersテーブル)
    'teammember',  // TeamMember - TeamComposition, Product, Categoryに依存
    'usermailsetting', // UserMailSetting - user_idに依存 (usersテーブル)
    'coupon',      // Coupon - 依存なし
    'order',       // Order - user_idに依存 (usersテーブル)
    'orderitem',   // OrderItem - Order, Product에依存
    'ordercoupon', // OrderCoupon - Order, User, Coupon에依存
];

// モデルファイルを検索する関数
function findModelFile(featureDir, featureName) {
    if (!fs.existsSync(featureDir) || !fs.statSync(featureDir).isDirectory()) {
        return null;
    }

    const files = fs.readdirSync(featureDir);
    // 大文字小文字を考慮したファイル名の検索
    const possibleNames = [
        `${featureName}Model.js`,
        `${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Model.js`,
        `${featureName.toLowerCase()}Model.js`,
    ];

    // まず、ルートディレクトリで定義された名前で検索
    for (const name of possibleNames) {
        const testPath = path.join(featureDir, name);
        if (fs.existsSync(testPath)) {
            return testPath;
        }
    }

    // modelsサブディレクトリを確認
    const modelsSubDir = path.join(featureDir, 'models');
    if (fs.existsSync(modelsSubDir) && fs.statSync(modelsSubDir).isDirectory()) {
        for (const name of possibleNames) {
            const testPath = path.join(modelsSubDir, name);
            if (fs.existsSync(testPath)) {
                return testPath;
            }
        }

        // modelsサブディレクトリ内のファイルからmodelを含むファイルを検索
        const modelsFiles = fs.readdirSync(modelsSubDir);
        const modelFile = modelsFiles.find(f =>
            f.toLowerCase().includes('model') &&
            f.endsWith('.js') &&
            !f.includes('Controller') &&
            !f.includes('Service') &&
            !f.includes('Routes')
        );

        if (modelFile) {
            return path.join(modelsSubDir, modelFile);
        }
    }

    // 見つからない場合、ルートディレクトリ内のすべてのファイルからmodelを含むファイルを検索
    const modelFile = files.find(f =>
        f.toLowerCase().includes('model') &&
        f.endsWith('.js') &&
        !f.includes('Controller') &&
        !f.includes('Service') &&
        !f.includes('Routes')
    );

    if (modelFile) {
        return path.join(featureDir, modelFile);
    }

    return null;
}

// モデルを順序通りに読み込み
const modelsDir = path.join(__dirname, '../features');
modelLoadOrder.forEach((feature) => {
    const featurePath = path.join(modelsDir, feature);
    const modelPath = findModelFile(featurePath, feature);
    
    if (modelPath) {
        try {
            const model = require(modelPath)(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
            console.log(`✓ モデル ${model.name} を読み込みました`);
        } catch (error) {
            console.error(`✗ モデル ${feature} の読み込みに失敗しました:`, error.message);
        }
    } else {
        console.warn(`⚠ モデルファイルが見つかりません: ${feature}`);
    }
});

// モデル間の関連付けを定義
Object.keys(db).forEach(modelName => {
    if (db[modelName] && typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
    }
});

// 外部キー制約を無効にしてからテーブルを作成し、その後有効化する関数
async function syncDatabase(options = {}) {
    const { force = false, alter = false } = options;
    
    try {
        // 外部キーチェックを一時的に無効化（MySQLのみ）
        if (sequelize.getDialect() === 'mysql') {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        }
        
        // モデルを依存関係の順序で同期
        // 1. User（他のテーブルが参照するため最初に同期）
        if (db.User) {
            await db.User.sync({ force, alter });
            console.log('✓ User テーブルを同期しました');
        }
        
        // 2. 独立したモデル（依存なし）
        const independentModels = ['Banner', 'Tag', 'Coupon'];
        for (const modelName of independentModels) {
            if (db[modelName]) {
                await db[modelName].sync({ force, alter });
                console.log(`✓ ${modelName} テーブルを同期しました`);
            }
        }
        
        // 3. Category（自己参照のみ）
        if (db.Category) {
            await db.Category.sync({ force, alter });
            console.log('✓ Category テーブルを同期しました');
        }
        
        // 3-1. SubCategory（Categoryに依存）
        if (db.SubCategory) {
            await db.SubCategory.sync({ force, alter });
            console.log('✓ SubCategory テーブルを同期しました');
        }
        
        // 4. Product（Categoryに依存）
        if (db.Product) {
            await db.Product.sync({ force, alter });
            console.log('✓ Product テーブルを同期しました');
        }

        // 5. 中間テーブル（ProductTags）を同期
        // belongsToManyで自動作成される中間テーブルを明示的に同期
        if (sequelize.models.ProductTags) {
            await sequelize.models.ProductTags.sync({ force, alter });
            console.log('✓ ProductTags テーブルを同期しました');
        }

        // 6. Productに依存するモデル
        const productDependentModels = ['Stats', 'Synergy', 'ProductFavorite', 'ProductReview'];
        for (const modelName of productDependentModels) {
            if (db[modelName]) {
                // Stats 테이블의 경우 기존 외래 키 제약 조건을 먼저 삭제
                if (modelName === 'Stats' && sequelize.getDialect() === 'mysql') {
                    try {
                        // 테이블이 존재하는지 확인
                        const [tables] = await sequelize.query(`
                            SELECT TABLE_NAME 
                            FROM information_schema.TABLES 
                            WHERE TABLE_SCHEMA = DATABASE() 
                            AND TABLE_NAME = 'stats'
                        `);
                        
                        if (tables.length > 0) {
                            console.log('✓ Stats 테이블이 존재합니다. 외래 키 제약 조건을 확인합니다...');
                            
                            // 기존 외래 키 제약 조건 확인 및 삭제
                            const [constraints] = await sequelize.query(`
                                SELECT CONSTRAINT_NAME 
                                FROM information_schema.TABLE_CONSTRAINTS 
                                WHERE TABLE_SCHEMA = DATABASE() 
                                AND TABLE_NAME = 'stats' 
                                AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                            `);
                            
                            console.log(`✓ 발견된 외래 키 제약 조건 수: ${constraints.length}`);
                            
                            for (const constraint of constraints) {
                                try {
                                    console.log(`  - 외래 키 제약 조건 삭제 시도: ${constraint.CONSTRAINT_NAME}`);
                                    await sequelize.query(`
                                        ALTER TABLE \`stats\` DROP FOREIGN KEY \`${constraint.CONSTRAINT_NAME}\`
                                    `);
                                    console.log(`✓ 기존 외래 키 제약 조건 삭제 완료: ${constraint.CONSTRAINT_NAME}`);
                                } catch (dropError) {
                                    // 제약 조건이 이미 삭제된 경우 무시
                                    if (!dropError.message.includes("doesn't exist") && 
                                        !dropError.message.includes("Unknown") &&
                                        !dropError.message.includes("check that column/key exists") &&
                                        !dropError.message.includes("Duplicate")) {
                                        console.warn(`⚠ 외래 키 제약 조건 삭제 중 경고: ${dropError.message}`);
                                    } else {
                                        console.log(`  - 외래 키 제약 조건이 이미 삭제되었거나 존재하지 않음: ${constraint.CONSTRAINT_NAME}`);
                                    }
                                }
                            }
                            
                            // 삭제 후 다시 확인
                            const [remainingConstraints] = await sequelize.query(`
                                SELECT CONSTRAINT_NAME 
                                FROM information_schema.TABLE_CONSTRAINTS 
                                WHERE TABLE_SCHEMA = DATABASE() 
                                AND TABLE_NAME = 'stats' 
                                AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                            `);
                            console.log(`✓ 삭제 후 남은 외래 키 제약 조건 수: ${remainingConstraints.length}`);
                        } else {
                            console.log('✓ Stats 테이블이 존재하지 않습니다. 새로 생성됩니다.');
                        }
                    } catch (error) {
                        // 오류가 발생해도 계속 진행
                        console.warn(`⚠ Stats 테이블 외래 키 확인 중 경고: ${error.message}`);
                    }
                }
                
                // alter: false를 사용하여 테이블이 이미 존재하는 경우 구조 변경을 시도하지 않음
                // 이렇게 하면 CREATE TABLE IF NOT EXISTS가 외래 키를 포함하지 않음
                try {
                    await db[modelName].sync({ force, alter: false });
                } catch (syncError) {
                    // 테이블이 존재하지 않는 경우 alter: true로 재시도
                    if (syncError.message.includes("doesn't exist") || 
                        syncError.message.includes("Duplicate foreign key")) {
                        console.log(`  - 테이블이 존재하지 않거나 외래 키 충돌 발생. alter: true로 재시도...`);
                        // 외래 키를 다시 삭제하고 재시도
                        if (modelName === 'Stats' && sequelize.getDialect() === 'mysql') {
                            try {
                                const [constraints] = await sequelize.query(`
                                    SELECT CONSTRAINT_NAME 
                                    FROM information_schema.TABLE_CONSTRAINTS 
                                    WHERE TABLE_SCHEMA = DATABASE() 
                                    AND TABLE_NAME = 'stats' 
                                    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                                `);
                                for (const constraint of constraints) {
                                    try {
                                        await sequelize.query(`
                                            ALTER TABLE \`stats\` DROP FOREIGN KEY \`${constraint.CONSTRAINT_NAME}\`
                                        `);
                                    } catch (e) {
                                        // 무시
                                    }
                                }
                            } catch (e) {
                                // 무시
                            }
                        }
                        await db[modelName].sync({ force, alter: true });
                    } else {
                        throw syncError;
                    }
                }
                
                // 관계가 정의된 후 외래 키 제약 조건을 수동으로 추가
                if (modelName === 'Stats' && sequelize.getDialect() === 'mysql') {
                    try {
                        // 기존 외래 키 제약 조건 확인
                        const [existingFKs] = await sequelize.query(`
                            SELECT CONSTRAINT_NAME 
                            FROM information_schema.TABLE_CONSTRAINTS 
                            WHERE TABLE_SCHEMA = DATABASE() 
                            AND TABLE_NAME = 'stats' 
                            AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                            AND CONSTRAINT_NAME = 'stats_product_id_fk'
                        `);
                        
                        // 외래 키가 없으면 생성
                        if (existingFKs.length === 0) {
                            await sequelize.query(`
                                ALTER TABLE \`stats\` 
                                ADD CONSTRAINT \`stats_product_id_fk\` 
                                FOREIGN KEY (\`product_id\`) 
                                REFERENCES \`Products\` (\`id\`) 
                                ON DELETE CASCADE 
                                ON UPDATE CASCADE
                            `);
                            console.log(`✓ Stats 외래 키 제약 조건 생성: stats_product_id_fk`);
                        }
                    } catch (fkError) {
                        // 외래 키가 이미 존재하거나 다른 오류인 경우 무시
                        if (!fkError.message.includes("Duplicate") && 
                            !fkError.message.includes("already exists")) {
                            console.warn(`⚠ Stats 외래 키 생성 중 경고: ${fkError.message}`);
                        }
                    }
                }
                
                console.log(`✓ ${modelName} テーブルを同期しました`);
            }
        }
        
        // 7. TeamComposition（usersに依存）
        if (db.TeamComposition) {
            await db.TeamComposition.sync({ force, alter });
            console.log('✓ TeamComposition テーブルを同期しました');
        }
        
        // 8. TeamMember（TeamComposition, Product, Categoryに依存）
        if (db.TeamMember) {
            await db.TeamMember.sync({ force, alter });
            console.log('✓ TeamMember テーブルを同期しました');
        }
        
        // 9. UserMailSetting（usersに依存）
        if (db.UserMailSetting) {
            await db.UserMailSetting.sync({ force, alter });
            console.log('✓ UserMailSetting テーブルを同期しました');
        }
        
        // 10. Order（usersに依存）
        if (db.Order) {
            await db.Order.sync({ force, alter });
            console.log('✓ Order テーブルを同期しました');
        }
        
        // 10-1. OrderItem（Order, Productに依存）
        if (db.OrderItem) {
            await db.OrderItem.sync({ force, alter });
            console.log('✓ OrderItem テーブルを同期しました');
        }
        
        // 11. OrderCoupon（Order, User, Couponに依存）
        if (db.OrderCoupon) {
            await db.OrderCoupon.sync({ force, alter });
            console.log('✓ OrderCoupon テーブルを同期しました');
        }
        
        // 外部キーチェックを再有効化
        if (sequelize.getDialect() === 'mysql') {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        }
        
        console.log('✓ データベース同期が完了しました');
    } catch (error) {
        // エラーが発生しても外部キーチェックを再有効化
        if (sequelize.getDialect() === 'mysql') {
            try {
                await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            } catch (e) {
                console.error('✗ 外部キーチェックの再有効化に失敗しました:', e);
            }
        }
        console.error('✗ データベース同期中にエラーが発生しました:', error);
        throw error;
    }
}

// カスタムsyncメソッドを追加
db.sync = syncDatabase;

module.exports = db;
