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

// ID로 태그 조회
exports.getTagById = async (req, res) => {
    try {
        const tag = await tagService.findTagById(req.params.id);
        if (!tag) {
            return res.status(404).json({ error: "태그를 찾을 수 없습니다" });
        }
        res.json({ tag });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "태그 조회 실패" });
    }
};

// 태그 생성
exports.createTag = async (req, res) => {
    try {
        const { name, description } = req.body;
        const tag = await tagService.createTag({ name, description });
        res.status(201).json({ tag });
    } catch (err) {
        console.error(err);
        if (err.message.includes('필수')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "태그 생성 실패" });
    }
};

// 태그 업데이트
exports.updateTag = async (req, res) => {
    try {
        const { name, description } = req.body;
        const tag = await tagService.updateTag(req.params.id, { name, description });
        res.json({ tag });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "태그 업데이트 실패" });
    }
};

// 태그 삭제
exports.deleteTag = async (req, res) => {
    try {
        await tagService.deleteTag(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('삭제할 수 없습니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "태그 삭제 실패" });
    }
};

