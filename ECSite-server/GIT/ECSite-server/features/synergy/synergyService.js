const models = require("../../db/initializer");

// 상품별 시너지 목록 조회
exports.findSynergiesByProductId = async (productId, limit = null) => {
    const options = {
        where: { product_id: productId },
        order: [['synergy_score', 'DESC']]
    };
    
    if (limit) {
        options.limit = parseInt(limit);
    }
    
    const synergies = await models.Synergy.findAll(options);
    
    // 상품 정보 조인
    const synergiesWithProducts = await Promise.all(
        synergies.map(async (synergy) => {
            const synergyJson = synergy.toJSON();
            const product = await models.Product.findByPk(synergy.related_product_id, {
                attributes: ['id', 'name', 'price', 'seller', 'description', 'imageUrl', 'download_count', 'view_count', 'rating_average', 'rating_count']
            });
            return {
                ...synergyJson,
                product: product ? product.toJSON() : null
            };
        })
    );
    
    return synergiesWithProducts;
};

// ID로 시너지 조회
exports.findSynergyById = async (id) => {
    const synergy = await models.Synergy.findByPk(id);
    if (!synergy) {
        return null;
    }
    
    const synergyJson = synergy.toJSON();
    const product = await models.Product.findByPk(synergy.related_product_id, {
        attributes: ['id', 'name', 'price', 'seller', 'imageUrl']
    });
    const mainProduct = await models.Product.findByPk(synergy.product_id, {
        attributes: ['id', 'name', 'price', 'seller', 'imageUrl']
    });
    
    return {
        ...synergyJson,
        product: product ? product.toJSON() : null,
        main_product: mainProduct ? mainProduct.toJSON() : null
    };
};

// 시너지 생성
exports.createSynergy = async (productId, relatedProductId, synergyScore = 80, synergyDescription = null) => {
    // 상품 존재 확인
    const product = await models.Product.findByPk(productId);
    const relatedProduct = await models.Product.findByPk(relatedProductId);
    
    if (!product || !relatedProduct) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    // 자기 자신과의 시너지는 불가
    if (productId === relatedProductId) {
        throw new Error('같은 상품과의 시너지는 생성할 수 없습니다');
    }
    
    // 이미 존재하는지 확인
    const existing = await models.Synergy.findOne({
        where: {
            product_id: productId,
            related_product_id: relatedProductId
        }
    });
    
    if (existing) {
        throw new Error('이미 해당 시너지가 존재합니다');
    }
    
    const synergy = await models.Synergy.create({
        product_id: productId,
        related_product_id: relatedProductId,
        synergy_score: synergyScore || 80,
        synergy_description: synergyDescription
    });
    
    return synergy.toJSON();
};

// 시너지 업데이트
exports.updateSynergy = async (id, { synergy_score, synergy_description }) => {
    const synergy = await models.Synergy.findByPk(id);
    if (!synergy) {
        throw new Error('시너지를 찾을 수 없습니다');
    }
    
    const updateData = {};
    if (synergy_score !== undefined) {
        if (synergy_score < 0 || synergy_score > 100) {
            throw new Error('시너지 점수는 0부터 100 사이여야 합니다');
        }
        updateData.synergy_score = synergy_score;
    }
    if (synergy_description !== undefined) {
        updateData.synergy_description = synergy_description;
    }
    
    await synergy.update(updateData);
    return synergy.toJSON();
};

// 시너지 삭제
exports.deleteSynergy = async (id) => {
    const synergy = await models.Synergy.findByPk(id);
    if (!synergy) {
        throw new Error('시너지를 찾을 수 없습니다');
    }
    
    await synergy.destroy();
    return true;
};

