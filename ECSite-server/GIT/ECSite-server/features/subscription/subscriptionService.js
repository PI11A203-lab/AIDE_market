const models = require("../../db/initializer");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * 다음 달 말일 계산
 */
function getNextMonthEndDate() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0); // 다음 달의 마지막 날
    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
    const day = String(nextMonth.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
 * 구독 생성 (최초 결제는 이미 완료된 상태)
 */
exports.createSubscription = async ({ orderId, cardId, couponId = null, userLanguage = 'ko' }, transaction = null) => {
    if (!orderId || !cardId) {
        throw new Error('orderId와 cardId는 필수입니다');
    }

    // 주문 확인
    const order = await models.Order.findByPk(orderId, { transaction });
    if (!order) {
        throw new Error('주문을 찾을 수 없습니다');
    }

    // 카드 확인
    const card = await models.CreditCard.findByPk(cardId, { transaction });
    if (!card) {
        throw new Error('카드를 찾을 수 없습니다');
    }

    // 카드가 해당 사용자의 것인지 확인
    if (card.user_id !== order.user_id) {
        throw new Error('카드는 주문자의 것이 아닙니다');
    }

    // 이미 구독이 존재하는지 확인
    const existingSubscription = await models.Subscription.findOne({
        where: { order_id: orderId },
        transaction
    });
    if (existingSubscription) {
        throw new Error('이미 해당 주문에 대한 구독이 존재합니다');
    }

    // 쿠폰 확인
    if (couponId) {
        const coupon = await models.Coupon.findByPk(couponId, { transaction });
        if (!coupon) {
            throw new Error('쿠폰을 찾을 수 없습니다');
        }
    }

    // 다음 결제일 계산 (다음 달 말일)
    const nextPaymentDate = getNextMonthEndDate();

    // 구독 생성 (먼저 생성 후 토큰 생성)
    const subscription = await models.Subscription.create({
        user_id: order.user_id,
        order_id: orderId,
        card_id: cardId,
        status: 'active',
        next_payment_date: nextPaymentDate,
        last_payment_date: new Date().toISOString().split('T')[0], // 오늘
        last_payment_status: 'success',
        coupon_id: couponId,
        user_language: userLanguage,
        reminder_token: null, // 나중에 업데이트
        reminder_token_expires_at: null
    }, { transaction });

    // 리마인더 토큰 생성 (구독 ID 사용)
    const reminderToken = generateReminderToken(order.user_id, subscription.subscription_id);
    
    // 토큰 업데이트
    await subscription.update({
        reminder_token: reminderToken,
        reminder_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7일 후
    }, { transaction });

    // 구독 아이템 추가 (주문 아이템에서)
    const orderItems = await models.OrderItem.findAll({
        where: { order_id: orderId },
        transaction
    });

    if (orderItems.length === 0) {
        throw new Error('주문에 상품이 없습니다');
    }

    const subscriptionItems = await Promise.all(
        orderItems.map(item =>
            models.SubscriptionItem.create({
                subscription_id: subscription.subscription_id,
                product_id: item.product_id,
                quantity: item.quantity || 1,
                unit_price: item.unit_price || item.price
            }, { transaction })
        )
    );

    // 최초 결제 기록
    await models.SubscriptionPayment.create({
        subscription_id: subscription.subscription_id,
        order_id: orderId,
        payment_date: new Date().toISOString().split('T')[0],
        status: 'success',
        amount: order.total_amount,
        is_first_payment: true,
        retry_count: 0
    }, { transaction });

    // 주문 업데이트 (구독 정보 추가)
    await order.update({
        subscription_id: subscription.subscription_id,
        is_recurring: true,
        is_first_payment: true,
        parent_order_id: orderId
    }, { transaction });

    return {
        subscription,
        items: subscriptionItems
    };
};

/**
 * 이메일 링크용 JWT 토큰 생성
 */
function generateReminderToken(userId, subscriptionId) {
    const payload = {
        userId,
        subscriptionId,
        type: 'subscription_reminder'
    };
    
    return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
}

/**
 * 토큰 검증
 */
exports.validateReminderToken = (token) => {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
        );
        
        if (decoded.type !== 'subscription_reminder') {
            throw new Error('Invalid token type');
        }
        
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * 토큰으로 구독 정보 조회
 */
exports.getSubscriptionByToken = async (token) => {
    const decoded = exports.validateReminderToken(token);
    
    const subscription = await models.Subscription.findByPk(decoded.subscriptionId, {
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email', 'preferred_language']
            },
            {
                model: models.CreditCard,
                as: 'creditCard',
                attributes: ['card_id', 'card_company', 'exp_month', 'exp_year']
            },
            {
                model: models.SubscriptionItem,
                as: 'items',
                include: [{
                    model: models.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'imageUrl']
                }]
            },
            {
                model: models.Coupon,
                as: 'coupon',
                attributes: ['coupon_id', 'code', 'discount_type', 'discount_value']
            }
        ]
    });

    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    // 토큰이 만료되었는지 확인
    if (subscription.reminder_token_expires_at && new Date() > new Date(subscription.reminder_token_expires_at)) {
        throw new Error('토큰이 만료되었습니다');
    }

    // 토큰 일치 확인
    if (subscription.reminder_token !== token) {
        throw new Error('유효하지 않은 토큰입니다');
    }

    return subscription;
};

