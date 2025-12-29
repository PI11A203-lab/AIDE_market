module.exports = (sequelize, DataTypes) => {
    const IpManagement = sequelize.define("IpManagement", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
            comment: 'IP 주소'
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: '차단 여부'
        },
        is_whitelisted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: '화이트리스트 여부'
        },
        block_reason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: '차단 사유'
        },
        memo: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: '관리 메모'
        },
        blocked_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '차단한 관리자 ID',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        blocked_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: '차단 일시'
        },
        tags: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: '태그 (콤마 구분)'
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'ip_management',
        timestamps: false,
        hooks: {
            beforeUpdate: (ipManagement) => {
                ipManagement.updated_at = new Date();
            }
        }
    });

    // 관계 정의
    IpManagement.associate = (models) => {
        IpManagement.belongsTo(models.User, {
            foreignKey: 'blocked_by',
            as: 'blocker'
        });
    };

    return IpManagement;
};

