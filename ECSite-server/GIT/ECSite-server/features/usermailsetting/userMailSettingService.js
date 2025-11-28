const models = require("../../db/initializer");

// 사용자별 메일 설정 조회
exports.findMailSettingByUserId = async (userId) => {
    const mailSetting = await models.UserMailSetting.findOne({
        where: { user_id: parseInt(userId) }
    });
    
    if (!mailSetting) {
        return null;
    }
    
    // 비밀번호는 보안상 반환하지 않음
    const setting = mailSetting.toJSON();
    delete setting.smtp_password;
    
    return setting;
};

// ID로 메일 설정 조회
exports.findMailSettingById = async (id) => {
    const mailSetting = await models.UserMailSetting.findByPk(id);
    
    if (!mailSetting) {
        return null;
    }
    
    // 비밀번호는 보안상 반환하지 않음
    const setting = mailSetting.toJSON();
    delete setting.smtp_password;
    
    return setting;
};

// 전체 메일 설정 목록 조회 (관리자용)
exports.findAllMailSettings = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.UserMailSetting.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['updated_at', 'DESC']]
    });
    
    // 비밀번호는 보안상 반환하지 않음
    const settings = rows.map(setting => {
        const settingJson = setting.toJSON();
        delete settingJson.smtp_password;
        return settingJson;
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        mailSettings: settings
    };
};

// 메일 설정 생성 또는 업데이트 (upsert)
exports.upsertMailSetting = async ({ user_id, smtp_server, smtp_port, smtp_user, smtp_password, from_address, from_name, is_enabled }) => {
    if (!user_id) {
        throw new Error('user_id는 필수입니다');
    }
    
    // smtp_port 유효성 검사
    if (smtp_port !== undefined && smtp_port !== null) {
        const port = parseInt(smtp_port);
        if (isNaN(port) || port < 1 || port > 65535) {
            throw new Error('smtp_port는 1부터 65535 사이의 값이어야 합니다');
        }
    }
    
    // is_enabled는 boolean으로 변환
    let finalIsEnabled = false;
    if (is_enabled !== undefined && is_enabled !== null) {
        finalIsEnabled = Boolean(is_enabled);
    }
    
    const [mailSetting, created] = await models.UserMailSetting.upsert({
        user_id: parseInt(user_id),
        smtp_server: smtp_server || null,
        smtp_port: smtp_port ? parseInt(smtp_port) : null,
        smtp_user: smtp_user || null,
        smtp_password: smtp_password || null,
        from_address: from_address || null,
        from_name: from_name || null,
        is_enabled: finalIsEnabled
    }, {
        returning: true
    });
    
    // 비밀번호는 보안상 반환하지 않음
    const setting = mailSetting.toJSON();
    delete setting.smtp_password;
    
    return { mailSetting: setting, created };
};

// 메일 설정 업데이트
exports.updateMailSetting = async (id, { smtp_server, smtp_port, smtp_user, smtp_password, from_address, from_name, is_enabled }) => {
    const mailSetting = await models.UserMailSetting.findByPk(id);
    if (!mailSetting) {
        throw new Error('메일 설정을 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (smtp_server !== undefined) {
        updateData.smtp_server = smtp_server || null;
    }
    if (smtp_port !== undefined) {
        if (smtp_port === null) {
            updateData.smtp_port = null;
        } else {
            const port = parseInt(smtp_port);
            if (isNaN(port) || port < 1 || port > 65535) {
                throw new Error('smtp_port는 1부터 65535 사이의 값이어야 합니다');
            }
            updateData.smtp_port = port;
        }
    }
    if (smtp_user !== undefined) {
        updateData.smtp_user = smtp_user || null;
    }
    if (smtp_password !== undefined) {
        updateData.smtp_password = smtp_password || null;
    }
    if (from_address !== undefined) {
        updateData.from_address = from_address || null;
    }
    if (from_name !== undefined) {
        updateData.from_name = from_name || null;
    }
    if (is_enabled !== undefined) {
        updateData.is_enabled = Boolean(is_enabled);
    }
    
    await mailSetting.update(updateData);
    
    // 비밀번호는 보안상 반환하지 않음
    const setting = mailSetting.toJSON();
    delete setting.smtp_password;
    
    return setting;
};

// 메일 설정 삭제
exports.deleteMailSetting = async (id) => {
    const mailSetting = await models.UserMailSetting.findByPk(id);
    if (!mailSetting) {
        throw new Error('메일 설정을 찾을 수 없습니다');
    }
    
    await mailSetting.destroy();
    return true;
};

// 사용자 ID로 메일 설정 삭제
exports.deleteMailSettingByUserId = async (userId) => {
    const mailSetting = await models.UserMailSetting.findOne({
        where: { user_id: parseInt(userId) }
    });
    
    if (!mailSetting) {
        throw new Error('메일 설정을 찾을 수 없습니다');
    }
    
    await mailSetting.destroy();
    return true;
};