/**
 * 월별 자동 결제 처리
 */
exports.processMonthlyPayment = async (subscriptionId, transaction = null) => {
    const subscription = await models.Subscription.findByPk(subscriptionId, {
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'account_type', 'student_expires_at']
            },
            {
                model: models.SubscriptionItem,
                as: 'items',
                include: [{
                    model: models.Product,
                    as: 'product'
                }]
            },
            {
                model: models.Coupon,
                as: 'coupon'
            }
        ],
        transaction
    });

    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    if (subscription.status !== 'active') {
        throw new Error(`구독이 활성화되어 있지 않습니다 (현재 상태: ${subscription.status})`);
    }

    // 결제 금액 계산
    const priceCalculationService = require('../order/priceCalculationService');
    const totalAmount = await priceCalculationService.calculateSubscriptionPrice(
        subscription.items,
        subscription.user,
        subscription.coupon
    );

    // 결제 시도 (실제 결제는 외부 API 호출 필요 - 여기서는 시뮬레이션)
    // TODO: 실제 결제 처리 로직 구현
    let paymentStatus = 'success'; // 임시로 항상 성공
    let failureReason = null;

    // 새 주문 생성
    const orderNumber = `SUB-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const newOrder = await models.Order.create({
        user_id: subscription.user_id,
        order_number: orderNumber,
        total_amount: totalAmount,
        payment_id: null, // 정기결제는 별도 처리
        status: paymentStatus === 'success' ? 'completed' : 'pending',
        subscription_id: subscription.subscription_id,
        is_recurring: true,
        is_first_payment: false,
        parent_order_id: subscription.order_id
    }, { transaction });

    // 결제 기록
    const paymentRecord = await models.SubscriptionPayment.create({
        subscription_id: subscriptionId,
        order_id: newOrder.id,
        payment_date: new Date().toISOString().split('T')[0],
        status: paymentStatus,
        amount: totalAmount,
        failure_reason: failureReason,
        is_first_payment: false,
        retry_count: 0
    }, { transaction });

    if (paymentStatus === 'success') {
        // 결제 성공 처리
        const nextPaymentDate = getNextMonthEndDate();
        await subscription.update({
            last_payment_date: new Date().toISOString().split('T')[0],
            last_payment_status: 'success',
            next_payment_date: nextPaymentDate,
            grace_period_end_date: null
        }, { transaction });

        // 활성화 코드는 이미 활성화 상태 유지
        return {
            success: true,
            order: newOrder,
            payment: paymentRecord
        };
    } else {
        // 결제 실패 처리
        await exports.handlePaymentFailure(subscriptionId, failureReason || '결제 처리 실패', transaction);
        return {
            success: false,
            order: newOrder,
            payment: paymentRecord,
            error: failureReason
        };
    }
};

/**
 * 결제 실패 처리
 */
exports.handlePaymentFailure = async (subscriptionId, reason, transaction = null) => {
    const subscription = await models.Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    // 구독 상태 업데이트
    const gracePeriodEndDate = getGracePeriodEndDate();
    await subscription.update({
        status: 'failed',
        last_payment_status: 'failed',
        grace_period_end_date: gracePeriodEndDate
    }, { transaction });

    // 활성화 코드 정지
    const productActivationService = require('../productactivation/productActivationService');
    await productActivationService.suspendActivationsForSubscription(subscriptionId, reason, transaction);

    return subscription;
};

/**
 * 활성화 코드 정지 (구독별)
 */
exports.suspendProductActivations = async (subscriptionId, reason, transaction = null) => {
    const productActivationService = require('../productactivation/productActivationService');
    return await productActivationService.suspendActivationsForSubscription(subscriptionId, reason, transaction);
};

/**
 * 활성화 코드 재활성화 (구독별)
 */
exports.reactivateProductActivations = async (subscriptionId, transaction = null) => {
    const productActivationService = require('../productactivation/productActivationService');
    return await productActivationService.reactivateActivationsForSubscription(subscriptionId, transaction);
};

/**
 * 유예 기간 확인
 */
exports.checkGracePeriod = async (subscriptionId) => {
    const subscription = await models.Subscription.findByPk(subscriptionId);
    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    if (!subscription.grace_period_end_date) {
        return { inGracePeriod: false, daysRemaining: 0 };
    }

    const today = new Date();
    const graceEnd = new Date(subscription.grace_period_end_date);
    
    if (today > graceEnd) {
        return { inGracePeriod: false, daysRemaining: 0 };
    }

    const daysRemaining = Math.ceil((graceEnd - today) / (1000 * 60 * 60 * 24));
    return { inGracePeriod: true, daysRemaining };
};

/**
 * 결제 수단 변경
 */
exports.updatePaymentMethod = async (subscriptionId, newCardId, transaction = null) => {
    const subscription = await models.Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    // 새 카드 확인
    const card = await models.CreditCard.findByPk(newCardId, { transaction });
    if (!card) {
        throw new Error('카드를 찾을 수 없습니다');
    }

    // 카드가 해당 사용자의 것인지 확인
    if (card.user_id !== subscription.user_id) {
        throw new Error('카드는 사용자의 것이 아닙니다');
    }

    await subscription.update({ card_id: newCardId }, { transaction });
    return subscription;
};

/**
 * 쿠폰 변경
 */
exports.updateCoupon = async (subscriptionId, couponId, transaction = null) => {
    const subscription = await models.Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    // 쿠폰 확인
    if (couponId) {
        const coupon = await models.Coupon.findByPk(couponId, { transaction });
        if (!coupon) {
            throw new Error('쿠폰을 찾을 수 없습니다');
        }
    }

    await subscription.update({ coupon_id: couponId }, { transaction });
    return subscription;
};

/**
 * 사용자 언어 설정 변경
 */
exports.updateUserLanguage = async (subscriptionId, language, transaction = null) => {
    const subscription = await models.Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    const validLanguages = ['ko', 'en', 'ja'];
    if (!validLanguages.includes(language)) {
        throw new Error('지원하지 않는 언어입니다 (ko, en, ja만 가능)');
    }

    await subscription.update({ user_language: language }, { transaction });
    return subscription;
};

/**
 * 구독 취소
 */
exports.cancelSubscription = async (subscriptionId, transaction = null) => {
    const subscription = await models.Subscription.findByPk(subscriptionId, { transaction });
    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    await subscription.update({ status: 'cancelled' }, { transaction });
    return subscription;
};

/**
 * 사용자 구독 목록 조회
 */
exports.getSubscriptionsByUser = async (userId) => {
    const subscriptions = await models.Subscription.findAll({
        where: { user_id: userId },
        include: [
            {
                model: models.CreditCard,
                as: 'creditCard',
                attributes: ['card_id', 'card_company', 'exp_month', 'exp_year']
            },
            {
                model: models.SubscriptionItem,
                as: 'items',
                include: [{
                    model: models.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'imageUrl']
                }]
            },
            {
                model: models.Coupon,
                as: 'coupon',
                attributes: ['coupon_id', 'code', 'discount_type', 'discount_value']
            }
        ],
        order: [['created_at', 'DESC']]
    });

    return subscriptions;
};

/**
 * 구독 상세 조회
 */
exports.getSubscriptionById = async (subscriptionId) => {
    const subscription = await models.Subscription.findByPk(subscriptionId, {
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email', 'preferred_language']
            },
            {
                model: models.CreditCard,
                as: 'creditCard',
                attributes: ['card_id', 'card_company', 'exp_month', 'exp_year']
            },
            {
                model: models.SubscriptionItem,
                as: 'items',
                include: [{
                    model: models.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'imageUrl', 'description']
                }]
            },
            {
                model: models.Coupon,
                as: 'coupon',
                attributes: ['coupon_id', 'code', 'discount_type', 'discount_value']
            },
            {
                model: models.SubscriptionPayment,
                as: 'payments',
                order: [['payment_date', 'DESC']],
                limit: 10
            }
        ]
    });

    if (!subscription) {
        throw new Error('구독을 찾을 수 없습니다');
    }

    return subscription;
};

/**
 * 다음 결제일이 오늘인 구독 조회 (스케줄러용)
 */
exports.getSubscriptionsDueToday = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const subscriptions = await models.Subscription.findAll({
        where: {
            next_payment_date: today,
            status: 'active'
        },
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'account_type', 'student_expires_at']
            },
            {
                model: models.SubscriptionItem,
                as: 'items',
                include: [{
                    model: models.Product,
                    as: 'product'
                }]
            },
            {
                model: models.Coupon,
                as: 'coupon'
            }
        ]
    });

    return subscriptions;
};

/**
 * 다음 결제일이 5일 후인 구독 조회 (알림 스케줄러용)
 */
exports.getSubscriptionsDueIn5Days = async () => {
    const today = new Date();
    today.setDate(today.getDate() + 5);
    const targetDate = today.toISOString().split('T')[0];
    
    const subscriptions = await models.Subscription.findAll({
        where: {
            next_payment_date: targetDate,
            status: 'active'
        },
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email', 'preferred_language']
            },
            {
                model: models.SubscriptionItem,
                as: 'items',
                include: [{
                    model: models.Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'imageUrl']
                }]
            },
            {
                model: models.Coupon,
                as: 'coupon'
            }
        ]
    });

    return subscriptions;
};

