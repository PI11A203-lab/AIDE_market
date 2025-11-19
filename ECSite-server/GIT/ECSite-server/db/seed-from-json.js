// db/seed-from-json.js - JSONファイルからデータベースに初期データを挿入するスクリプト
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const models = require('./initializer');

async function seedFromJson() {
    try {
        console.log('🌱 JSONファイルからデータベースシードを開始します...\n');

        // データベース接続を確認
        await models.sequelize.authenticate();
        console.log('✓ データベース接続に成功しました\n');

        // JSONファイルを読み込む
        const jsonPath = path.join(__dirname, '../app/mysql-data-export.json');
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`JSONファイルが見つかりません: ${jsonPath}`);
        }

        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log('✓ JSONファイルを読み込みました\n');

        // 1. Categories（カテゴリ）のシード
        if (models.Category && jsonData.categories) {
            console.log('📁 Categoriesテーブルにデータを挿入中...');
            const categoryData = jsonData.categories.map(cat => ({
                name: cat.name,
                name_ja: cat.name_ja,
                description: cat.description || null,
                parentId: cat.parentId || null,
                category_id: cat.category_id || null,
                tech_stack: cat.tech_stack || null
            }));

            const categories = await models.Category.bulkCreate(categoryData, { 
                ignoreDuplicates: true,
                updateOnDuplicate: ['name_ja', 'description', 'parentId', 'category_id', 'tech_stack']
            });
            console.log(`✓ ${categories.length}件のカテゴリを確認/挿入しました\n`);
        }

        // 2. SubCategories（サブカテゴリ）のシード（Productsより先に挿入）
        if (models.Category && jsonData.sub_categories) {
            console.log('📂 SubCategoriesテーブルにデータを挿入中...');
            const subCategoryData = jsonData.sub_categories.map(subcat => ({
                name: subcat.name,
                name_ja: subcat.name_ja || null,
                description: subcat.description || null,
                parentId: subcat.category_id || null, // 親カテゴリID
                tech_stack: subcat.tech_stack || null
            }));
            const subCategories = await models.Category.bulkCreate(subCategoryData, { 
                ignoreDuplicates: true,
                updateOnDuplicate: ['name_ja', 'description', 'parentId', 'tech_stack']
            });
            console.log(`✓ ${subCategories.length}件のサブカテゴリを確認/挿入しました\n`);
        }

        // 3. Tags（タグ）のシード
        if (models.Tag && jsonData.tags) {
            console.log('🏷️ Tagsテーブルにデータを挿入中...');
            const tagData = jsonData.tags.map(tag => ({
                name: tag.name,
                description: tag.description || null
            }));

            const tags = await models.Tag.bulkCreate(tagData, { ignoreDuplicates: true });
            console.log(`✓ ${tags.length}件のタグを挿入しました\n`);
        }

        // 3. 既存の商品データを削除（オプション）
        if (models.Product) {
            console.log('🗑️ 既存の商品データを削除中...');
            
            // 外部キーチェックを一時的に無効化（MySQLのみ）
            if (models.sequelize.getDialect() === 'mysql') {
                await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            }
            
            try {
                // Statsテーブルを先に削除
                if (models.Stats) {
                    await models.Stats.destroy({ where: {}, truncate: true });
                }
                
                // Productsテーブルを削除
                const deletedCount = await models.Product.destroy({
                    where: {},
                    truncate: true
                });
                console.log(`✓ 既存の商品データを削除しました\n`);
            } finally {
                // 外部キーチェックを再有効化
                if (models.sequelize.getDialect() === 'mysql') {
                    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
                }
            }
        }

        // 5. Products（商品）のシード
        if (models.Product && jsonData.products) {
            console.log(`🛍️ Productsテーブルにデータを挿入中... (JSONから${jsonData.products.length}件読み込み)`);
            
            // 存在するサブカテゴリIDを取得
            const existingSubCategories = await models.Category.findAll({
                attributes: ['id'],
                where: {
                    parentId: { [Op.ne]: null }
                }
            });
            const validSubCategoryIds = new Set(existingSubCategories.map(cat => cat.id));
            
            // JSONからidを除外してデータを準備（idは自動生成される）
            const productData = jsonData.products.map(product => {
                // 存在しないsub_category_idはnullに設定
                let subCategoryId = product.sub_category_id || null;
                if (subCategoryId && !validSubCategoryIds.has(subCategoryId)) {
                    subCategoryId = null;
                }
                
                const data = {
                    name: product.name,
                    price: product.price,
                    seller: product.seller,
                    description: product.description,
                    imageUrl: product.imageUrl || null,
                    soldout: product.soldout || 0,
                    category_id: product.category_id || null,
                    sub_category_id: subCategoryId,
                    download_count: product.download_count || 0,
                    view_count: product.view_count || 0,
                    rating_average: product.rating_average ? parseFloat(product.rating_average) : 0,
                    rating_count: product.rating_count || 0,
                    tech_stack: product.tech_stack || null
                };
                // idが含まれている場合は除外（自動生成されるため）
                if (product.id) {
                    delete data.id;
                }
                return data;
            });

            // バッチ処理で挿入（大量データの場合）
            const batchSize = 100;
            let insertedCount = 0;
            let skippedCount = 0;
            let errorCount = 0;
            
            for (let i = 0; i < productData.length; i += batchSize) {
                const batch = productData.slice(i, i + batchSize);
                try {
                    // ignoreDuplicates: true は主キー（id）の重複をチェックする
                    // idを除外しているので、すべてのレコードが挿入されるはず
                    const products = await models.Product.bulkCreate(batch, { 
                        ignoreDuplicates: false, // 重複エラーを確認するためfalseに変更
                        returning: true
                    });
                    insertedCount += products.length;
                    console.log(`  → バッチ ${Math.floor(i / batchSize) + 1}: ${products.length}件挿入 (合計: ${insertedCount}/${productData.length})`);
                } catch (error) {
                    // エラーが発生した場合、個別に挿入を試みる
                    console.warn(`  → バッチ ${Math.floor(i / batchSize) + 1}でエラー: ${error.message}`);
                    console.log(`  → 個別に挿入を試みます...`);
                    
                    for (const item of batch) {
                        try {
                            await models.Product.create(item);
                            insertedCount++;
                        } catch (err) {
                            if (err.name === 'SequelizeUniqueConstraintError' || err.message.includes('Duplicate entry')) {
                                skippedCount++;
                            } else {
                                errorCount++;
                                console.error(`    商品 "${item.name}" の挿入に失敗:`, err.message);
                            }
                        }
                    }
                }
            }
            
            console.log(`✓ ${insertedCount}件の商品を挿入しました`);
            if (skippedCount > 0) {
                console.log(`  (${skippedCount}件スキップ)`);
            }
            if (errorCount > 0) {
                console.log(`  (${errorCount}件エラー)`);
            }
            console.log('');
        }

        // 6. Stats（統計）のシード
        if (models.Stats && jsonData.ai_stats && jsonData.products) {
            console.log('📊 Statsテーブルにデータを挿入中...');
            
            // 既存のStatsは既に削除されているので、ここでは何もしない
            
            // 商品名でマッピングを作成（JSONのproduct_idと実際のDBのIDを対応付ける）
            const products = await models.Product.findAll({ 
                attributes: ['id', 'name'],
                order: [['id', 'ASC']]
            });
            
            // 商品名をキーにしたマッピングを作成
            const productNameMap = new Map();
            products.forEach(product => {
                productNameMap.set(product.name, product.id);
            });
            
            // JSONのproduct_id（元のID）と商品名のマッピング
            const productIdMap = new Map();
            jsonData.products.forEach((product) => {
                // 商品名で実際のDBのIDを取得
                const actualId = productNameMap.get(product.name);
                if (actualId) {
                    productIdMap.set(product.id, actualId);
                }
            });
            
            // JSONのproduct_idを実際のDBのIDにマッピング
            const statsData = [];
            for (const stat of jsonData.ai_stats) {
                const actualProductId = productIdMap.get(stat.product_id);
                if (actualProductId) {
                    statsData.push({
                        product_id: actualProductId,
                        teamwork: stat.teamwork,
                        stability: stat.stability,
                        speed: stat.speed,
                        creativity: stat.creativity,
                        productivity: stat.productivity,
                        maintainability: stat.maintainability
                    });
                }
            }

            const stats = await models.Stats.bulkCreate(statsData, { 
                ignoreDuplicates: true 
            });
            console.log(`✓ ${stats.length}件の統計データを挿入しました\n`);
        }

        // 7. Banners（バナー）のシード
        if (models.Banner && jsonData.banners) {
            console.log('🖼️ Bannersテーブルにデータを挿入中...');
            const bannerData = jsonData.banners.map(banner => ({
                imageUrl: banner.imageUrl,
                href: banner.href || null
            }));

            const banners = await models.Banner.bulkCreate(bannerData, { 
                ignoreDuplicates: true 
            });
            console.log(`✓ ${banners.length}件のバナーを挿入しました\n`);
        }

        // 8. カテゴリ別の商品数を表示
        if (models.Product) {
            console.log('📊 カテゴリ別商品数:');
            const categoryCounts = await models.sequelize.query(`
                SELECT 
                    c.id,
                    c.name,
                    c.name_ja,
                    COUNT(p.id) as product_count
                FROM Categories c
                LEFT JOIN Products p ON c.id = p.category_id
                WHERE c.parentId IS NULL
                GROUP BY c.id, c.name, c.name_ja
                ORDER BY c.id
            `, { type: models.sequelize.QueryTypes.SELECT });
            
            categoryCounts.forEach(cat => {
                console.log(`  - ${cat.name_ja} (${cat.name}): ${cat.product_count}件`);
            });
            console.log('');

            const totalProducts = await models.Product.count();
            console.log(`✅ データベースシードが完了しました！`);
            console.log(`📦 総商品数: ${totalProducts}件\n`);
        }
        
    } catch (error) {
        console.error('❌ シード中にエラーが発生しました:', error);
        console.error('詳細:', error.stack);
        process.exit(1);
    } finally {
        await models.sequelize.close();
        console.log('🔌 データベース接続を閉じました');
    }
}

// スクリプトが直接実行された場合
if (require.main === module) {
    seedFromJson();
}

module.exports = seedFromJson;

