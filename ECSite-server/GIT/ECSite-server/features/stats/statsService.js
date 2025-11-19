const models = require("../../db/initializer");

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

