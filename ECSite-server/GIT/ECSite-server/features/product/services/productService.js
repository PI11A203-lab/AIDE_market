const models = require("../../../db/initializer");
const { Op } = require("sequelize");

// 全商品一覧 (ページネーション + フィルタ + ソート)
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

    // フィルタ条件
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

    // ソートオプション
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

    // WHERE句ビルド
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

    // ORDER BY句ビルド
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

// 商品作成
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
