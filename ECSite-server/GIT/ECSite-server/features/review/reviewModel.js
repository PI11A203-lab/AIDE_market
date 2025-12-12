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
        title: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        review_text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        review_images: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
            comment: '리뷰 이미지 URL 배열'
        },
    }, {
        tableName: 'product_reviews',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    
    // 모델 간 관계 정의
    ProductReview.associate = function(models) {
        ProductReview.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        ProductReview.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
        ProductReview.belongsTo(models.OrderItem, {
            foreignKey: 'order_item_id',
            as: 'orderItem'
        });
        ProductReview.hasMany(models.ReviewHelpful, {
            foreignKey: 'review_id',
            as: 'helpfuls'
        });
    };
    
    return ProductReview;
};

