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
};
