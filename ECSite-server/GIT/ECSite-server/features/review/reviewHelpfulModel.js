// features/review/reviewHelpfulModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("ReviewHelpful", {
        review_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'product_reviews',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
    }, {
        tableName: 'review_helpful',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false, // updated_at 없음
        indexes: [
            {
                unique: true,
                fields: ['review_id', 'user_id']
            }
        ]
    });
    
    // 모델 간 관계 정의
    ReviewHelpful.associate = function(models) {
        ReviewHelpful.belongsTo(models.ProductReview, {
            foreignKey: 'review_id',
            as: 'review'
        });
        ReviewHelpful.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };
    
    return ReviewHelpful;
};
