const models = require("../../db/initializer");

// 전체 서브카테고리 목록 조회
exports.findAllSubCategories = async (page = 1, limit = 20, categoryId = null) => {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (categoryId) {
        where.category_id = parseInt(categoryId);
    }
    
    const { count, rows } = await models.SubCategory.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']],
        include: [{
            model: models.Category,
            as: 'category',
            attributes: ['id', 'name', 'name_ja']
        }]
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        subcategories: rows.map(sc => sc.toJSON())
    };
};

// ID로 서브카테고리 조회
exports.findSubCategoryById = async (id) => {
    const subCategory = await models.SubCategory.findByPk(id, {
        include: [{
            model: models.Category,
            as: 'category',
            attributes: ['id', 'name', 'name_ja']
        }]
    });
    
    if (!subCategory) {
        return null;
    }
    
    return subCategory.toJSON();
};

// 카테고리별 서브카테고리 목록 조회
exports.findSubCategoriesByCategoryId = async (categoryId) => {
    const subCategories = await models.SubCategory.findAll({
        where: { category_id: parseInt(categoryId) },
        order: [['name', 'ASC']],
        include: [{
            model: models.Category,
            as: 'category',
            attributes: ['id', 'name', 'name_ja']
        }]
    });
    
    return subCategories.map(sc => sc.toJSON());
};

// 서브카테고리 생성
exports.createSubCategory = async ({ category_id, name, tech_stack }) => {
    // 카테고리 존재 확인
    const category = await models.Category.findByPk(category_id);
    if (!category) {
        throw new Error('카테고리를 찾을 수 없습니다');
    }
    
    // 동일한 카테고리 내에서 이름 중복 확인
    const existing = await models.SubCategory.findOne({
        where: {
            category_id: parseInt(category_id),
            name: name
        }
    });
    
    if (existing) {
        throw new Error('해당 카테고리에 이미 같은 이름의 서브카테고리가 존재합니다');
    }
    
    const subCategory = await models.SubCategory.create({
        category_id: parseInt(category_id),
        name: name,
        tech_stack: tech_stack || null
    });
    
    return subCategory.toJSON();
};

// 서브카테고리 업데이트
exports.updateSubCategory = async (id, { category_id, name, tech_stack }) => {
    const subCategory = await models.SubCategory.findByPk(id);
    if (!subCategory) {
        throw new Error('서브카테고리를 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (category_id !== undefined) {
        const category = await models.Category.findByPk(category_id);
        if (!category) {
            throw new Error('카테고리를 찾을 수 없습니다');
        }
        updateData.category_id = parseInt(category_id);
    }
    
    if (name !== undefined) {
        // 카테고리가 변경되지 않는 경우 현재 카테고리에서, 변경되는 경우 새 카테고리에서 중복 확인
        const checkCategoryId = category_id !== undefined ? category_id : subCategory.category_id;
        const existing = await models.SubCategory.findOne({
            where: {
                category_id: parseInt(checkCategoryId),
                name: name,
                id: { [models.sequelize.Op.ne]: id }
            }
        });
        
        if (existing) {
            throw new Error('해당 카테고리에 이미 같은 이름의 서브카테고리가 존재합니다');
        }
        updateData.name = name;
    }
    
    if (tech_stack !== undefined) {
        updateData.tech_stack = tech_stack || null;
    }
    
    await subCategory.update(updateData);
    return subCategory.toJSON();
};

// 서브카테고리 삭제
exports.deleteSubCategory = async (id) => {
    const subCategory = await models.SubCategory.findByPk(id);
    if (!subCategory) {
        throw new Error('서브카테고리를 찾을 수 없습니다');
    }
    
    // 해당 서브카테고리를 사용하는 상품이 있는지 확인
    const productsCount = await models.Product.count({
        where: { sub_category_id: id }
    });
    
    if (productsCount > 0) {
        throw new Error(`이 서브카테고리를 사용하는 상품이 ${productsCount}개 있습니다. 삭제할 수 없습니다`);
    }
    
    await subCategory.destroy();
    return true;
};

