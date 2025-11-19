const models = require("../../db/initializer");
const { Op } = require("sequelize");

// 월간 TOP 5 랭킹
exports.getMonthlyRankings = async (year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    // 점수 계산: (다운로드수 * 0.5) + (조회수 * 0.3) + (평점평균 * 평점개수 * 0.2)
    const rankings = await models.sequelize.query(
        `SELECT 
            p.id, 
            p.name, 
            p.price, 
            p.seller, 
            p.imageUrl, 
            p.download_count, 
            p.view_count, 
            p.rating_average, 
            p.rating_count,
            c.name_ja as category_name,
            ((p.download_count * 0.5) + (p.view_count * 0.3) + (p.rating_average * p.rating_count * 0.2)) as score
         FROM Products p
         LEFT JOIN Categories c ON p.category_id = c.id
         WHERE p.createdAt BETWEEN :startDate AND :endDate
         ORDER BY score DESC
         LIMIT 5`,
        {
            replacements: { startDate, endDate },
            type: models.sequelize.QueryTypes.SELECT
        }
    );
    
    return rankings.map((product, index) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        seller: product.seller,
        imageUrl: product.imageUrl,
        rank_position: index + 1,
        score: parseFloat(product.score).toFixed(2),
        category_name: product.category_name || null,
        download_count: product.download_count,
        rating_average: product.rating_average ? parseFloat(product.rating_average).toFixed(2) : null,
        rating_count: product.rating_count
    }));
};

