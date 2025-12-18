const models = require("../../db/initializer");
const crypto = require('crypto');

/**
 * 활성화 코드 생성
 */
function generateActivationCode() {
    // 32자리 랜덤 문자열 생성
    return crypto.randomBytes(16).toString('hex').toUpperCase();
}

/**
 * 유예 기간 종료일 계산 (오늘부터 3일 후)
 */
function getGracePeriodEndDate() {
    const now = new Date();
    now.setDate(now.getDate() + 3);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 활성화 코드 생성
 */
exports.createActivation = async ({ userId, productId, orderId, subscriptionId = null }, transaction = null) => {
    if (!userId || !productId || !orderId) {
        throw new Error('userId, productId, orderId는 필수입니다');
    }

    // 사용자 확인
    const user = await models.User.findByPk(userId, { transaction });
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }

    // 상품 확인
    const product = await models.Product.findByPk(productId, { transaction });
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }

    // 주문 확인
    const order = await models.Order.findByPk(orderId, { transaction });
    if (!order) {
        throw new Error('주문을 찾을 수 없습니다');
    }

    // 활성화 코드 생성 (중복 확인)
    let activationCode = generateActivationCode();
    let existing = await models.ProductActivation.findOne({
        where: { activation_code: activationCode },
        transaction
    });

    let attempts = 0;
    while (existing && attempts < 10) {
        activationCode = generateActivationCode();
        existing = await models.ProductActivation.findOne({
            where: { activation_code: activationCode },
            transaction
        });
        attempts++;
    }

    if (existing) {
        throw new Error('활성화 코드 생성에 실패했습니다 (중복)');
    }

    // 활성화 코드 생성
    const activation = await models.ProductActivation.create({
        user_id: userId,
        product_id: productId,
        order_id: orderId,
        subscription_id: subscriptionId,
        activation_code: activationCode,
        status: 'active',
        activated_at: new Date()
    }, { transaction });

    return activation;
};

/**
 * 구독에 대한 활성화 코드 일괄 생성
 */
exports.createActivationsForSubscription = async (subscriptionId, orderId, transaction = null) => {
    const subscription = await models.Subscription.findByPk(subscriptionId, {
        include: [{
            model: models.SubscriptionItem,
            as: 'items'
        }],
        transaction
    });

    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    const activations = [];
    for (const item of subscription.items) {
        // 각 상품에 대해 수량만큼 활성화 코드 생성
        for (let i = 0; i < (item.quantity || 1); i++) {
            const activation = await exports.createActivation({
                userId: subscription.user_id,
                productId: item.product_id,
                orderId: orderId,
                subscriptionId: subscriptionId
            }, transaction);
            activations.push(activation);
        }
    }

    return activations;
};

/**
 * 활성화 코드 정지
 */
exports.suspendActivation = async (activationId, reason, transaction = null) => {
    const activation = await models.ProductActivation.findByPk(activationId, { transaction });
    if (!activation) {
        throw new Error('활성화 코드를 찾을 수 없습니다');
    }

    const gracePeriodEndDate = getGracePeriodEndDate();

    await activation.update({
        status: 'suspended',
        suspended_at: new Date(),
        suspended_reason: reason,
        grace_period_end_date: gracePeriodEndDate
    }, { transaction });

    return activation;
};

/**
 * 구독에 대한 활성화 코드 일괄 정지
 */
exports.suspendActivationsForSubscription = async (subscriptionId, reason, transaction = null) => {
    const activations = await models.ProductActivation.findAll({
        where: {
            subscription_id: subscriptionId,
            status: 'active'
        },
        transaction
    });

    const gracePeriodEndDate = getGracePeriodEndDate();

    await Promise.all(
        activations.map(activation =>
            activation.update({
                status: 'suspended',
                suspended_at: new Date(),
                suspended_reason: reason,
                grace_period_end_date: gracePeriodEndDate
            }, { transaction })
        )
    );

    return activations;
};

/**
 * 활성화 코드 재활성화
 */
exports.reactivateActivation = async (activationId, transaction = null) => {
    const activation = await models.ProductActivation.findByPk(activationId, { transaction });
    if (!activation) {
        throw new Error('활성화 코드를 찾을 수 없습니다');
    }

    await activation.update({
        status: 'active',
        suspended_at: null,
        suspended_reason: null,
        grace_period_end_date: null
    }, { transaction });

    return activation;
};

/**
 * 구독에 대한 활성화 코드 일괄 재활성화
 */
exports.reactivateActivationsForSubscription = async (subscriptionId, transaction = null) => {
    const activations = await models.ProductActivation.findAll({
        where: {
            subscription_id: subscriptionId,
            status: 'suspended'
        },
        transaction
    });

    await Promise.all(
        activations.map(activation =>
            activation.update({
                status: 'active',
                suspended_at: null,
                suspended_reason: null,
                grace_period_end_date: null
            }, { transaction })
        )
    );

    return activations;
};

/**
 * 사용자 활성화 코드 목록 조회
 */
exports.getUserActivations = async (userId, includeSuspended = true) => {
    const where = { user_id: userId };
    
    if (!includeSuspended) {
        where.status = 'active';
    }

    const activations = await models.ProductActivation.findAll({
        where,
        include: [
            {
                model: models.Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'imageUrl', 'description']
            },
            {
                model: models.Order,
                as: 'order',
                attributes: ['id', 'order_number', 'status', 'purchased_at']
            },
            {
                model: models.Subscription,
                as: 'subscription',
                attributes: ['subscription_id', 'status', 'next_payment_date']
            }
        ],
        order: [['created_at', 'DESC']]
    });

    return activations;
};

/**
 * 활성화 코드 검증
 */
exports.checkActivationCode = async (code) => {
    const activation = await models.ProductActivation.findOne({
        where: { activation_code: code },
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email']
            },
            {
                model: models.Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'imageUrl', 'description']
            },
            {
                model: models.Order,
                as: 'order',
                attributes: ['id', 'order_number', 'status']
            }
        ]
    });

    if (!activation) {
        return { valid: false, message: '활성화 코드를 찾을 수 없습니다' };
    }

    if (activation.status === 'suspended') {
        const gracePeriodInfo = {
            inGracePeriod: false,
            daysRemaining: 0
        };

        if (activation.grace_period_end_date) {
            const today = new Date();
            const graceEnd = new Date(activation.grace_period_end_date);
            
            if (today <= graceEnd) {
                gracePeriodInfo.inGracePeriod = true;
                gracePeriodInfo.daysRemaining = Math.ceil((graceEnd - today) / (1000 * 60 * 60 * 24));
            }
        }

        return {
            valid: false,
            message: '활성화 코드가 정지되었습니다',
            reason: activation.suspended_reason,
            gracePeriod: gracePeriodInfo
        };
    }

    if (activation.status === 'expired') {
        return { valid: false, message: '활성화 코드가 만료되었습니다' };
    }

    if (activation.status === 'revoked') {
        return { valid: false, message: '활성화 코드가 취소되었습니다' };
    }

    return {
        valid: true,
        activation: activation.toJSON()
    };
};

