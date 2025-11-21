const models = require("../../../db/initializer");

// 商品詳細情報 (stats + tags + synergies 含む)
exports.findProductById = async (id) => {
    const productResult = await models.sequelize.query(
        `SELECT
            p.*,
            c.name_ja as category_name,
            sc.name as subcategory_name
         FROM Products p
         LEFT JOIN Categories c ON p.category_id = c.id
         LEFT JOIN Categories sc ON p.sub_category_id = sc.id
         WHERE p.id = :id`,
        {
            replacements: { id },
            type: models.sequelize.QueryTypes.SELECT
        }
    );

    if (!productResult || productResult.length === 0) {
        return null;
    }

    const product = productResult[0];

    const [stats, tags, synergies] = await Promise.all([
        models.Stats.findOne({ where: { product_id: id } }),
        models.sequelize.query(
            `SELECT t.id, t.name, t.created_at
             FROM Tags t
             INNER JOIN ProductTags pt ON t.id = pt.tag_id
             WHERE pt.product_id = :id`,
            {
                replacements: { id },
                type: models.sequelize.QueryTypes.SELECT
            }
        ).catch(() => []),
        models.sequelize.query(
            `SELECT
                s.id,
                s.synergy_score,
                s.synergy_description,
                p.id as related_id,
                p.name,
                p.price,
                p.seller,
                p.imageUrl,
                p.rating_average,
                p.rating_count
             FROM Synergies s
             INNER JOIN Products p ON s.related_product_id = p.id
             WHERE s.product_id = :id
             ORDER BY s.synergy_score DESC
             LIMIT 5`,
            {
                replacements: { id },
                type: models.sequelize.QueryTypes.SELECT
            }
        ).catch(() => [])
    ]);

    return {
        product: {
            ...product,
            category_name: product.category_name || null,
            subcategory_name: product.subcategory_name || null
        },
        stats: stats ? stats.toJSON() : null,
        tags: tags || [],
        synergies: (synergies || []).map(s => ({
            id: s.related_id,
            name: s.name,
            price: s.price,
            seller: s.seller,
            imageUrl: s.imageUrl,
            rating_average: s.rating_average,
            rating_count: s.rating_count,
            synergy_score: s.synergy_score,
            synergy_description: s.synergy_description
        }))
    };
};

// 商品統計取得
exports.getProductStats = async (id) => {
    const stats = await models.Stats.findOne({ where: { product_id: id } });
    return stats ? stats.toJSON() : null;
};

// 商品シナジー取得
exports.getProductSynergies = async (id, limit = 5) => {
    const synergies = await models.sequelize.query(
        `SELECT
            s.id,
            s.synergy_score,
            s.synergy_description,
            p.id,
            p.name,
            p.price,
            p.seller,
            p.description,
            p.imageUrl,
            p.download_count,
            p.view_count,
            p.rating_average,
            p.rating_count
         FROM Synergies s
         INNER JOIN Products p ON s.related_product_id = p.id
         WHERE s.product_id = :id
         ORDER BY s.synergy_score DESC
         LIMIT :limit`,
        {
            replacements: { id, limit: parseInt(limit) },
            type: models.sequelize.QueryTypes.SELECT
        }
    ).catch(() => []);

    return synergies.map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        seller: s.seller,
        description: s.description,
        imageUrl: s.imageUrl,
        download_count: s.download_count,
        view_count: s.view_count,
        rating_average: s.rating_average,
        rating_count: s.rating_count,
        synergy_score: s.synergy_score,
        synergy_description: s.synergy_description
    }));
};

// 商品購入 (品切れ処理)
exports.markAsSoldOut = async (id) => {
    return await models.Product.update({ soldout: 1 }, { where: { id } });
};
