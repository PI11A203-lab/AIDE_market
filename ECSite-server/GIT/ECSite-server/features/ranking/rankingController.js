const rankingService = require("./rankingService");

// 월간 TOP 5 랭킹
exports.getMonthlyRankings = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || 2025;
        const month = parseInt(req.query.month) || 11;
        
        const rankings = await rankingService.getMonthlyRankings(year, month);
        res.json({ rankings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "랭킹 조회 실패" });
    }
};

