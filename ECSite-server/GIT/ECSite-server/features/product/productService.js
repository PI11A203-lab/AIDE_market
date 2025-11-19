const models = require("../../db/initializer");
const { Op } = require("sequelize");

// 전체 상품 목록 (페이지네이션 + 필터 + 정렬)
exports.findAllProducts = async (options = {}) => {
    const {
        page = 1,
        limit = 20,
        category,
        subcategory,
        search,
        sort = 'download'
    } = options;

    const offset = (page - 1) * limit;
    
    // 필터 조건
    const where = {};
    if (category) {
        where.category_id = category;
    }
    if (subcategory) {
        where.sub_category_id = subcategory;
    }
    if (search) {
        where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    // 정렬 옵션
    let order = [];
    switch (sort) {
        case 'rating':
            order = [['rating_average', 'DESC'], ['rating_count', 'DESC']];
            break;
        case 'price':
            order = [['price', 'ASC']];
            break;
        case 'priceDesc':
            order = [['price', 'DESC']];
            break;
        case 'download':
        default:
            order = [['download_count', 'DESC']];
            break;
    }

    // WHERE 절 빌드
    const whereConditions = [];
    const replacements = {
        limit: parseInt(limit),
        offset: parseInt(offset)
    };
    
    if (where.category_id) {
        whereConditions.push('p.category_id = :category_id');
        replacements.category_id = where.category_id;
    }
    if (where.sub_category_id) {
        whereConditions.push('p.sub_category_id = :sub_category_id');
        replacements.sub_category_id = where.sub_category_id;
    }
    if (search) {
        whereConditions.push('(p.name LIKE :search OR p.description LIKE :search)');
        replacements.search = `%${search}%`;
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // ORDER BY 절 빌드
    let orderClause = 'p.createdAt DESC';
    if (order.length > 0) {
        orderClause = order.map(([field, direction]) => {
            if (field === 'rating_average') return `p.rating_average ${direction}`;
            if (field === 'rating_count') return `p.rating_count ${direction}`;
            if (field === 'price') return `p.price ${direction}`;
            if (field === 'download_count') return `p.download_count ${direction}`;
            return `p.createdAt DESC`;
        }).join(', ');
    }

    // 관계가 정의되지 않았을 수 있으므로 직접 조인 사용
    const products = await models.sequelize.query(
        `SELECT 
            p.*,
            c.name_ja as category_name,
            sc.name as subcategory_name
         FROM Products p
         LEFT JOIN Categories c ON p.category_id = c.id
         LEFT JOIN Categories sc ON p.sub_category_id = sc.id
         ${whereClause}
         ORDER BY ${orderClause}
         LIMIT :limit OFFSET :offset`,
        {
            replacements,
            type: models.sequelize.QueryTypes.SELECT
        }
    );

    const countReplacements = {};
    if (where.category_id) countReplacements.category_id = where.category_id;
    if (where.sub_category_id) countReplacements.sub_category_id = where.sub_category_id;
    if (search) countReplacements.search = `%${search}%`;

    const countResult = await models.sequelize.query(
        `SELECT COUNT(*) as count FROM Products p
         ${whereClause}`,
        {
            replacements: countReplacements,
            type: models.sequelize.QueryTypes.SELECT
        }
    );

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

// 상품 상세 정보 (stats + tags + synergies 포함)
exports.findProductById = async (id) => {
    // 직접 조인 사용 (관계가 정의되지 않았을 수 있음)
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
        // 태그 조회 (ProductTags 중간 테이블 사용)
        models.sequelize.query(
            `SELECT t.id, t.name, t.created_at
             FROM Tags t
             INNER JOIN ProductTags pt ON t.id = pt.tag_id
             WHERE pt.product_id = :id`,
            {
                replacements: { id },
                type: models.sequelize.QueryTypes.SELECT
            }
        ).catch(() => []), // 테이블이 없으면 빈 배열 반환
        // 시너지 조회
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
        ).catch(() => []) // 테이블이 없으면 빈 배열 반환
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

// 상품 통계 조회
exports.getProductStats = async (id) => {
    const stats = await models.Stats.findOne({ where: { product_id: id } });
    return stats ? stats.toJSON() : null;
};

// 상품 시너지 조회
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
    ).catch(() => []); // 테이블이 없으면 빈 배열 반환

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

// 카테고리별 상품 목록
exports.getProductsByCategory = async (categoryId, options = {}) => {
    const {
        subcategory,
        page = 1,
        limit = 20,
        sort = 'download'
    } = options;

    const where = { category_id: categoryId };
    if (subcategory) {
        where.sub_category_id = subcategory;
    }

    return exports.findAllProducts({ ...options, category: categoryId, subcategory, page, limit, sort });
};

// 태그별 상품 목록
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

    // 직접 조인 사용
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
    ).catch(() => []); // 테이블이 없으면 빈 배열 반환

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

// 상품 생성
exports.createProduct = async ({ name, description, price, seller, imageUrl, category_id, sub_category_id }) => {
    return await models.Product.create({ 
        name, 
        description, 
        price, 
        seller, 
        imageUrl,
        category_id,
        sub_category_id
    });
};

// 상품 구매 (품절 처리)
exports.markAsSoldOut = async (id) => {
    return await models.Product.update({ soldout: 1 }, { where: { id } });
};

// 카테고리별 대표 상품 조회 (메인 페이지용)
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