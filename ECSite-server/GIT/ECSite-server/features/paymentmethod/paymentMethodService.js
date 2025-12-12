const models = require("../../db/initializer");
const { Op } = require('sequelize');
const crypto = require('crypto');

// 암호화 키 (실제 프로덕션에서는 환경변수로 관리해야 함)
const getEncryptionKey = () => {
    if (process.env.ENCRYPTION_KEY) {
        const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
        if (key.length === 32) {
            return key;
        }
        return crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest();
    }
    // 개발 환경용 기본 키 (실제 프로덕션에서는 절대 사용 금지)
    return crypto.createHash('sha256').update('default-dev-key-aide-market').digest();
};

const ALGORITHM = 'aes-256-cbc';

// 암호화 함수
function encrypt(text) {
    if (!text) return null;
    try {
        const key = getEncryptionKey();
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('암호화 실패:', error);
        return null;
    }
}

// 복호화 함수
function decrypt(encryptedText) {
    if (!encryptedText) return null;
    try {
        const key = getEncryptionKey();
        const parts = encryptedText.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const encrypted = parts.join(':');
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('복호화 실패:', error);
        return null;
    }
}

// 사용자별 결제수단 목록 조회
exports.findByUserId = async (userId) => {
    const paymentMethods = await models.PaymentMethod.findAll({
        where: { user_id: userId },
        order: [['is_default', 'DESC'], ['created_at', 'DESC']],
        include: [{
            model: models.CreditCard,
            as: 'creditCard',
            required: false,
            attributes: ['card_id', 'card_company', 'card_holder', 'exp_month', 'exp_year']
        }]
    });
    
    return paymentMethods.map(pm => {
        const data = pm.toJSON();
        // 카드 정보가 있는 경우 마스킹 처리
        if (data.creditCard && data.creditCard.card_number_encrypted) {
            const decrypted = decrypt(data.creditCard.card_number_encrypted);
            if (decrypted) {
                const last4 = decrypted.slice(-4);
                data.card_number = `****-****-****-${last4}`;
            }
        }
        // 민감한 정보 제외
        if (data.creditCard) {
            delete data.creditCard.card_number_encrypted;
            delete data.creditCard.cvc_encrypted;
        }
        return data;
    });
};

// ID로 결제수단 조회
exports.findById = async (id) => {
    const paymentMethod = await models.PaymentMethod.findByPk(id, {
        include: [{
            model: models.CreditCard,
            as: 'creditCard',
            required: false,
            attributes: ['card_id', 'card_company', 'card_holder', 'exp_month', 'exp_year']
        }]
    });
    
    if (!paymentMethod) {
        return null;
    }
    
    const data = paymentMethod.toJSON();
    // 카드 정보가 있는 경우 마스킹 처리
    if (data.creditCard && data.creditCard.card_number_encrypted) {
        const decrypted = decrypt(data.creditCard.card_number_encrypted);
        if (decrypted) {
            const last4 = decrypted.slice(-4);
            data.card_number = `****-****-****-${last4}`;
        }
    }
    // 민감한 정보 제외
    if (data.creditCard) {
        delete data.creditCard.card_number_encrypted;
        delete data.creditCard.cvc_encrypted;
    }
    
    return data;
};

// 결제수단 등록
exports.createPaymentMethod = async ({ user_id, payment_method, card_company, card_holder, card_number, cvc, exp_month, exp_year, is_default }) => {
    if (!user_id) {
        throw new Error('user_id는 필수입니다');
    }
    
    // 사용자 존재 확인
    const user = await models.User.findByPk(user_id);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }
    
    // 트랜잭션으로 일관성 보장
    const transaction = await models.sequelize.transaction();
    
    try {
        // 기본 결제수단으로 설정하는 경우, 다른 결제수단들의 is_default를 false로 변경
        if (is_default) {
            await models.PaymentMethod.update(
                { is_default: false },
                { where: { user_id }, transaction }
            );
        }
        
        let cardId = null;
        
        // 카드 정보가 제공된 경우 credit_cards 테이블에 저장
        if (card_number || cvc || card_company || card_holder || exp_month || exp_year) {
            if (!card_number || !cvc) {
                throw new Error('카드 번호와 CVC는 필수입니다');
            }
            
            // 카드 정보 암호화
            const cardNumberEncrypted = encrypt(card_number);
            const cvcEncrypted = encrypt(cvc);
            
            if (!cardNumberEncrypted || !cvcEncrypted) {
                throw new Error('카드 정보 암호화에 실패했습니다');
            }
            
            // credit_cards 테이블에 저장
            const creditCard = await models.CreditCard.create({
                user_id,
                card_company: card_company || null,
                card_holder: card_holder || '',  // NULL 대신 빈 문자열 사용
                card_number_encrypted: cardNumberEncrypted,
                cvc_encrypted: cvcEncrypted,
                exp_month: exp_month ? parseInt(exp_month) : null,
                exp_year: exp_year ? parseInt(exp_year) : null
            }, { transaction });
            
            cardId = creditCard.card_id;
        }
        
        // payment_methods 테이블에 저장
        const paymentMethod = await models.PaymentMethod.create({
            user_id,
            payment_method: payment_method || 'credit_card',
            is_default: is_default || false,
            card_id: cardId
        }, { transaction });
        
        // 트랜잭션 커밋
        await transaction.commit();
        
        // 반환 데이터 구성
        const data = paymentMethod.toJSON();
        
        // 카드 정보가 있는 경우 포함
        if (cardId) {
            const creditCard = await models.CreditCard.findByPk(cardId);
            if (creditCard) {
                const cardData = creditCard.toJSON();
                // 카드 번호 마스킹 처리
                if (cardData.card_number_encrypted) {
                    const decrypted = decrypt(cardData.card_number_encrypted);
                    if (decrypted) {
                        const last4 = decrypted.slice(-4);
                        data.card_number = `****-****-****-${last4}`;
                    }
                }
                data.card_company = cardData.card_company;
                data.card_holder = cardData.card_holder;
                data.exp_month = cardData.exp_month;
                data.exp_year = cardData.exp_year;
            }
        }
        
        return data;
    } catch (error) {
        // 에러 발생 시 롤백
        await transaction.rollback();
        throw error;
    }
};

