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
    'banner',      // Banner - 依存なし
    'category',    // Category - 自己参照のみ
    'tag',         // Tag - 依存なし
    'product',     // Product - Categoryに依存
    'stats',       // Stats - Productに依存
    'synergy',     // Synergy - Productに依存
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
        // 1. 独立したモデル（依存なし）
        const independentModels = ['Banner', 'Tag'];
        for (const modelName of independentModels) {
            if (db[modelName]) {
                await db[modelName].sync({ force, alter });
                console.log(`✓ ${modelName} テーブルを同期しました`);
            }
        }
        
        // 2. Category（自己参照のみ）
        if (db.Category) {
            await db.Category.sync({ force, alter });
            console.log('✓ Category テーブルを同期しました');
        }
        
        // 3. Product（Categoryに依存）
        if (db.Product) {
            await db.Product.sync({ force, alter });
            console.log('✓ Product テーブルを同期しました');
        }

        // 4. 中間テーブル（ProductTags）を同期
        // belongsToManyで自動作成される中間テーブルを明示的に同期
        if (sequelize.models.ProductTags) {
            await sequelize.models.ProductTags.sync({ force, alter });
            console.log('✓ ProductTags テーブルを同期しました');
        }

        // 5. Productに依存するモデル
        const productDependentModels = ['Stats', 'Synergy'];
        for (const modelName of productDependentModels) {
            if (db[modelName]) {
                await db[modelName].sync({ force, alter });
                console.log(`✓ ${modelName} テーブルを同期しました`);
            }
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
