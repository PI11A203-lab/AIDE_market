// features/review/reviewModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("ProductReview", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        order_item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        rating: {
            type: DataTypes.DECIMAL(2, 1),
            allowNull: false,
            validate: {
                min: 1.0,
                max: 5.0
            }
        },
        review_text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'product_reviews',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};

