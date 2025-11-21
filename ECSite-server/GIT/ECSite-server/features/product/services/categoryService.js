const models = require("../../../db/initializer");
const productService = require("./productService");

// カテゴリ別商品一覧
exports.getProductsByCategory = async (categoryId, options = {}) => {
    const {
        subcategory,
        page = 1,
        limit = 20,
        sort = 'download'
    } = options;

    return productService.findAllProducts({
        ...options,
        category: categoryId,
        subcategory,
        page,
        limit,
        sort
    });
};

// カテゴリ別代表商品取得 (メインページ用)
exports.getFeaturedProductsByCategory = async (categoryId, limit = 4) => {
    const products = await models.sequelize.query(
        `SELECT
            p.id,
            p.name,
            p.price,
            p.seller,
            p.imageUrl,
            p.soldout,
            p.download_count,
            p.view_count,
            p.rating_average,
            p.rating_count,
            c.name_ja as category_name,
            sc.name as subcategory_name
         FROM Products p
         LEFT JOIN Categories c ON p.category_id = c.id
         LEFT JOIN Categories sc ON p.sub_category_id = sc.id
         WHERE p.category_id = :categoryId AND p.soldout = 0
         ORDER BY p.download_count DESC, p.rating_average DESC
         LIMIT :limit`,
        {
            replacements: { categoryId, limit: parseInt(limit) },
            type: models.sequelize.QueryTypes.SELECT
        }
    );

    return products.map(p => ({
        ...p,
        category_name: p.category_name || null,
        subcategory_name: p.subcategory_name || null
    }));
};
