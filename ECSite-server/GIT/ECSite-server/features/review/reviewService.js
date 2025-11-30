const models = require("../../db/initializer");

// 상품별 리뷰 목록 조회
exports.findReviewsByProductId = async (productId, page = 1, limit = 20, currentUserId = null) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.ProductReview.findAndCountAll({
        where: { product_id: productId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']],
        attributes: ['id', 'user_id', 'product_id', 'order_item_id', 'rating', 'title', 'review_text', 'review_images', 'created_at', 'updated_at']
    });
    
    // helpful_count와 현재 사용자의 helpful 여부 포함
    const reviewsWithUsers = await Promise.all(
        rows.map(async (review) => {
            const reviewJson = review.toJSON();
            // review_images가 JSON 문자열인 경우 파싱
            if (reviewJson.review_images && typeof reviewJson.review_images === 'string') {
                try {
                    reviewJson.review_images = JSON.parse(reviewJson.review_images);
                } catch (e) {
                    reviewJson.review_images = [];
                }
            }
            
            // helpful_count 계산
            const helpfulCount = await models.ReviewHelpful.count({
                where: { review_id: review.id }
            });
            reviewJson.helpful_count = helpfulCount || 0;
            
            // 현재 사용자가 helpful 했는지 확인
            if (currentUserId) {
                const isHelpful = await models.ReviewHelpful.findOne({
                    where: {
                        review_id: review.id,
                        user_id: currentUserId
                    }
                });
                reviewJson.is_helpful = !!isHelpful;
            } else {
                reviewJson.is_helpful = false;
            }
            
            return reviewJson;
        })
    );
    
    return {
        reviews: reviewsWithUsers,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    };
};

// 사용자별 리뷰 목록 조회
exports.findReviewsByUserId = async (userId, page = 1, limit = 20, currentUserId = null) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.ProductReview.findAndCountAll({
        where: { user_id: userId },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']],
        attributes: ['id', 'user_id', 'product_id', 'order_item_id', 'rating', 'title', 'review_text', 'review_images', 'created_at', 'updated_at']
    });
    
    // 상품 정보 조인 + helpful_count와 현재 사용자의 helpful 여부 포함
    const reviewsWithProducts = await Promise.all(
        rows.map(async (review) => {
            const reviewJson = review.toJSON();
            // review_images가 JSON 문자열인 경우 파싱
            if (reviewJson.review_images && typeof reviewJson.review_images === 'string') {
                try {
                    reviewJson.review_images = JSON.parse(reviewJson.review_images);
                } catch (e) {
                    reviewJson.review_images = [];
                }
            }
            const product = await models.Product.findByPk(review.product_id, {
                attributes: ['id', 'name', 'price', 'seller', 'imageUrl']
            });
            
            // helpful_count 계산
            const helpfulCount = await models.ReviewHelpful.count({
                where: { review_id: review.id }
            });
            reviewJson.helpful_count = helpfulCount || 0;
            
            // 현재 사용자가 helpful 했는지 확인
            if (currentUserId) {
                const isHelpful = await models.ReviewHelpful.findOne({
                    where: {
                        review_id: review.id,
                        user_id: currentUserId
                    }
                });
                reviewJson.is_helpful = !!isHelpful;
            } else {
                reviewJson.is_helpful = false;
            }
            
            return {
                ...reviewJson,
                product: product ? product.toJSON() : null
            };
        })
    );
    
    return {
        reviews: reviewsWithProducts,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    };
};

// 리뷰 생성
exports.createReview = async (userId, productId, orderItemId, rating, reviewText = null, title = null, reviewImages = null) => {
    // 상품 존재 확인
    const product = await models.Product.findByPk(productId);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    // order_item_id로 이미 리뷰가 있는지 확인
    const existingReview = await models.ProductReview.findOne({
        where: { order_item_id: orderItemId }
    });
    
    if (existingReview) {
        throw new Error('이미 해당 주문 아이템에 대한 리뷰가 존재합니다');
    }
    
    // rating 범위 확인
    if (rating < 1.0 || rating > 5.0) {
        throw new Error('평점은 1.0부터 5.0 사이여야 합니다');
    }
    
    // reviewImages가 문자열인 경우 JSON으로 파싱
    let imagesArray = [];
    if (reviewImages) {
        if (typeof reviewImages === 'string') {
            try {
                imagesArray = JSON.parse(reviewImages);
            } catch (e) {
                // 배열 형태의 문자열인 경우 (예: "['url1', 'url2']")
                imagesArray = Array.isArray(reviewImages) ? reviewImages : [reviewImages];
            }
        } else if (Array.isArray(reviewImages)) {
            imagesArray = reviewImages;
        }
    }
    
    const review = await models.ProductReview.create({
        user_id: userId,
        product_id: productId,
        order_item_id: orderItemId,
        rating: parseFloat(rating),
        title: title,
        review_text: reviewText,
        review_images: imagesArray
    });
    
    // order_items의 has_review 업데이트
    await models.sequelize.query(
        `UPDATE order_items SET has_review = 1 WHERE id = :orderItemId`,
        {
            replacements: { orderItemId },
            type: models.sequelize.QueryTypes.UPDATE
        }
    ).catch(() => {}); // order_items 테이블이 없을 수도 있으므로 에러 무시
    
    // 상품의 평균 평점 업데이트
    await updateProductRating(productId);
    
    const reviewJson = review.toJSON();
    // review_images가 JSON 문자열인 경우 파싱
    if (reviewJson.review_images && typeof reviewJson.review_images === 'string') {
        try {
            reviewJson.review_images = JSON.parse(reviewJson.review_images);
        } catch (e) {
            reviewJson.review_images = [];
        }
    }
    return reviewJson;
};

