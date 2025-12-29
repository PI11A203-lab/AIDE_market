module.exports = (sequelize, DataTypes) => {
    const BotDetection = sequelize.define("BotDetection", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: false,
            comment: 'IP 주소'
        },
        user_agent: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'User-Agent'
        },
        detection_reason: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: '탐지 사유'
        },
        confidence_score: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0.00,
            comment: '탐지 신뢰도 (0-100)'
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: '차단 여부'
        },
        blocked_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: '차단 일시'
        },
        blocked_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '차단한 관리자 ID (자동 차단 시 NULL)',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'bot_detections',
        timestamps: false
    });

    // 관계 정의
    BotDetection.associate = (models) => {
        BotDetection.belongsTo(models.User, {
            foreignKey: 'blocked_by',
            as: 'blocker'
        });
    };

    return BotDetection;
};

