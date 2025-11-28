const models = require("../../../db/initializer");

// 상품에 태그 추가
exports.addTagToProduct = async (productId, tagId) => {
    // 상품 존재 확인
    const product = await models.Product.findByPk(productId);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    // 태그 존재 확인
    const tag = await models.Tag.findByPk(tagId);
    if (!tag) {
        throw new Error('태그를 찾을 수 없습니다');
    }
    
    // 이미 연결되어 있는지 확인
    const existing = await models.sequelize.query(
        `SELECT id FROM product_tags WHERE product_id = :productId AND tag_id = :tagId`,
        {
            replacements: { productId, tagId },
            type: models.sequelize.QueryTypes.SELECT
        }
    );
    
    if (existing && existing.length > 0) {
        throw new Error('이미 해당 태그가 연결되어 있습니다');
    }
    
    // 태그 추가
    await models.sequelize.query(
        `INSERT INTO product_tags (product_id, tag_id, created_at) VALUES (:productId, :tagId, NOW())`,
        {
            replacements: { productId, tagId },
            type: models.sequelize.QueryTypes.INSERT
        }
    );
    
    return true;
};

// 상품에서 태그 제거
exports.removeTagFromProduct = async (productId, tagId) => {
    // 연결 확인
    const existing = await models.sequelize.query(
        `SELECT id FROM product_tags WHERE product_id = :productId AND tag_id = :tagId`,
        {
            replacements: { productId, tagId },
            type: models.sequelize.QueryTypes.SELECT
        }
    );
    
    if (!existing || existing.length === 0) {
        throw new Error('연결된 태그를 찾을 수 없습니다');
    }
    
    // 태그 제거
    await models.sequelize.query(
        `DELETE FROM product_tags WHERE product_id = :productId AND tag_id = :tagId`,
        {
            replacements: { productId, tagId },
            type: models.sequelize.QueryTypes.DELETE
        }
    );
    
    return true;
};

// 상품의 태그 목록 조회
exports.getTagsByProductId = async (productId) => {
    const tags = await models.sequelize.query(
        `SELECT t.id, t.name, t.created_at, pt.created_at as linked_at
         FROM Tags t
         INNER JOIN product_tags pt ON t.id = pt.tag_id
         WHERE pt.product_id = :productId
         ORDER BY pt.created_at DESC`,
        {
            replacements: { productId },
            type: models.sequelize.QueryTypes.SELECT
        }
    );
    
    return tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        created_at: tag.created_at,
        linked_at: tag.linked_at
    }));
};

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
         INNER JOIN product_tags pt ON p.id = pt.product_id
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
         INNER JOIN product_tags pt ON p.id = pt.product_id
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
