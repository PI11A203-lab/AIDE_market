module.exports = (sequelize, DataTypes) => {
    const SecurityEvent = sequelize.define("SecurityEvent", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        event_type: {
            type: DataTypes.ENUM('login_failed', 'bot_detected', 'api_abuse', 'scraping', 'suspicious_activity', 'ip_blocked'),
            allowNull: false,
            comment: '이벤트 유형'
        },
        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: false,
            comment: 'IP 주소'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '관련 사용자 ID',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        request_path: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: '요청 경로'
        },
        user_agent: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'User-Agent'
        },
        details: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: '추가 세부 정보'
        },
        severity: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            defaultValue: 'medium',
            comment: '심각도'
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
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'security_events',
        timestamps: false
    });

    // 관계 정의
    SecurityEvent.associate = (models) => {
        SecurityEvent.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return SecurityEvent;
};

