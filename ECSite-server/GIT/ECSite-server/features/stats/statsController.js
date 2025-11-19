const statsService = require("./statsService");

// 마켓플레이스 전체 통계
exports.getOverview = async (req, res) => {
    try {
        const stats = await statsService.getOverview();
        res.json({ stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "통계 조회 실패" });
    }
};

