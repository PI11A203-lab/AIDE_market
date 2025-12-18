const studentAccountService = require('../user/studentAccountService');
const models = require("../../db/initializer");

/**
 * 쿠폰 할인 적용
 */
function applyCouponDiscount(price, coupon) {
    if (!coupon || !coupon.is_active) {
        return price;
    }

    // 만료 확인
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return price;
    }

    let discountAmount = 0;

    if (coupon.discount_type === 'amount') {
        // 정액 할인
        discountAmount = parseFloat(coupon.discount_value);
    } else if (coupon.discount_type === 'rate') {
        // 정률 할인
        const discountRate = parseFloat(coupon.discount_value) / 100;
        discountAmount = Math.floor(price * discountRate);

        // 최대 할인 금액 제한
        if (coupon.max_discount && discountAmount > parseFloat(coupon.max_discount)) {
            discountAmount = parseFloat(coupon.max_discount);
        }
    }

    // 최소 주문 금액 확인
    if (coupon.min_order && price < parseFloat(coupon.min_order)) {
        return price;
    }

    const finalPrice = price - discountAmount;
    return Math.max(0, finalPrice); // 0보다 작을 수 없음
}

/**
 * 최종 가격 계산 (단일 상품)
 */
exports.calculateFinalPrice = async (productPrice, user, coupon = null) => {
    let finalPrice = productPrice;

    // 학생 할인 적용 (50%)
    if (user && studentAccountService.isStudentActive(user)) {
        finalPrice = studentAccountService.calculateStudentDiscount(finalPrice, user);
    }

    // 쿠폰 할인 적용
    if (coupon) {
        finalPrice = applyCouponDiscount(finalPrice, coupon);
    }

    // 최대 할인율 제한 (70%까지)
    const originalPrice = productPrice;
    const totalDiscount = originalPrice - finalPrice;
    const maxDiscount = Math.floor(originalPrice * 0.7);
    
    if (totalDiscount > maxDiscount) {
        finalPrice = originalPrice - maxDiscount;
    }

    return Math.max(0, Math.floor(finalPrice));
};

/**
 * 정기결제 가격 계산 (구독 아이템들)
 */
exports.calculateSubscriptionPrice = async (subscriptionItems, user, coupon = null) => {
    if (!subscriptionItems || subscriptionItems.length === 0) {
        return 0;
    }

    let totalPrice = 0;

    // 각 아이템 가격 계산
    for (const item of subscriptionItems) {
        const productPrice = item.unit_price || (item.product ? item.product.price : 0);
        const quantity = item.quantity || 1;
        const itemTotal = productPrice * quantity;

        // 학생 할인 적용
        let itemFinalPrice = itemTotal;
        if (user && studentAccountService.isStudentActive(user)) {
            itemFinalPrice = studentAccountService.calculateStudentDiscount(itemFinalPrice, user);
        }

        totalPrice += itemFinalPrice;
    }

    // 쿠폰 할인 적용 (전체 금액에 대해)
    if (coupon) {
        totalPrice = applyCouponDiscount(totalPrice, coupon);
    }

    // 최대 할인율 제한 (70%까지)
    const originalTotal = subscriptionItems.reduce((sum, item) => {
        const productPrice = item.unit_price || (item.product ? item.product.price : 0);
        const quantity = item.quantity || 1;
        return sum + (productPrice * quantity);
    }, 0);

    const totalDiscount = originalTotal - totalPrice;
    const maxDiscount = Math.floor(originalTotal * 0.7);
    
    if (totalDiscount > maxDiscount) {
        totalPrice = originalTotal - maxDiscount;
    }

    return Math.max(0, Math.floor(totalPrice));
};

/**
 * 주문 총액 계산 (주문 아이템들)
 */
exports.calculateOrderTotal = async (orderItems, user, coupon = null) => {
    if (!orderItems || orderItems.length === 0) {
        return 0;
    }

    let totalPrice = 0;

    // 각 아이템 가격 계산
    for (const item of orderItems) {
        const productPrice = item.unit_price || item.price || (item.product ? item.product.price : 0);
        const quantity = item.quantity || 1;
        const itemTotal = productPrice * quantity;

        // 학생 할인 적용
        let itemFinalPrice = itemTotal;
        if (user && studentAccountService.isStudentActive(user)) {
            itemFinalPrice = studentAccountService.calculateStudentDiscount(itemFinalPrice, user);
        }

        totalPrice += itemFinalPrice;
    }

    // 쿠폰 할인 적용 (전체 금액에 대해)
    if (coupon) {
        totalPrice = applyCouponDiscount(totalPrice, coupon);
    }

    // 최대 할인율 제한 (70%까지)
    const originalTotal = orderItems.reduce((sum, item) => {
        const productPrice = item.unit_price || item.price || (item.product ? item.product.price : 0);
        const quantity = item.quantity || 1;
        return sum + (productPrice * quantity);
    }, 0);

    const totalDiscount = originalTotal - totalPrice;
    const maxDiscount = Math.floor(originalTotal * 0.7);
    
    if (totalDiscount > maxDiscount) {
        totalPrice = originalTotal - maxDiscount;
    }

    return Math.max(0, Math.floor(totalPrice));
};

