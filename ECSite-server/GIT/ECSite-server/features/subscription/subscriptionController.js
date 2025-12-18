const subscriptionService = require('./subscriptionService');
const models = require('../../db/initializer');

/**
 * 구독 생성
 */
exports.createSubscription = async (req, res) => {
    try {
        const { orderId, cardId, couponId, userLanguage } = req.body;
        
        const transaction = await models.sequelize.transaction();
        
        try {
            const result = await subscriptionService.createSubscription({
                orderId,
                cardId,
                couponId,
                userLanguage
            }, transaction);

            // 활성화 코드 생성
            const productActivationService = require('../productactivation/productActivationService');
            await productActivationService.createActivationsForSubscription(
                result.subscription.subscription_id,
                orderId,
                transaction
            );

            await transaction.commit();

            // 구독 생성 완료 이메일 발송
            const emailService = require('../user/emailService');
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            try {
                const subscriptionWithRelations = await subscriptionService.getSubscriptionById(result.subscription.subscription_id);
                await emailService.sendSubscriptionCreatedEmail(subscriptionWithRelations, baseUrl);
            } catch (emailError) {
                console.error('구독 생성 이메일 발송 실패:', emailError);
            }

            res.status(201).json({
                success: true,
                subscription: result.subscription,
                items: result.items
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('구독 생성 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 사용자 구독 목록 조회
 */
exports.getSubscriptionsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const subscriptions = await subscriptionService.getSubscriptionsByUser(userId);
        
        res.json({
            success: true,
            subscriptions
        });
    } catch (error) {
        console.error('구독 목록 조회 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 구독 상세 조회
 */
exports.getSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const subscription = await subscriptionService.getSubscriptionById(id);
        
        res.json({
            success: true,
            subscription
        });
    } catch (error) {
        console.error('구독 조회 실패:', error);
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 토큰으로 구독 정보 조회 (이메일 링크용)
 */
exports.getSubscriptionByToken = async (req, res) => {
    try {
        const { token } = req.params;
        
        // 인증 확인 (미들웨어에서 처리해야 함)
        // const userId = req.user.id;
        
        const subscription = await subscriptionService.getSubscriptionByToken(token);
        
        res.json({
            success: true,
            subscription
        });
    } catch (error) {
        console.error('토큰으로 구독 조회 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 결제 수단 변경
 */
exports.updatePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const { cardId } = req.body;
        
        const transaction = await models.sequelize.transaction();
        
        try {
            const subscription = await subscriptionService.updatePaymentMethod(id, cardId, transaction);
            await transaction.commit();
            
            res.json({
                success: true,
                subscription
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('결제 수단 변경 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 쿠폰 변경
 */
exports.updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { couponId } = req.body;
        
        const transaction = await models.sequelize.transaction();
        
        try {
            const subscription = await subscriptionService.updateCoupon(id, couponId, transaction);
            await transaction.commit();
            
            res.json({
                success: true,
                subscription
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('쿠폰 변경 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 언어 설정 변경
 */
exports.updateLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const { language } = req.body;
        
        const transaction = await models.sequelize.transaction();
        
        try {
            const subscription = await subscriptionService.updateUserLanguage(id, language, transaction);
            await transaction.commit();
            
            res.json({
                success: true,
                subscription
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('언어 설정 변경 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 구독 취소
 */
exports.cancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        
        const transaction = await models.sequelize.transaction();
        
        try {
            const subscription = await subscriptionService.cancelSubscription(id, transaction);
            await transaction.commit();

            // 구독 취소 이메일 발송
            const emailService = require('../user/emailService');
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            try {
                const subscriptionWithRelations = await subscriptionService.getSubscriptionById(id);
                await emailService.sendSubscriptionCancelledEmail(subscriptionWithRelations, baseUrl);
            } catch (emailError) {
                console.error('구독 취소 이메일 발송 실패:', emailError);
            }
            
            res.json({
                success: true,
                subscription
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('구독 취소 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

