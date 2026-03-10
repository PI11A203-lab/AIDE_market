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
        sort = 'download',
        user_id = null,
        creator_id = null,
        seller = null
    } = options;

    const offset = (page - 1) * limit;

    // フィルタ条件
    const where = {};
    if (category) {
        where.category_id = parseInt(category);
    }
    if (subcategory) {
        where.sub_category_id = parseInt(subcategory);
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
        // 상품명·설명 + 메인 카테고리명(name, name_ja) + 서브카테고리명으로 검색
        whereConditions.push('(p.name LIKE :search OR p.description LIKE :search OR c.name LIKE :search OR c.name_ja LIKE :search OR sc.name LIKE :search)');
        replacements.search = `%${search}%`;
    }
    if (creator_id) {
        whereConditions.push('(p.created_by = :creator_id OR (p.seller = (SELECT username FROM users WHERE id = :creator_id)))');
        replacements.creator_id = parseInt(creator_id);
    }
    if (seller) {
        whereConditions.push('p.seller = :seller');
        replacements.seller = seller;
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
    
    // 디버깅: 정렬 파라미터 확인
    console.log('정렬 파라미터:', { sort, order, orderClause });

    // is_purchased 필드 추가를 위한 서브쿼리
    const isPurchasedSubquery = user_id 
        ? `CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM order_items oi 
                JOIN orders o ON oi.order_id = o.id 
                WHERE o.user_id = :user_id AND oi.product_id = p.id
            ) THEN 1 
            ELSE 0 
        END as is_purchased`
        : `0 as is_purchased`;

    const products = await models.sequelize.query(
        `SELECT
            p.*,
            c.name_ja as category_name,
            sc.name as subcategory_name,
            ${isPurchasedSubquery}
         FROM Products p
         LEFT JOIN Categories c ON p.category_id = c.id
         LEFT JOIN Categories sc ON p.sub_category_id = sc.id
         ${whereClause}
         ORDER BY ${orderClause}
         LIMIT :limit OFFSET :offset`,
        {
            replacements: {
                ...replacements,
                ...(user_id ? { user_id: parseInt(user_id) } : {})
            },
            type: models.sequelize.QueryTypes.SELECT
        }
    );

    const countReplacements = { ...replacements };

    // search 시 c, sc 참조하므로 count 쿼리에도 동일 JOIN 필요
    const countFrom = search
        ? `FROM Products p LEFT JOIN Categories c ON p.category_id = c.id LEFT JOIN Categories sc ON p.sub_category_id = sc.id`
        : `FROM Products p`;
    const countResult = await models.sequelize.query(
        `SELECT COUNT(*) as count ${countFrom}
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

// 상품 조회 (ID로)
exports.findProductById = async (id) => {
    const product = await models.Product.findByPk(id);
    return product ? product.toJSON() : null;
};

// 商品作成
exports.createProduct = async ({ name, description, price, seller, imageUrl, category_id, sub_category_id, tech_stack }) => {
    return await models.Product.create({
        name,
        description,
        price,
        seller,
        imageUrl,
        category_id,
        sub_category_id,
        tech_stack
    });
};

// 상품 업데이트
exports.updateProduct = async (id, updateData) => {
    const product = await models.Product.findByPk(id);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    // category_id가 변경되는 경우 확인
    if (updateData.category_id !== undefined) {
        const category = await models.Category.findByPk(updateData.category_id);
        if (!category) {
            throw new Error('카테고리를 찾을 수 없습니다');
        }
    }
    
    // sub_category_id가 변경되는 경우 확인
    if (updateData.sub_category_id !== undefined && updateData.sub_category_id !== null) {
        const subCategory = await models.Category.findByPk(updateData.sub_category_id);
        if (!subCategory) {
            throw new Error('서브카테고리를 찾을 수 없습니다');
        }
    }
    
    await product.update(updateData);
    return product.toJSON();
};

// 상품 삭제
exports.deleteProduct = async (id) => {
    const product = await models.Product.findByPk(id);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    await product.destroy();
    return true;
};
