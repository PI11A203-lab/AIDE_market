const userService = require("./userService");

// 전체 사용자 목록 조회
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await userService.findAllUsers(page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "사용자 목록 조회 실패" });
    }
};

// 사용자(판매자)별 등록 상품 목록 조회
exports.getProductsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await userService.findProductsByUserId(userId);
        if (!result) {
            return res.status(404).json({ error: "사용자를 찾을 수 없습니다" });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "상품 목록 조회 실패" });
    }
};

// ID로 사용자 조회
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "사용자를 찾을 수 없습니다" });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "사용자 조회 실패" });
    }
};

// 사용자명으로 사용자 조회
exports.getUserByUsername = async (req, res) => {
    try {
        const user = await userService.findUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ error: "사용자를 찾을 수 없습니다" });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "사용자 조회 실패" });
    }
};

// 사용자 생성
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role, profile_image } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: "username, email, password는 필수입니다" });
        }
        
        const user = await userService.createUser({
            username,
            email,
            password,
            role,
            profile_image
        });
        res.status(201).json({ user });
    } catch (err) {
        console.error(err);
        if (err.message.includes('필수') || err.message.includes('이미 사용') || err.message.includes('role은')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "사용자 생성 실패" });
    }
};

// 사용자 업데이트
exports.updateUser = async (req, res) => {
    try {
        const { username, email, password, role, profile_image, is_email_public, bio, github_url, developer_type, tags } = req.body;
        
        console.log('사용자 업데이트 요청:', {
            userId: req.params.id,
            developer_type: developer_type,
            body: req.body
        });
        
        const user = await userService.updateUser(req.params.id, {
            username,
            email,
            password,
            role,
            profile_image,
            is_email_public,
            bio,
            github_url,
            developer_type
        });
        
        // 태그 업데이트 (태그가 제공된 경우)
        if (tags !== undefined) {
            await userService.updateUserTags(req.params.id, Array.isArray(tags) ? tags : []);
        }
        
        // 업데이트된 사용자 정보 다시 가져오기 (태그 포함)
        const updatedUser = await userService.findUserById(req.params.id);
        
        res.json({ user: updatedUser });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이미 사용') || err.message.includes('role은')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "사용자 업데이트 실패" });
    }
};

// 사용자 삭제
exports.deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "사용자 삭제 실패" });
    }
};

// 비밀번호 검증
exports.validatePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.params.id;
        
        if (!password) {
            return res.status(400).json({ error: "password는 필수입니다" });
        }
        
        const isValid = await userService.validatePassword(userId, password);
        res.json({ valid: isValid });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "비밀번호 검증 실패" });
    }
};

// 비밀번호 재설정 요청
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "email은 필수입니다" });
        }
        
        const result = await userService.requestPasswordReset(email);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "비밀번호 재설정 요청 실패" });
    }
};

// 인증 코드 검증
exports.verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        
        if (!email || !code) {
            return res.status(400).json({ error: "email과 code는 필수입니다" });
        }
        
        const result = await userService.verifyResetCode(email, code);
        res.json(result);
    } catch (err) {
        console.error(err);
        if (err.message.includes('인증 코드') || err.message.includes('만료') || err.message.includes('일치하지 않습니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "인증 코드 검증 실패" });
    }
};

// 비밀번호 재설정 (토큰으로)
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        
        if (!resetToken || !newPassword) {
            return res.status(400).json({ error: "resetToken과 newPassword는 필수입니다" });
        }
        
        if (newPassword.length < 8) {
            return res.status(400).json({ error: "비밀번호는 최소 8자 이상이어야 합니다" });
        }
        
        const result = await userService.resetPassword(resetToken, newPassword);
        res.json(result);
    } catch (err) {
        console.error(err);
        if (err.message.includes('유효하지 않거나 만료된') || err.message.includes('만료되었습니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "비밀번호 재설정 실패" });
    }
};

