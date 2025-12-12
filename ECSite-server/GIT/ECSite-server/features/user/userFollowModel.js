// features/user/userFollowModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("UserFollow", {
        follower_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        following_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
    }, {
        tableName: 'user_follows',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['follower_id', 'following_id']
            },
            {
                fields: ['follower_id']
            },
            {
                fields: ['following_id']
            }
        ]
    });
    
    // 모델 간 관계 정의
    UserFollow.associate = function(models) {
        UserFollow.belongsTo(models.User, {
            foreignKey: 'follower_id',
            as: 'follower'
        });
        UserFollow.belongsTo(models.User, {
            foreignKey: 'following_id',
            as: 'following'
        });
    };
    
    return UserFollow;
};