// 리뷰 업데이트
exports.updateReview = async (reviewId, userId, rating = null, reviewText = null, title = null, reviewImages = null) => {
    const review = await models.ProductReview.findByPk(reviewId);
    if (!review) {
        throw new Error('리뷰를 찾을 수 없습니다');
    }
    
    // 본인의 리뷰만 수정 가능
    if (review.user_id !== userId) {
        throw new Error('본인의 리뷰만 수정할 수 있습니다');
    }
    
    const updateData = {};
    if (rating !== null) {
        if (rating < 1.0 || rating > 5.0) {
            throw new Error('평점은 1.0부터 5.0 사이여야 합니다');
        }
        updateData.rating = parseFloat(rating);
    }
    if (reviewText !== null) {
        updateData.review_text = reviewText;
    }
    if (title !== null) {
        updateData.title = title;
    }
    if (reviewImages !== null) {
        // reviewImages가 문자열인 경우 JSON으로 파싱
        let imagesArray = [];
        if (typeof reviewImages === 'string') {
            try {
                imagesArray = JSON.parse(reviewImages);
            } catch (e) {
                imagesArray = Array.isArray(reviewImages) ? reviewImages : [reviewImages];
            }
        } else if (Array.isArray(reviewImages)) {
            imagesArray = reviewImages;
        }
        updateData.review_images = imagesArray;
    }
    
    await review.update(updateData);
    
    // 상품의 평균 평점 업데이트
    if (rating !== null) {
        await updateProductRating(review.product_id);
    }
    
    const reviewJson = review.toJSON();
    // review_images가 JSON 문자열인 경우 파싱
    if (reviewJson.review_images && typeof reviewJson.review_images === 'string') {
        try {
            reviewJson.review_images = JSON.parse(reviewJson.review_images);
        } catch (e) {
            reviewJson.review_images = [];
        }
    }
    return reviewJson;
};

// 리뷰 삭제
exports.deleteReview = async (reviewId, userId) => {
    console.log(`🗑️ 리뷰 삭제 요청: reviewId=${reviewId}, userId=${userId}`);
    
    const review = await models.ProductReview.findByPk(reviewId);
    if (!review) {
        console.error(`❌ 리뷰를 찾을 수 없습니다: reviewId=${reviewId}`);
        throw new Error('리뷰를 찾을 수 없습니다');
    }
    
    // 본인의 리뷰만 삭제 가능
    if (review.user_id !== userId) {
        console.error(`❌ 권한 없음: review.user_id=${review.user_id}, 요청한 userId=${userId}`);
        throw new Error('본인의 리뷰만 삭제할 수 있습니다');
    }
    
    const productId = review.product_id;
    const orderItemId = review.order_item_id;
    
    console.log(`📝 삭제할 리뷰 정보:`, {
        reviewId,
        productId,
        orderItemId,
        rating: review.rating,
        user_id: review.user_id
    });
    
    await review.destroy();
    console.log(`✅ 리뷰 삭제 완료: reviewId=${reviewId}`);
    
    // order_items의 has_review 업데이트
    await models.sequelize.query(
        `UPDATE order_items SET has_review = 0 WHERE id = :orderItemId`,
        {
            replacements: { orderItemId },
            type: models.sequelize.QueryTypes.UPDATE
        }
    ).catch(() => {}); // order_items 테이블이 없을 수도 있으므로 에러 무시
    
    // 상품의 평균 평점 업데이트
    console.log(`📊 상품 평점 업데이트 시작: productId=${productId}`);
    await updateProductRating(productId);
    
    return true;
};

