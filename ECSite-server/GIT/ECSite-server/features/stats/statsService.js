const models = require("../../db/initializer");

// 전체 Stats 목록 조회
exports.getAllStats = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.Stats.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
    });
    
    // 상품 정보 조인으로 가져오기
    const statsWithProducts = await Promise.all(
        rows.map(async (stat) => {
            const statJson = stat.toJSON();
            const product = await models.Product.findByPk(stat.product_id, {
                attributes: ['id', 'name', 'price', 'seller', 'imageUrl']
            });
            return {
                ...statJson,
                product: product ? product.toJSON() : null
            };
        })
    );
    
    return {
        stats: statsWithProducts,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    };
};

// 특정 Stats 조회 (ID로)
exports.getStatsById = async (id) => {
    const stats = await models.Stats.findByPk(id);
    
    if (!stats) {
        return null;
    }
    
    const statJson = stats.toJSON();
    const product = await models.Product.findByPk(statJson.product_id, {
        attributes: ['id', 'name', 'price', 'seller', 'imageUrl']
    });
    
    return {
        ...statJson,
        product: product ? product.toJSON() : null
    };
};

// product_id로 Stats 조회
exports.getStatsByProductId = async (productId) => {
    const stats = await models.Stats.findOne({
        where: { product_id: productId }
    });
    
    if (!stats) {
        return null;
    }
    
    const statJson = stats.toJSON();
    const product = await models.Product.findByPk(productId, {
        attributes: ['id', 'name', 'price', 'seller', 'imageUrl']
    });
    
    return {
        ...statJson,
        product: product ? product.toJSON() : null
    };
};

// Stats 생성
exports.createStats = async (statsData) => {
    // 상품 존재 확인
    const product = await models.Product.findByPk(statsData.product_id);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    // 이미 해당 상품의 stats가 있는지 확인
    const existingStats = await models.Stats.findOne({
        where: { product_id: statsData.product_id }
    });
    
    if (existingStats) {
        throw new Error('이미 해당 상품의 통계가 존재합니다');
    }
    
    const stats = await models.Stats.create({
        product_id: statsData.product_id,
        teamwork: statsData.teamwork || 50,
        stability: statsData.stability || 50,
        speed: statsData.speed || 50,
        creativity: statsData.creativity || 50,
        productivity: statsData.productivity || 50,
        maintainability: statsData.maintainability || 50
    });
    
    return stats.toJSON();
};

// Stats 업데이트
exports.updateStats = async (id, statsData) => {
    const stats = await models.Stats.findByPk(id);
    if (!stats) {
        throw new Error('통계를 찾을 수 없습니다');
    }
    
    // product_id가 변경되는 경우, 새 product_id의 stats가 이미 있는지 확인
    if (statsData.product_id && statsData.product_id !== stats.product_id) {
        const existingStats = await models.Stats.findOne({
            where: { product_id: statsData.product_id }
        });
        if (existingStats) {
            throw new Error('이미 해당 상품의 통계가 존재합니다');
        }
        
        // 상품 존재 확인
        const product = await models.Product.findByPk(statsData.product_id);
        if (!product) {
            throw new Error('상품을 찾을 수 없습니다');
        }
    }
    
    await stats.update({
        ...(statsData.product_id && { product_id: statsData.product_id }),
        ...(statsData.teamwork !== undefined && { teamwork: statsData.teamwork }),
        ...(statsData.stability !== undefined && { stability: statsData.stability }),
        ...(statsData.speed !== undefined && { speed: statsData.speed }),
        ...(statsData.creativity !== undefined && { creativity: statsData.creativity }),
        ...(statsData.productivity !== undefined && { productivity: statsData.productivity }),
        ...(statsData.maintainability !== undefined && { maintainability: statsData.maintainability })
    });
    
    return stats.toJSON();
};

// Stats 삭제
exports.deleteStats = async (id) => {
    const stats = await models.Stats.findByPk(id);
    if (!stats) {
        throw new Error('통계를 찾을 수 없습니다');
    }
    
    await stats.destroy();
    return true;
};

// product_id로 Stats 생성 또는 업데이트 (upsert)
exports.upsertStatsByProductId = async (productId, statsData) => {
    // 상품 존재 확인
    const product = await models.Product.findByPk(productId);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    const [stats, created] = await models.Stats.findOrCreate({
        where: { product_id: productId },
        defaults: {
            teamwork: statsData.teamwork || 50,
            stability: statsData.stability || 50,
            speed: statsData.speed || 50,
            creativity: statsData.creativity || 50,
            productivity: statsData.productivity || 50,
            maintainability: statsData.maintainability || 50
        }
    });
    
    if (!created) {
        // 이미 존재하면 업데이트
        await stats.update({
            ...(statsData.teamwork !== undefined && { teamwork: statsData.teamwork }),
            ...(statsData.stability !== undefined && { stability: statsData.stability }),
            ...(statsData.speed !== undefined && { speed: statsData.speed }),
            ...(statsData.creativity !== undefined && { creativity: statsData.creativity }),
            ...(statsData.productivity !== undefined && { productivity: statsData.productivity }),
            ...(statsData.maintainability !== undefined && { maintainability: statsData.maintainability })
        });
    }
    
    return stats.toJSON();
};

// 마켓플레이스 전체 통계
exports.getOverview = async () => {
    const [
        totalProducts,
        totalCategories,
        totalSubCategories,
        totalTags,
        totalDownloads,
        totalViews,
        totalAIStats,
        totalSynergies
    ] = await Promise.all([
        models.Product.count(),
        models.Category.count({ where: { parentId: null } }),
        models.Category.count({ where: { parentId: { [models.sequelize.Op.ne]: null } } }),
        models.Tag.count(),
        models.Product.sum('download_count') || 0,
        models.Product.sum('view_count') || 0,
        models.Stats.count(),
        models.Synergy.count()
    ]);
    
    // 평균 평점 계산
    const avgRatingResult = await models.Product.findAll({
        attributes: [
            [models.sequelize.fn('AVG', models.sequelize.col('rating_average')), 'avgRating']
        ],
        raw: true
    });
    
    const averageRating = parseFloat(avgRatingResult[0]?.avgRating) || 0;
    
    // 가장 많은 상품을 가진 카테고리
    const topCategoryResult = await models.sequelize.query(
        `SELECT c.id, c.name_ja as name, COUNT(p.id) as product_count 
         FROM Categories c 
         LEFT JOIN Products p ON p.category_id = c.id 
         WHERE c.parentId IS NULL
         GROUP BY c.id, c.name_ja 
         ORDER BY product_count DESC 
         LIMIT 1`,
        { type: models.sequelize.QueryTypes.SELECT }
    );
    
    const topCategory = topCategoryResult[0] ? {
        id: topCategoryResult[0].id,
        name: topCategoryResult[0].name,
        product_count: topCategoryResult[0].product_count
    } : null;
    
    return {
        totalProducts,
        totalCategories,
        totalSubCategories,
        totalTags,
        totalDownloads: totalDownloads || 0,
        totalViews: totalViews || 0,
        averageRating: Math.round(averageRating * 100) / 100,
        totalAIStats,
        totalSynergies,
        topCategory
    };
};

