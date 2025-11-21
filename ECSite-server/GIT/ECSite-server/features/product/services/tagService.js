const models = require("../../../db/initializer");

// タグ別商品一覧
exports.getProductsByTag = async (tagId, options = {}) => {
    const {
        page = 1,
        limit = 20
    } = options;

    const tag = await models.Tag.findByPk(tagId);
    if (!tag) {
        return { products: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    }

    const offset = (page - 1) * parseInt(limit);

    const products = await models.sequelize.query(
        `SELECT
            p.*,
            c.name_ja as category_name,
            sc.name as subcategory_name
         FROM Products p
         INNER JOIN ProductTags pt ON p.id = pt.product_id
         LEFT JOIN Categories c ON p.category_id = c.id
         LEFT JOIN Categories sc ON p.sub_category_id = sc.id
         WHERE pt.tag_id = :tagId
         ORDER BY p.createdAt DESC
         LIMIT :limit OFFSET :offset`,
        {
            replacements: { tagId, limit: parseInt(limit), offset },
            type: models.sequelize.QueryTypes.SELECT
        }
    ).catch(() => []);

    const countResult = await models.sequelize.query(
        `SELECT COUNT(*) as count
         FROM Products p
         INNER JOIN ProductTags pt ON p.id = pt.product_id
         WHERE pt.tag_id = :tagId`,
        {
            replacements: { tagId },
            type: models.sequelize.QueryTypes.SELECT
        }
    ).catch(() => [{ count: 0 }]);

    const total = parseInt(countResult[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);

    return {
        products: products.map(p => ({
            ...p,
            category_name: p.category_name || null,
            subcategory_name: p.subcategory_name || null
        })),
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages
        }
    };
};
