const reviewService = require("./reviewService");

// 상품별 리뷰 목록 조회
exports.getReviewsByProductId = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await reviewService.findReviewsByProductId(productId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "리뷰 목록 조회 실패" });
    }
};

// 사용자별 리뷰 목록 조회
exports.getReviewsByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await reviewService.findReviewsByUserId(userId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "리뷰 목록 조회 실패" });
    }
};

// ID로 리뷰 조회
exports.getReviewById = async (req, res) => {
    try {
        const review = await reviewService.findReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: "리뷰를 찾을 수 없습니다" });
        }
        res.json({ review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "리뷰 조회 실패" });
    }
};

// 리뷰 생성
exports.createReview = async (req, res) => {
    try {
        const userId = parseInt(req.body.user_id);
        const productId = parseInt(req.body.product_id);
        const orderItemId = parseInt(req.body.order_item_id);
        const rating = parseFloat(req.body.rating);
        const reviewText = req.body.review_text || null;
        const title = req.body.title || null;
        const reviewImages = req.body.review_images || null;
        
        if (!userId || !productId || !orderItemId || !rating) {
            return res.status(400).json({ error: "user_id, product_id, order_item_id, rating은 필수입니다" });
        }
        
        const review = await reviewService.createReview(userId, productId, orderItemId, rating, reviewText, title, reviewImages);
        res.status(201).json({ review });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이미') || err.message.includes('평점은')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "리뷰 생성 실패" });
    }
};

// 리뷰 업데이트
exports.updateReview = async (req, res) => {
    try {
        const reviewId = parseInt(req.params.id);
        const userId = parseInt(req.body.user_id);
        const rating = req.body.rating !== undefined ? parseFloat(req.body.rating) : null;
        const reviewText = req.body.review_text !== undefined ? req.body.review_text : null;
        const title = req.body.title !== undefined ? req.body.title : null;
        const reviewImages = req.body.review_images !== undefined ? req.body.review_images : null;
        
        if (!userId) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        const review = await reviewService.updateReview(reviewId, userId, rating, reviewText, title, reviewImages);
        res.json({ review });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('본인의') || err.message.includes('평점은')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "리뷰 업데이트 실패" });
    }
};

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = parseInt(req.params.id);
        // req.query와 req.body 모두 확인 (안전하게 처리)
        const userId = parseInt(
            (req.body && req.body.user_id) || 
            (req.query && req.query.user_id) || 
            null
        );
        
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        await reviewService.deleteReview(reviewId, userId);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('본인의')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "리뷰 삭제 실패" });
    }
};