// 결제수단 업데이트
exports.updatePaymentMethod = async (id, { card_company, card_holder, card_number, cvc, exp_month, exp_year, is_default }) => {
    const paymentMethod = await models.PaymentMethod.findByPk(id);
    if (!paymentMethod) {
        throw new Error('결제수단을 찾을 수 없습니다');
    }
    
    // 기본 결제수단으로 설정하는 경우, 다른 결제수단들의 is_default를 false로 변경
    if (is_default) {
        await models.PaymentMethod.update(
            { is_default: false },
            { where: { user_id: paymentMethod.user_id, id: { [Op.ne]: id } } }
        );
    }
    
    const updateData = {};
    if (is_default !== undefined) updateData.is_default = is_default;
    
    // 카드 정보 업데이트
    if (card_number || cvc || card_company || card_holder || exp_month !== undefined || exp_year !== undefined) {
        let cardId = paymentMethod.card_id;
        
        // 기존 카드가 없으면 새로 생성
        if (!cardId) {
            if (!card_number || !cvc) {
                throw new Error('카드 번호와 CVC는 필수입니다');
            }
            
            const cardNumberEncrypted = encrypt(card_number);
            const cvcEncrypted = encrypt(cvc);
            
            if (!cardNumberEncrypted || !cvcEncrypted) {
                throw new Error('카드 정보 암호화에 실패했습니다');
            }
            
            const creditCard = await models.CreditCard.create({
                user_id: paymentMethod.user_id,
                card_company: card_company || null,
                card_holder: card_holder || '',  // NULL 대신 빈 문자열 사용
                card_number_encrypted: cardNumberEncrypted,
                cvc_encrypted: cvcEncrypted,
                exp_month: exp_month ? parseInt(exp_month) : null,
                exp_year: exp_year ? parseInt(exp_year) : null
            });
            
            cardId = creditCard.card_id;
            updateData.card_id = cardId;
        } else {
            // 기존 카드 정보 업데이트
            const creditCard = await models.CreditCard.findByPk(cardId);
            if (creditCard) {
                const cardUpdateData = {};
                if (card_company !== undefined) cardUpdateData.card_company = card_company;
                if (card_holder !== undefined) cardUpdateData.card_holder = card_holder;
                if (card_number) {
                    const cardNumberEncrypted = encrypt(card_number);
                    if (cardNumberEncrypted) {
                        cardUpdateData.card_number_encrypted = cardNumberEncrypted;
                    }
                }
                if (cvc) {
                    const cvcEncrypted = encrypt(cvc);
                    if (cvcEncrypted) {
                        cardUpdateData.cvc_encrypted = cvcEncrypted;
                    }
                }
                if (exp_month !== undefined) cardUpdateData.exp_month = exp_month ? parseInt(exp_month) : null;
                if (exp_year !== undefined) cardUpdateData.exp_year = exp_year ? parseInt(exp_year) : null;
                
                await creditCard.update(cardUpdateData);
            }
        }
    }
    
    await paymentMethod.update(updateData);
    
    // 반환 데이터 구성
    const data = paymentMethod.toJSON();
    
    // 카드 정보 포함
    if (paymentMethod.card_id) {
        const creditCard = await models.CreditCard.findByPk(paymentMethod.card_id);
        if (creditCard) {
            const cardData = creditCard.toJSON();
            // 카드 번호 마스킹 처리
            if (cardData.card_number_encrypted) {
                const decrypted = decrypt(cardData.card_number_encrypted);
                if (decrypted) {
                    const last4 = decrypted.slice(-4);
                    data.card_number = `****-****-****-${last4}`;
                }
            }
            data.card_company = cardData.card_company;
            data.card_holder = cardData.card_holder;
            data.exp_month = cardData.exp_month;
            data.exp_year = cardData.exp_year;
        }
    }
    
    return data;
};

// 결제수단 삭제
exports.deletePaymentMethod = async (id) => {
    const paymentMethod = await models.PaymentMethod.findByPk(id);
    if (!paymentMethod) {
        throw new Error('결제수단을 찾을 수 없습니다');
    }
    
    // 카드 정보도 함께 삭제 (다른 결제수단에서 사용하지 않는 경우)
    if (paymentMethod.card_id) {
        const otherPaymentMethod = await models.PaymentMethod.findOne({
            where: {
                card_id: paymentMethod.card_id,
                id: { [Op.ne]: id }
            }
        });
        
        // 다른 결제수단에서 사용하지 않으면 카드 정보 삭제
        if (!otherPaymentMethod) {
            await models.CreditCard.destroy({
                where: { card_id: paymentMethod.card_id }
            });
        }
    }
    
    await paymentMethod.destroy();
    return true;
};
