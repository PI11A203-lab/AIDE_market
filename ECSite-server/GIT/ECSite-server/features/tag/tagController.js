const tagService = require("./tagService");

// 전체 태그 목록
exports.getTags = async (req, res) => {
    try {
        const tags = await tagService.findAllTags();
        res.json({ tags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "태그 목록 조회 실패" });
    }
};

// 태그 생성
exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "태그 이름은 필수입니다" });
        }
        const tag = await tagService.createTag({ name });
        res.json({ tag });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "태그 생성 실패" });
    }
};

