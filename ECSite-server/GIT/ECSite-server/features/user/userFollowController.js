const userFollowService = require("./userFollowService");

// 팔로우하기
exports.followUser = async (req, res) => {
    try {
        const followingId = parseInt(req.params.user_id);
        // follower_id는 body에서 받거나 req.user에서 가져옴 (인증 미들웨어 사용 시)
        const followerId = req.body.follower_id ? parseInt(req.body.follower_id) : (req.user ? req.user.id : null);
        
        if (!followerId) {
            return res.status(401).json({ error: "인증이 필요합니다" });
        }
        
        if (!followingId) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        const follow = await userFollowService.followUser(followerId, followingId);
        res.status(201).json({ result: true, follow });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        if (err.message.includes('이미') || err.message.includes('자기 자신')) {
            return res.status(400).json({ error: err.message });
        }
        if (err.message.includes('일반 사용자') || err.message.includes('관리자만')) {
            return res.status(403).json({ error: err.message });
        }
        res.status(500).json({ error: "팔로우 실패" });
    }
};

// 언팔로우하기
exports.unfollowUser = async (req, res) => {
    try {
        const followingId = parseInt(req.params.user_id);
        // follower_id는 body에서 받거나 req.user에서 가져옴 (인증 미들웨어 사용 시)
        const followerId = req.body.follower_id ? parseInt(req.body.follower_id) : (req.user ? req.user.id : null);
        
        if (!followerId) {
            return res.status(401).json({ error: "인증이 필요합니다" });
        }
        
        if (!followingId) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        await userFollowService.unfollowUser(followerId, followingId);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "언팔로우 실패" });
    }
};

// 팔로우 상태 확인
exports.getFollowStatus = async (req, res) => {
    try {
        const followingId = parseInt(req.params.user_id);
        // follower_id는 query 또는 req.user에서 가져옴
        const followerId = req.query.follower_id ? parseInt(req.query.follower_id) : (req.user ? req.user.id : null);
        
        if (!followingId) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        const status = await userFollowService.getFollowStatus(followerId, followingId);
        res.json(status);
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "팔로우 상태 확인 실패" });
    }
};

// 팔로워 목록 조회
exports.getFollowers = async (req, res) => {
    try {
        const userId = parseInt(req.params.user_id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        if (!userId) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        const result = await userFollowService.getFollowers(userId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('관리자만')) {
            return res.status(403).json({ error: err.message });
        }
        res.status(500).json({ error: "팔로워 목록 조회 실패" });
    }
};

// 팔로잉 목록 조회
exports.getFollowing = async (req, res) => {
    try {
        const userId = parseInt(req.params.user_id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        if (!userId) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        const result = await userFollowService.getFollowing(userId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('일반 사용자만')) {
            return res.status(403).json({ error: err.message });
        }
        res.status(500).json({ error: "팔로잉 목록 조회 실패" });
    }
};

