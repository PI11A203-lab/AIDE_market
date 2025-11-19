// db/seed.js - データベースに初期データを挿入するスクリプト
require('dotenv').config();
const { Op } = require('sequelize');
const models = require('./initializer');

async function seedDatabase() {
    try {
        console.log('🌱 データベースシードを開始します...\n');

        // データベース接続を確認
        await models.sequelize.authenticate();
        console.log('✓ データベース接続に成功しました\n');

        // 1. Categories（カテゴリ）のシード
        if (models.Category) {
            console.log('📁 Categoriesテーブルにデータを挿入中...');
            const categories = await models.Category.bulkCreate([
                {
                    name: 'frontend',
                    name_ja: 'フロントエンド',
                    description: 'ユーザーインターフェース開発AI',
                    parentId: null
                },
                {
                    name: 'backend',
                    name_ja: 'バックエンド',
                    description: 'サーバーサイド開発AI',
                    parentId: null
                },
                {
                    name: 'image',
                    name_ja: 'イメージ生成',
                    description: 'AI画像・デザイン生成',
                    parentId: null
                },
                {
                    name: 'management',
                    name_ja: '設計・マネジメント',
                    description: 'プロジェクト管理・設計AI',
                    parentId: null
                },
                {
                    name: 'infrastructure',
                    name_ja: 'インフラ',
                    description: 'クラウド・インフラ管理AI',
                    parentId: null
                },
                {
                    name: 'security',
                    name_ja: 'セキュリティ',
                    description: 'セキュリティ・監査AI',
                    parentId: null
                },
                {
                    name: 'documents',
                    name_ja: 'ドキュメント作業',
                    description: 'ドキュメント・オフィス作業AI',
                    parentId: null
                }
            ], { ignoreDuplicates: true });
            console.log(`✓ ${categories.length}件のカテゴリを確認/挿入しました\n`);
        }

        // 2. 既存の「伝説」データを削除
        if (models.Product) {
            console.log('🗑️ 「伝説」を含む商品を削除中...');
            const deletedCount = await models.Product.destroy({
                where: {
                    [Op.or]: [
                        { id: { [Op.in]: [1, 2] } },
                        { name: { [Op.like]: '%伝説%' } }
                    ]
                }
            });
            console.log(`✓ ${deletedCount}件の商品を削除しました\n`);
        }

        // 3. Products（商品）のシード - 各カテゴリに2個ずつ（計14個）
        if (models.Product) {
            console.log('🛍️ Productsテーブルにデータを挿入中...');
            
            const products = await models.Product.bulkCreate([
                // フロントエンド +2 (category_id: 1)
                {
                    name: 'RemixPro',
                    price: 27000,
                    seller: '岡本健二',
                    description: 'Remix開発の専門家。フルスタックフレームワークで高速なWebアプリを構築します。',
                    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
                    soldout: 0,
                    category_id: 1,
                    sub_category_id: null,
                    download_count: 1380,
                    view_count: 3600,
                    rating_average: 4.8,
                    rating_count: 95,
                    tech_stack: 'Remix, React'
                },
                {
                    name: 'SolidWave',
                    price: 24000,
                    seller: '高木真央',
                    description: 'SolidJS開発のスペシャリスト。リアクティブで高性能なアプリケーションを作成します。',
                    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                    soldout: 0,
                    category_id: 1,
                    sub_category_id: null,
                    download_count: 1180,
                    view_count: 3100,
                    rating_average: 4.7,
                    rating_count: 82,
                    tech_stack: 'SolidJS'
                },
                // バックエンド +2 (category_id: 2)
                {
                    name: 'NestMaster',
                    price: 27000,
                    seller: '村田翔太',
                    description: 'NestJS開発のエキスパート。TypeScriptベースの堅牢なバックエンドを構築します。',
                    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400',
                    soldout: 0,
                    category_id: 2,
                    sub_category_id: null,
                    download_count: 1420,
                    view_count: 3700,
                    rating_average: 4.9,
                    rating_count: 98,
                    tech_stack: 'NestJS, TypeScript'
                },
                {
                    name: 'FastAPI Pro',
                    price: 25000,
                    seller: '山本彩花',
                    description: 'FastAPI開発の専門家。非同期処理で高速なAPIを実装します。',
                    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
                    soldout: 0,
                    category_id: 2,
                    sub_category_id: null,
                    download_count: 1320,
                    view_count: 3400,
                    rating_average: 4.8,
                    rating_count: 88,
                    tech_stack: 'FastAPI, Python'
                },
                // イメージ生成 +2 (category_id: 3)
                {
                    name: 'MidjourneyAI',
                    price: 32000,
                    seller: '佐野光一',
                    description: 'Midjourney専門家。プロンプトエンジニアリングで最高品質の画像を生成します。',
                    imageUrl: 'https://images.unsplash.com/photo-1547954575-855750c57bd3?w=400',
                    soldout: 0,
                    category_id: 3,
                    sub_category_id: null,
                    download_count: 1720,
                    view_count: 4400,
                    rating_average: 4.9,
                    rating_count: 118,
                    tech_stack: 'Midjourney, AI'
                },
                {
                    name: 'DALLEMaster',
                    price: 31000,
                    seller: '片岡美里',
                    description: 'DALL-E開発の専門家。創造的な画像生成とスタイル転送が得意です。',
                    imageUrl: 'https://images.unsplash.com/photo-1535982337050-f99af7ee6e13?w=400',
                    soldout: 0,
                    category_id: 3,
                    sub_category_id: null,
                    download_count: 1650,
                    view_count: 4200,
                    rating_average: 4.8,
                    rating_count: 108,
                    tech_stack: 'DALL-E, AI'
                },
                // 設計・マネジメント +2 (category_id: 4)
                {
                    name: 'DevOpsGuru',
                    price: 29000,
                    seller: '石田大地',
                    description: 'DevOps専門家。開発と運用を統合し、デリバリー速度を向上させます。',
                    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
                    soldout: 0,
                    category_id: 4,
                    sub_category_id: null,
                    download_count: 1380,
                    view_count: 3600,
                    rating_average: 4.8,
                    rating_count: 92,
                    tech_stack: 'DevOps, CI/CD'
                },
                {
                    name: 'DataArchitect',
                    price: 31000,
                    seller: '森川由美',
                    description: 'データアーキテクト専門家。データモデリングと最適化を実現します。',
                    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
                    soldout: 0,
                    category_id: 4,
                    sub_category_id: null,
                    download_count: 1450,
                    view_count: 3800,
                    rating_average: 4.9,
                    rating_count: 98,
                    tech_stack: 'Data Architecture'
                },
                // インフラ +2 (category_id: 5)
                {
                    name: 'VercelPro',
                    price: 25000,
                    seller: '田村洋平',
                    description: 'Vercel専門家。フロントエンドデプロイを最適化し、高速配信を実現します。',
                    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
                    soldout: 0,
                    category_id: 5,
                    sub_category_id: null,
                    download_count: 1420,
                    view_count: 3700,
                    rating_average: 4.8,
                    rating_count: 95,
                    tech_stack: 'Vercel, Next.js'
                },
                {
                    name: 'NetlifyMaster',
                    price: 24000,
                    seller: '中野智子',
                    description: 'Netlify専門家。JAMstack構成で高速なWebサイトを構築します。',
                    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
                    soldout: 0,
                    category_id: 5,
                    sub_category_id: null,
                    download_count: 1320,
                    view_count: 3400,
                    rating_average: 4.7,
                    rating_count: 88,
                    tech_stack: 'Netlify, JAMstack'
                },
                // セキュリティ +2 (category_id: 6)
                {
                    name: 'ZeroTrust',
                    price: 29000,
                    seller: '井川剛志',
                    description: 'ゼロトラストセキュリティの専門家。最新のセキュリティモデルを実装します。',
                    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
                    soldout: 0,
                    category_id: 6,
                    sub_category_id: null,
                    download_count: 1420,
                    view_count: 3700,
                    rating_average: 4.9,
                    rating_count: 98,
                    tech_stack: 'Zero Trust, Security'
                },
                {
                    name: 'ThreatHunter',
                    price: 30000,
                    seller: '橋爪亜美',
                    description: '脅威ハンティングの専門家。未知の脅威を事前に発見し対策します。',
                    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
                    soldout: 0,
                    category_id: 6,
                    sub_category_id: null,
                    download_count: 1480,
                    view_count: 3800,
                    rating_average: 4.9,
                    rating_count: 102,
                    tech_stack: 'Threat Hunting, Security'
                },
                // ドキュメント作業 +2 (category_id: 7)
                {
                    name: 'FigmaDoc',
                    price: 26000,
                    seller: '吉村真司',
                    description: 'Figmaドキュメント専門家。デザインシステムと仕様書を統合管理します。',
                    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
                    soldout: 0,
                    category_id: 7,
                    sub_category_id: null,
                    download_count: 1420,
                    view_count: 3700,
                    rating_average: 4.8,
                    rating_count: 95,
                    tech_stack: 'Figma, Design System'
                },
                {
                    name: 'SwaggerPro',
                    price: 27000,
                    seller: '久保田香織',
                    description: 'Swagger/OpenAPI専門家。自動生成されたAPI仕様書を美しく整理します。',
                    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
                    soldout: 0,
                    category_id: 7,
                    sub_category_id: null,
                    download_count: 1450,
                    view_count: 3800,
                    rating_average: 4.9,
                    rating_count: 98,
                    tech_stack: 'Swagger, OpenAPI'
                }
            ], { ignoreDuplicates: true });
            console.log(`✓ ${products.length}件の商品を挿入しました\n`);

            // 4. Stats（統計）のシード（Productsに依存）
            if (models.Stats && products.length > 0) {
                console.log('📊 Statsテーブルにデータを挿入中...');
                const statsData = products.map((product, index) => ({
                    product_id: product.id,
                    teamwork: 70 + (index % 3) * 10,
                    stability: 75 + (index % 3) * 5,
                    speed: 80 + (index % 3) * 5,
                    creativity: 85 + (index % 3) * 5,
                    productivity: 85 + (index % 3) * 5,
                    maintainability: 70 + (index % 3) * 10
                }));
                
                const stats = await models.Stats.bulkCreate(statsData, { ignoreDuplicates: true });
                console.log(`✓ ${stats.length}件の統計データを挿入しました\n`);
            }

            // 5. カテゴリ別の商品数を表示
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
        }

        // 6. Banners（バナー）のシード
        if (models.Banner) {
            console.log('🖼️ Bannersテーブルにデータを挿入中...');
            const banners = await models.Banner.bulkCreate([
                {
                    imageUrl: 'uploads/banners/banner1.png',
                    href: '/products/1'
                },
                {
                    imageUrl: 'uploads/banners/banner2.png',
                    href: '/products/2'
                }
            ], { ignoreDuplicates: true });
            console.log(`✓ ${banners.length}件のバナーを挿入しました\n`);
        }

        // 7. 完了確認
        if (models.Product) {
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
    seedDatabase();
}

module.exports = seedDatabase;

