const models = require("../../db/initializer");

// 사용자별 즐겨찾기 목록 조회
exports.findFavoritesByUserId = async (userId, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.ProductFavorite.findAndCountAll({
        where: { user_id: userId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
    });
    
    // 상품 정보 조인으로 가져오기
    const favoritesWithProducts = await Promise.all(
        rows.map(async (fav) => {
            const favJson = fav.toJSON();
            const product = await models.Product.findByPk(fav.product_id, {
                attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'rating_average', 'rating_count', 'download_count', 'category_id', 'sub_category_id']
            });
            return {
                ...favJson,
                product: product ? product.toJSON() : null
            };
        })
    );
    
    return {
        favorites: favoritesWithProducts,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    };
};

// 즐겨찾기 추가
exports.createFavorite = async (userId, productId, categoryId = null) => {
    // 상품 존재 확인
    const product = await models.Product.findByPk(productId);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    // 이미 즐겨찾기에 있는지 확인
    const existing = await models.ProductFavorite.findOne({
        where: {
            user_id: userId,
            product_id: productId
        }
    });
    
    if (existing) {
        throw new Error('이미 즐겨찾기에 추가된 상품입니다');
    }
    
    // category_id가 제공되지 않으면 상품의 category_id 사용
    const finalCategoryId = categoryId || product.category_id;
    
    const favorite = await models.ProductFavorite.create({
        user_id: userId,
        product_id: productId,
        category_id: finalCategoryId
    });
    
    return favorite.toJSON();
};

// 즐겨찾기 삭제
exports.deleteFavorite = async (userId, productId) => {
    const favorite = await models.ProductFavorite.findOne({
        where: {
            user_id: userId,
            product_id: productId
        }
    });
    
    if (!favorite) {
        throw new Error('즐겨찾기를 찾을 수 없습니다');
    }
    
    await favorite.destroy();
    return true;
};

// 특정 상품이 즐겨찾기에 있는지 확인
exports.isFavorite = async (userId, productId) => {
    const favorite = await models.ProductFavorite.findOne({
        where: {
            user_id: userId,
            product_id: productId
        }
    });
    
    return !!favorite;
};

// ID로 즐겨찾기 조회
exports.findFavoriteById = async (id) => {
    const favorite = await models.ProductFavorite.findByPk(id);
    
    if (!favorite) {
        return null;
    }
    
    const favJson = favorite.toJSON();
    const product = await models.Product.findByPk(favJson.product_id, {
        attributes: ['id', 'name', 'price', 'seller', 'imageUrl']
    });
    
    return {
        ...favJson,
        product: product ? product.toJSON() : null
    };
};

