const models = require("../../db/initializer");

// 전체 태그 목록 (상품 개수 포함)
exports.findAllTags = async () => {
    const tags = await models.Tag.findAll({
        attributes: ['id', 'name', 'description', 'createdAt', 'created_at'],
        order: [['createdAt', 'ASC']]
    });
    
    // 각 태그의 상품 개수 계산 (ProductTag 중간 테이블을 통해)
    const tagsWithCount = await Promise.all(
        tags.map(async (tag) => {
            // ProductTag 관계가 있다면 tag.getProducts().length 사용
            // 없다면 직접 쿼리
            let productCount = 0;
            try {
                productCount = await tag.countProducts ? await tag.countProducts() : 0;
            } catch (e) {
                // 관계가 정의되지 않은 경우 직접 쿼리
                const productTags = await models.sequelize.query(
                    'SELECT COUNT(*) as count FROM product_tags WHERE tag_id = :tagId',
                    {
                        replacements: { tagId: tag.id },
                        type: models.sequelize.QueryTypes.SELECT
                    }
                );
                productCount = productTags[0]?.count || 0;
            }
            
            return {
                id: tag.id,
                name: tag.name,
                description: tag.description,
                product_count: productCount,
                created_at: tag.created_at || tag.createdAt,
                createdAt: tag.createdAt || tag.created_at
            };
        })
    );
    
    return tagsWithCount;
};

// ID로 태그 조회
exports.findTagById = async (id) => {
    const tag = await models.Tag.findByPk(id);
    if (!tag) {
        return null;
    }
    
    const tagJson = tag.toJSON();
    
    // 상품 개수 계산
    const productTags = await models.sequelize.query(
        'SELECT COUNT(*) as count FROM product_tags WHERE tag_id = :tagId',
        {
            replacements: { tagId: id },
            type: models.sequelize.QueryTypes.SELECT
        }
    );
    
    return {
        ...tagJson,
        product_count: parseInt(productTags[0]?.count || 0)
    };
};

// 태그 생성
exports.createTag = async ({ name, description }) => {
    if (!name) {
        throw new Error('태그 이름은 필수입니다');
    }
    
    return await models.Tag.create({ 
        name, 
        description: description || null 
    });
};

// 태그 업데이트
exports.updateTag = async (id, { name, description }) => {
    const tag = await models.Tag.findByPk(id);
    if (!tag) {
        throw new Error('태그를 찾을 수 없습니다');
    }
    
    const updateData = {};
    if (name !== undefined) {
        updateData.name = name;
    }
    if (description !== undefined) {
        updateData.description = description;
    }
    
    await tag.update(updateData);
    return tag.toJSON();
};

// 태그 삭제
exports.deleteTag = async (id) => {
    const tag = await models.Tag.findByPk(id);
    if (!tag) {
        throw new Error('태그를 찾을 수 없습니다');
    }
    
    // 연결된 상품이 있는지 확인
    const productTags = await models.sequelize.query(
        'SELECT COUNT(*) as count FROM product_tags WHERE tag_id = :tagId',
        {
            replacements: { tagId: id },
            type: models.sequelize.QueryTypes.SELECT
        }
    );
    
    const productCount = parseInt(productTags[0]?.count || 0);
    if (productCount > 0) {
        throw new Error('연결된 상품이 있어 삭제할 수 없습니다');
    }
    
    await tag.destroy();
    return true;
};

