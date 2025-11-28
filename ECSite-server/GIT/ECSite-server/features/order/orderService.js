const models = require("../../db/initializer");
const crypto = require('crypto');

// 주문 번호 생성
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
}

// 카드 정보 암호화 (간단한 예시 - 실제로는 더 강력한 암호화 필요)
function encryptCardData(data) {
    if (!data) return null;
    try {
        // 실제 프로덕션에서는 더 강력한 암호화 방법 사용
        const algorithm = 'aes-256-cbc';
        
        // ENCRYPTION_KEY가 없으면 기본 키 사용 (개발 환경용)
        // 실제 프로덕션에서는 반드시 환경 변수로 설정해야 함
        let key;
        if (process.env.ENCRYPTION_KEY) {
            // 환경 변수에서 가져온 키를 32바이트로 변환
            key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
            if (key.length !== 32) {
                // 키 길이가 맞지 않으면 해시로 변환
                key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest();
            }
        } else {
            // 개발 환경용 기본 키 (실제 프로덕션에서는 절대 사용 금지)
            key = crypto.createHash('sha256').update('default-dev-key-aide-market').digest();
        }
        
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('카드 정보 암호화 실패:', error);
        // 암호화 실패 시 null 반환 (필요시 에러 처리)
        return null;
    }
}

// 전체 주문 목록 조회
exports.findAllOrders = async (page = 1, limit = 20, userId = null, status = null) => {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (userId) {
        where.user_id = parseInt(userId);
    }
    
    if (status) {
        where.status = status;
    }
    
    const { count, rows } = await models.Order.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['purchased_at', 'DESC']],
        include: [{
            model: models.User,
            as: 'user',
            attributes: ['id', 'username', 'email'],
            required: false
        }]
    });
    
    // 민감한 정보 제외
    const orders = rows.map(order => {
        const orderData = order.toJSON();
        delete orderData.card_number_encrypted;
        delete orderData.card_cvc_encrypted;
        return orderData;
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        orders: orders
    };
};

// ID로 주문 조회
exports.findOrderById = async (id) => {
    const order = await models.Order.findByPk(id, {
        include: [{
            model: models.User,
            as: 'user',
            attributes: ['id', 'username', 'email'],
            required: false
        }]
    });
    
    if (!order) {
        return null;
    }
    
    // 민감한 정보 제외
    const orderData = order.toJSON();
    delete orderData.card_number_encrypted;
    delete orderData.card_cvc_encrypted;
    
    return orderData;
};

// 주문 번호로 주문 조회
exports.findOrderByOrderNumber = async (orderNumber) => {
    const order = await models.Order.findOne({
        where: { order_number: orderNumber },
        include: [{
            model: models.User,
            as: 'user',
            attributes: ['id', 'username', 'email'],
            required: false
        }]
    });
    
    if (!order) {
        return null;
    }
    
    // 민감한 정보 제외
    const orderData = order.toJSON();
    delete orderData.card_number_encrypted;
    delete orderData.card_cvc_encrypted;
    
    return orderData;
};

// 사용자별 주문 목록 조회
exports.findOrdersByUserId = async (userId, page = 1, limit = 20) => {
    return await exports.findAllOrders(page, limit, userId, null);
};

