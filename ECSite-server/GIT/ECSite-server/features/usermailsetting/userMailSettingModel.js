// features/usermailsetting/userMailSettingModel.js
module.exports = (sequelize, DataTypes) => {
    const UserMailSetting = sequelize.define("UserMailSetting", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        smtp_server: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        smtp_port: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        smtp_user: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        smtp_password: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        from_address: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        from_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        is_enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    }, {
        tableName: 'user_mail_settings',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_at'
    });
    
    // 모델 간 관계 정의
    UserMailSetting.associate = function(models) {
        UserMailSetting.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };
    
    return UserMailSetting;
};

