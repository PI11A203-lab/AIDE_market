const userMailSettingService = require("./userMailSettingService");

// 사용자별 메일 설정 조회
exports.getMailSettingByUserId = async (req, res) => {
    try {
        const mailSetting = await userMailSettingService.findMailSettingByUserId(req.params.userId);
        if (!mailSetting) {
            return res.status(404).json({ error: "메일 설정을 찾을 수 없습니다" });
        }
        res.json({ mailSetting });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "메일 설정 조회 실패" });
    }
};

// ID로 메일 설정 조회
exports.getMailSettingById = async (req, res) => {
    try {
        const mailSetting = await userMailSettingService.findMailSettingById(req.params.id);
        if (!mailSetting) {
            return res.status(404).json({ error: "메일 설정을 찾을 수 없습니다" });
        }
        res.json({ mailSetting });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "메일 설정 조회 실패" });
    }
};

// 전체 메일 설정 목록 조회 (관리자용)
exports.getAllMailSettings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await userMailSettingService.findAllMailSettings(page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "메일 설정 목록 조회 실패" });
    }
};

// 메일 설정 생성 또는 업데이트 (upsert)
exports.upsertMailSetting = async (req, res) => {
    try {
        const { user_id, smtp_server, smtp_port, smtp_user, smtp_password, from_address, from_name, is_enabled } = req.body;
        
        if (!user_id) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        const { mailSetting, created } = await userMailSettingService.upsertMailSetting({
            user_id,
            smtp_server,
            smtp_port,
            smtp_user,
            smtp_password,
            from_address,
            from_name,
            is_enabled
        });
        
        res.status(created ? 201 : 200).json({ mailSetting, created });
    } catch (err) {
        console.error(err);
        if (err.message.includes('필수') || err.message.includes('smtp_port')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "메일 설정 저장 실패" });
    }
};

// 메일 설정 업데이트
exports.updateMailSetting = async (req, res) => {
    try {
        const { smtp_server, smtp_port, smtp_user, smtp_password, from_address, from_name, is_enabled } = req.body;
        
        const mailSetting = await userMailSettingService.updateMailSetting(req.params.id, {
            smtp_server,
            smtp_port,
            smtp_user,
            smtp_password,
            from_address,
            from_name,
            is_enabled
        });
        res.json({ mailSetting });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('smtp_port')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "메일 설정 업데이트 실패" });
    }
};

// 메일 설정 삭제
exports.deleteMailSetting = async (req, res) => {
    try {
        await userMailSettingService.deleteMailSetting(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "메일 설정 삭제 실패" });
    }
};

// 사용자 ID로 메일 설정 삭제
exports.deleteMailSettingByUserId = async (req, res) => {
    try {
        await userMailSettingService.deleteMailSettingByUserId(req.params.userId);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "메일 설정 삭제 실패" });
    }
};

