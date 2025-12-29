module.exports = (sequelize, DataTypes) => {
    const IpAccessLog = sequelize.define("IpAccessLog", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: false,
            comment: 'IPv4 또는 IPv6'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '로그인한 사용자 ID (NULL 가능)',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        request_path: {
            type: DataTypes.STRING(500),
            allowNull: false,
            comment: '접속한 페이지 경로'
        },
        request_method: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: 'HTTP 메서드'
        },
        user_agent: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'User-Agent 헤더'
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: '국가명'
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: '도시명'
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: '차단 여부'
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'ip_access_logs',
        timestamps: false
    });

    // 관계 정의
    IpAccessLog.associate = (models) => {
        IpAccessLog.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return IpAccessLog;
};

