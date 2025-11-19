const models = require("../../db/initializer");

// 전체 태그 목록 (상품 개수 포함)
exports.findAllTags = async () => {
    const tags = await models.Tag.findAll({
        attributes: ['id', 'name', 'created_at'],
        order: [['created_at', 'ASC']]
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
                    'SELECT COUNT(*) as count FROM ProductTags WHERE tag_id = :tagId',
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
                product_count: productCount,
                created_at: tag.created_at
            };
        })
    );
    
    return tagsWithCount;
};

// 태그 생성
exports.createTag = async ({ name }) => {
    return await models.Tag.create({ name });
};

