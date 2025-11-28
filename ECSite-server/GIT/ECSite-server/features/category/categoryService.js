const models = require("../../db/initializer");

// 전체 카테고리 목록 (상품 개수 포함) - 메인 카테고리만 조회 (parentId IS NULL)
exports.findAllCategories = async () => {
    // 메인 카테고리만 조회하고, 각 카테고리의 실제 상품 개수를 계산
    const categories = await models.sequelize.query(
        `SELECT 
            c.id,
            c.name,
            c.name_ja,
            c.description,
            c.created_at,
            COALESCE(COUNT(DISTINCT p.id), 0) as product_count
         FROM Categories c
         LEFT JOIN Products p ON c.id = p.category_id AND p.soldout = 0
         WHERE c.parentId IS NULL
         GROUP BY c.id, c.name, c.name_ja, c.description, c.created_at
         ORDER BY c.id ASC`,
        {
            type: models.sequelize.QueryTypes.SELECT
        }
    );

    return categories.map(cat => ({
        id: parseInt(cat.id),
        name: cat.name,
        name_ja: cat.name_ja,
        description: cat.description,
        product_count: parseInt(cat.product_count || 0),
        created_at: cat.created_at
    }));
};

// 특정 카테고리의 서브카테고리 목록
exports.findSubcategories = async (categoryId) => {
    // 서브카테고리는 Categories 테이블에서 parentId로 구분
    // 각 서브카테고리의 실제 상품 개수를 계산
    const subcategories = await models.sequelize.query(
        `SELECT 
            c.id,
            c.category_id,
            c.name,
            c.tech_stack,
            c.created_at,
            COALESCE(COUNT(DISTINCT p.id), 0) as product_count
         FROM Categories c
         LEFT JOIN Products p ON c.id = p.sub_category_id AND p.soldout = 0
         WHERE c.parentId = :categoryId
         GROUP BY c.id, c.category_id, c.name, c.tech_stack, c.created_at
         ORDER BY c.id ASC`,
        {
            replacements: { categoryId: parseInt(categoryId) },
            type: models.sequelize.QueryTypes.SELECT
        }
    ).catch(() => []); // 에러 시 빈 배열 반환

    return subcategories.map(cat => ({
        id: parseInt(cat.id),
        category_id: parseInt(cat.category_id || categoryId),
        name: cat.name,
        tech_stack: cat.tech_stack || null,
        product_count: parseInt(cat.product_count || 0),
        created_at: cat.created_at
    }));
};

// ID로 카테고리 조회
exports.findCategoryById = async (id) => {
    const category = await models.Category.findByPk(id);
    if (!category) {
        return null;
    }
    
    const categoryJson = category.toJSON();
    
    // 상품 개수 계산
    const productCount = await models.Product.count({
        where: {
            category_id: id,
            soldout: 0
        }
    });
    
    return {
        ...categoryJson,
        product_count: productCount
    };
};

// 카테고리 생성
exports.createCategory = async ({ name, name_ja, description, parentId, category_id, tech_stack }) => {
    return await models.Category.create({ 
        name, 
        name_ja, 
        description,
        parentId,
        category_id,
        tech_stack
    });
};

// 카테고리 업데이트
exports.updateCategory = async (id, { name, name_ja, description, parentId, category_id, tech_stack }) => {
    const category = await models.Category.findByPk(id);
    if (!category) {
        throw new Error('카테고리를 찾을 수 없습니다');
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (name_ja !== undefined) updateData.name_ja = name_ja;
    if (description !== undefined) updateData.description = description;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (tech_stack !== undefined) updateData.tech_stack = tech_stack;
    
    await category.update(updateData);
    return category.toJSON();
};

// 카테고리 삭제
exports.deleteCategory = async (id) => {
    const category = await models.Category.findByPk(id);
    if (!category) {
        throw new Error('카테고리를 찾을 수 없습니다');
    }
    
    // 하위 카테고리나 상품이 있는지 확인
    const subcategoriesCount = await models.Category.count({ where: { parentId: id } });
    const productsCount = await models.Product.count({ 
        where: { 
            [models.sequelize.Op.or]: [
                { category_id: id },
                { sub_category_id: id }
            ]
        }
    });
    
    if (subcategoriesCount > 0 || productsCount > 0) {
        throw new Error('하위 카테고리나 상품이 있어 삭제할 수 없습니다');
    }
    
    await category.destroy();
    return true;
};

// 메인 페이지용: 카테고리 목록과 각 카테고리의 대표 상품
exports.findAllCategoriesWithFeaturedProducts = async (productsLimit = 4) => {
    // 메인 카테고리 목록과 정확한 상품 개수 조회
    const categories = await exports.findAllCategories();
    
    const categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
            // 각 카테고리의 대표 상품 조회 (카테고리명 포함)
            const products = await models.sequelize.query(
                `SELECT 
                    p.id,
                    p.name,
                    p.price,
                    p.seller,
                    p.imageUrl,
                    p.soldout,
                    p.download_count,
                    p.view_count,
                    p.rating_average,
                    p.rating_count,
                    c.name_ja as category_name,
                    sc.name as subcategory_name
                 FROM Products p
                 LEFT JOIN Categories c ON p.category_id = c.id
                 LEFT JOIN Categories sc ON p.sub_category_id = sc.id
                 WHERE p.category_id = :categoryId AND p.soldout = 0
                 ORDER BY p.download_count DESC, p.rating_average DESC
                 LIMIT :limit`,
                {
                    replacements: { 
                        categoryId: category.id, 
                        limit: parseInt(productsLimit) 
                    },
                    type: models.sequelize.QueryTypes.SELECT
                }
            );

            return {
                ...category,
                featured_products: products.map(p => ({
                    ...p,
                    category_name: p.category_name || null,
                    subcategory_name: p.subcategory_name || null
                }))
            };
        })
    );

    return categoriesWithProducts;
};