const models = require("../../db/initializer");
const crypto = require('crypto');

// 암호화 키 (실제 프로덕션에서는 환경변수로 관리해야 함)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars!!';
const ALGORITHM = 'aes-256-cbc';

// 암호화 함수
function encrypt(text) {
    if (!text) return null;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'utf8'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// 복호화 함수
function decrypt(encryptedText) {
    if (!encryptedText) return null;
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = parts.join(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'utf8'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// 사용자별 결제방법 목록 조회
exports.findByUserId = async (userId) => {
    const paymentMethods = await models.PaymentMethod.findAll({
        where: { user_id: userId },
        order: [['is_default', 'DESC'], ['created_at', 'DESC']],
        attributes: { exclude: ['card_number_encrypted', 'card_cvc_encrypted'] }
    });
    
    return paymentMethods.map(pm => {
        const data = pm.toJSON();
        // 카드 번호 마스킹 처리
        if (data.card_number_encrypted) {
            const decrypted = decrypt(data.card_number_encrypted);
            if (decrypted) {
                const last4 = decrypted.slice(-4);
                data.card_number = `****-****-****-${last4}`;
            }
        }
        return data;
    });
};

// ID로 결제방법 조회
exports.findById = async (id) => {
    const paymentMethod = await models.PaymentMethod.findByPk(id, {
        attributes: { exclude: ['card_number_encrypted', 'card_cvc_encrypted'] }
    });
    
    if (!paymentMethod) {
        return null;
    }
    
    const data = paymentMethod.toJSON();
    // 카드 번호 마스킹 처리
    if (data.card_number_encrypted) {
        const decrypted = decrypt(data.card_number_encrypted);
        if (decrypted) {
            const last4 = decrypted.slice(-4);
            data.card_number = `****-****-****-${last4}`;
        }
    }
    
    return data;
};

// 결제방법 생성
exports.createPaymentMethod = async ({ user_id, payment_method, card_company, card_number, card_cvc, exp_month, exp_year, is_default }) => {
    if (!user_id) {
        throw new Error('user_id는 필수입니다');
    }
    
    // 기본 결제방법으로 설정하는 경우, 다른 결제방법들의 is_default를 false로 변경
    if (is_default) {
        await models.PaymentMethod.update(
            { is_default: false },
            { where: { user_id } }
        );
    }
    
    const paymentMethod = await models.PaymentMethod.create({
        user_id,
        payment_method: payment_method || 'credit_card',
        card_company: card_company || null,
        card_number_encrypted: card_number ? encrypt(card_number) : null,
        card_cvc_encrypted: card_cvc ? encrypt(card_cvc) : null,
        exp_month: exp_month || null,
        exp_year: exp_year || null,
        is_default: is_default || false
    });
    
    // 반환 시 민감한 정보 제외
    const data = paymentMethod.toJSON();
    delete data.card_number_encrypted;
    delete data.card_cvc_encrypted;
    
    // 카드 번호 마스킹 처리
    if (card_number) {
        const last4 = card_number.slice(-4);
        data.card_number = `****-****-****-${last4}`;
    }
    
    return data;
};

// 결제방법 업데이트
exports.updatePaymentMethod = async (id, { card_company, card_number, card_cvc, exp_month, exp_year, is_default }) => {
    const paymentMethod = await models.PaymentMethod.findByPk(id);
    if (!paymentMethod) {
        throw new Error('결제방법을 찾을 수 없습니다');
    }
    
    // 기본 결제방법으로 설정하는 경우, 다른 결제방법들의 is_default를 false로 변경
    if (is_default) {
        await models.PaymentMethod.update(
            { is_default: false },
            { where: { user_id: paymentMethod.user_id, id: { [models.sequelize.Op.ne]: id } } }
        );
    }
    
    const updateData = {};
    if (card_company !== undefined) updateData.card_company = card_company;
    if (card_number !== undefined) updateData.card_number_encrypted = encrypt(card_number);
    if (card_cvc !== undefined) updateData.card_cvc_encrypted = encrypt(card_cvc);
    if (exp_month !== undefined) updateData.exp_month = exp_month;
    if (exp_year !== undefined) updateData.exp_year = exp_year;
    if (is_default !== undefined) updateData.is_default = is_default;
    
    await paymentMethod.update(updateData);
    
    // 반환 시 민감한 정보 제외
    const data = paymentMethod.toJSON();
    delete data.card_number_encrypted;
    delete data.card_cvc_encrypted;
    
    // 카드 번호 마스킹 처리
    if (card_number) {
        const last4 = card_number.slice(-4);
        data.card_number = `****-****-****-${last4}`;
    } else if (data.card_number_encrypted) {
        const decrypted = decrypt(data.card_number_encrypted);
        if (decrypted) {
            const last4 = decrypted.slice(-4);
            data.card_number = `****-****-****-${last4}`;
        }
    }
    
    return data;
};

// 결제방법 삭제
exports.deletePaymentMethod = async (id) => {
    const paymentMethod = await models.PaymentMethod.findByPk(id);
    if (!paymentMethod) {
        throw new Error('결제방법을 찾을 수 없습니다');
    }
    
    await paymentMethod.destroy();
    return true;
};