// ID로 리뷰 조회
exports.findReviewById = async (id, currentUserId = null) => {
    const review = await models.ProductReview.findByPk(id, {
        attributes: ['id', 'user_id', 'product_id', 'order_item_id', 'rating', 'title', 'review_text', 'review_images', 'created_at', 'updated_at']
    });
    if (!review) {
        return null;
    }
    
    const reviewJson = review.toJSON();
    // review_images가 JSON 문자열인 경우 파싱
    if (reviewJson.review_images && typeof reviewJson.review_images === 'string') {
        try {
            reviewJson.review_images = JSON.parse(reviewJson.review_images);
        } catch (e) {
            reviewJson.review_images = [];
        }
    }
    
    const product = await models.Product.findByPk(review.product_id, {
        attributes: ['id', 'name', 'price', 'seller', 'imageUrl']
    });
    
    // helpful_count 계산
    const helpfulCount = await models.ReviewHelpful.count({
        where: { review_id: review.id }
    });
    reviewJson.helpful_count = helpfulCount || 0;
    
    // 현재 사용자가 helpful 했는지 확인
    if (currentUserId) {
        const isHelpful = await models.ReviewHelpful.findOne({
            where: {
                review_id: review.id,
                user_id: currentUserId
            }
        });
        reviewJson.is_helpful = !!isHelpful;
    } else {
        reviewJson.is_helpful = false;
    }
    
    return {
        ...reviewJson,
        product: product ? product.toJSON() : null
    };
};

// 리뷰 helpful 추가/삭제
exports.toggleReviewHelpful = async (reviewId, userId) => {
    // 리뷰 존재 확인
    const review = await models.ProductReview.findByPk(reviewId);
    if (!review) {
        throw new Error('리뷰를 찾을 수 없습니다');
    }
    
    // 본인의 리뷰에는 helpful 할 수 없음
    if (review.user_id === userId) {
        throw new Error('본인의 리뷰에는 helpful을 할 수 없습니다');
    }
    
    // 이미 helpful 했는지 확인
    const existingHelpful = await models.ReviewHelpful.findOne({
        where: {
            review_id: reviewId,
            user_id: userId
        }
    });
    
    if (existingHelpful) {
        // 이미 helpful 했으면 삭제
        await existingHelpful.destroy();
        return { action: 'removed', helpful_count: await models.ReviewHelpful.count({ where: { review_id: reviewId } }) };
    } else {
        // helpful 추가
        await models.ReviewHelpful.create({
            review_id: reviewId,
            user_id: userId
        });
        return { action: 'added', helpful_count: await models.ReviewHelpful.count({ where: { review_id: reviewId } }) };
    }
};

// 상품 평균 평점 업데이트 헬퍼 함수
async function updateProductRating(productId) {
    try {
        const result = await models.sequelize.query(
            `SELECT AVG(rating) as avg_rating, COUNT(*) as count 
             FROM product_reviews 
             WHERE product_id = :productId`,
            {
                replacements: { productId },
                type: models.sequelize.QueryTypes.SELECT
            }
        );
        
        if (result && result.length > 0) {
            // 리뷰가 0개일 때: count는 0, avg_rating은 NULL
            const ratingCount = parseInt(result[0].count) || 0;
            let avgRating = 0;
            
            if (ratingCount > 0 && result[0].avg_rating !== null) {
                avgRating = parseFloat(result[0].avg_rating) || 0;
            }
            
            const updateData = {
                rating_average: avgRating.toFixed(2),
                rating_count: ratingCount
            };
            
            const [updatedRows] = await models.Product.update(
                updateData,
                { where: { id: productId } }
            );
            
            if (updatedRows > 0) {
                console.log(`✅ 상품 ${productId}의 평점 업데이트 성공:`, updateData);
            } else {
                console.warn(`⚠️ 상품 ${productId}를 찾을 수 없어 평점을 업데이트할 수 없습니다.`);
            }
        } else {
            // 리뷰가 없는 경우 (데이터가 없는 경우)
            const updateData = {
                rating_average: '0.00',
                rating_count: 0
            };
            
            const [updatedRows] = await models.Product.update(
                updateData,
                { where: { id: productId } }
            );
            
            if (updatedRows > 0) {
                console.log(`✅ 상품 ${productId}의 평점을 0으로 초기화:`, updateData);
            } else {
                console.warn(`⚠️ 상품 ${productId}를 찾을 수 없어 평점을 업데이트할 수 없습니다.`);
            }
        }
    } catch (error) {
        console.error(`❌ 상품 ${productId}의 평점 업데이트 실패:`, error);
        console.error('에러 상세:', {
            message: error.message,
            stack: error.stack,
            productId
        });
        // 에러가 발생해도 계속 진행 (리뷰 삭제/수정은 성공한 상태)
        // 다음 로드 시 자동으로 올바른 값이 계산됨
    }
}