// 주문 생성
exports.createOrder = async ({ user_id, total_amount, payment_method, card_company, card_number, card_cvc, exp_month, exp_year, card_id, status }) => {
    if (!user_id || total_amount === undefined || total_amount === null) {
        throw new Error('user_id와 total_amount는 필수입니다');
    }
    
    // 사용자 존재 확인
    let user;
    try {
        user = await models.User.findByPk(user_id);
    } catch (err) {
        console.error('사용자 조회 에러:', err);
        throw new Error('사용자 조회 중 오류가 발생했습니다: ' + err.message);
    }
    
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다 (user_id: ' + user_id + ')');
    }
    
    // 주문 번호 생성
    let orderNumber = generateOrderNumber();
    // 중복 확인 (매우 드물지만)
    let exists = await models.Order.findOne({ where: { order_number: orderNumber } });
    let attempts = 0;
    while (exists && attempts < 10) {
        orderNumber = generateOrderNumber();
        exists = await models.Order.findOne({ where: { order_number: orderNumber } });
        attempts++;
    }
    
    // 카드 정보 암호화 (제공된 경우)
    let cardNumberEncrypted = null;
    let cardCvcEncrypted = null;
    
    if (card_number) {
        cardNumberEncrypted = encryptCardData(card_number);
    }
    if (card_cvc) {
        cardCvcEncrypted = encryptCardData(card_cvc);
    }
    
    // status 유효성 검사
    const validStatuses = ['pending', 'completed', 'cancelled', 'refunded'];
    let finalStatus = status || 'pending';
    if (!validStatuses.includes(finalStatus)) {
        throw new Error('status는 pending, completed, cancelled, refunded 중 하나여야 합니다');
    }
    
    // card_company 유효성 검사
    if (card_company && !['VISA', 'Master', 'JCB', 'AMEX', 'Diners', 'etc'].includes(card_company)) {
        throw new Error('card_company는 VISA, Master, JCB, AMEX, Diners, etc 중 하나여야 합니다');
    }
    
    // total_amount 검증 및 변환
    const totalAmountInt = Math.round(parseFloat(total_amount));
    if (isNaN(totalAmountInt) || totalAmountInt < 0) {
        throw new Error('total_amount는 0 이상의 숫자여야 합니다');
    }
    
    // card_id 처리: credit_cards 테이블을 참조하는 외래 키 제약 조건이 있지만
    // 실제로는 payment_methods 테이블을 사용하므로 card_id를 null로 설정
    // 결제 정보는 이미 payment_method, card_company, exp_month, exp_year 등에 저장됨
    const finalCardId = null;
    
    let order;
    try {
        order = await models.Order.create({
            user_id: parseInt(user_id),
            order_number: orderNumber,
            total_amount: totalAmountInt,
            payment_method: payment_method || null,
            card_company: card_company || null,
            card_number_encrypted: cardNumberEncrypted,
            card_cvc_encrypted: cardCvcEncrypted,
            exp_month: exp_month ? parseInt(exp_month) : null,
            exp_year: exp_year ? parseInt(exp_year) : null,
            card_id: finalCardId, // null로 설정하여 외래 키 제약 조건 회피
            status: finalStatus
        });
    } catch (err) {
        console.error('주문 데이터베이스 생성 에러:', err);
        console.error('주문 데이터:', {
            user_id: parseInt(user_id),
            order_number: orderNumber,
            total_amount: parseInt(total_amount),
            payment_method: payment_method || null,
            card_company: card_company || null,
            exp_month: exp_month ? parseInt(exp_month) : null,
            exp_year: exp_year ? parseInt(exp_year) : null,
            card_id: card_id ? parseInt(card_id) : null,
            status: finalStatus
        });
        
        // Sequelize 에러 처리
        if (err.name === 'SequelizeValidationError') {
            throw new Error('주문 데이터 검증 실패: ' + err.errors.map(e => e.message).join(', '));
        } else if (err.name === 'SequelizeDatabaseError') {
            throw new Error('데이터베이스 오류: ' + err.message);
        } else if (err.name === 'SequelizeUniqueConstraintError') {
            throw new Error('주문 번호 중복: ' + orderNumber);
        }
        throw new Error('주문 생성 실패: ' + err.message);
    }
    
    // 민감한 정보 제외하고 반환
    const orderData = order.toJSON();
    delete orderData.card_number_encrypted;
    delete orderData.card_cvc_encrypted;
    
    return orderData;
};

// 주문 업데이트
exports.updateOrder = async (id, { status, payment_method, card_company, exp_month, exp_year, card_id }) => {
    const order = await models.Order.findByPk(id);
    if (!order) {
        throw new Error('주문을 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (status !== undefined) {
        const validStatuses = ['pending', 'completed', 'cancelled', 'refunded'];
        if (!validStatuses.includes(status)) {
            throw new Error('status는 pending, completed, cancelled, refunded 중 하나여야 합니다');
        }
        updateData.status = status;
    }
    
    if (payment_method !== undefined) {
        updateData.payment_method = payment_method || null;
    }
    
    if (card_company !== undefined) {
        if (card_company && !['VISA', 'Master', 'JCB', 'AMEX', 'Diners', 'etc'].includes(card_company)) {
            throw new Error('card_company는 VISA, Master, JCB, AMEX, Diners, etc 중 하나여야 합니다');
        }
        updateData.card_company = card_company || null;
    }
    
    if (exp_month !== undefined) {
        if (exp_month === null) {
            updateData.exp_month = null;
        } else {
            const month = parseInt(exp_month);
            if (month < 1 || month > 12) {
                throw new Error('exp_month는 1부터 12 사이의 값이어야 합니다');
            }
            updateData.exp_month = month;
        }
    }
    
    if (exp_year !== undefined) {
        if (exp_year === null) {
            updateData.exp_year = null;
        } else {
            const year = parseInt(exp_year);
            if (year < 2000 || year > 9999) {
                throw new Error('exp_year는 2000부터 9999 사이의 값이어야 합니다');
            }
            updateData.exp_year = year;
        }
    }
    
    if (card_id !== undefined) {
        updateData.card_id = card_id ? parseInt(card_id) : null;
    }
    
    await order.update(updateData);
    
    // 민감한 정보 제외하고 반환
    const orderData = order.toJSON();
    delete orderData.card_number_encrypted;
    delete orderData.card_cvc_encrypted;
    
    return orderData;
};

// 주문 삭제
exports.deleteOrder = async (id) => {
    const order = await models.Order.findByPk(id);
    if (!order) {
        throw new Error('주문을 찾을 수 없습니다');
    }
    
    await order.destroy();
    return true;
};

