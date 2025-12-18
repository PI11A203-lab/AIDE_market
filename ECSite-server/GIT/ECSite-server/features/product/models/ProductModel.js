// features/product/productModel.js
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
        },
        seller: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
        soldout: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: 0,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        sub_category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        download_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        view_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        rating_average: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            defaultValue: 0,
        },
        rating_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        tech_stack: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    });

    // アソシエーション（関連付け）を定義
    Product.associate = (models) => {
        // Product - Tag: 多対多
        Product.belongsToMany(models.Tag, {
            through: 'ProductTags',
            foreignKey: 'product_id',
            otherKey: 'tag_id',
            as: 'tags'
        });

        // Product - Category: 多対一
        Product.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category'
        });

        // Product - Category (サブカテゴリ): 多対一
        Product.belongsTo(models.Category, {
            foreignKey: 'sub_category_id',
            as: 'subcategory'
        });
        
        // Product - ProductFavorite: 一対多
        Product.hasMany(models.ProductFavorite, {
            foreignKey: 'product_id',
            as: 'favorites'
        });
        
        // Product - ProductReview: 一対多
        Product.hasMany(models.ProductReview, {
            foreignKey: 'product_id',
            as: 'reviews'
        });
        
        // Product - Stats: 一対一
        Product.hasOne(models.Stats, {
            foreignKey: 'product_id',
            as: 'stats'
        });
        
        // Product - Synergy: 一対多 (product_id)
        Product.hasMany(models.Synergy, {
            foreignKey: 'product_id',
            as: 'synergies'
        });
        
        // Product - OrderItem: 一対多
        Product.hasMany(models.OrderItem, {
            foreignKey: 'product_id',
            as: 'orderItems'
        });
        
        // Product - TeamMember: 一対多
        Product.hasMany(models.TeamMember, {
            foreignKey: 'product_id',
            as: 'teamMembers'
        });
        
        // Product - SubscriptionItem: 一対多
        Product.hasMany(models.SubscriptionItem, {
            foreignKey: 'product_id',
            as: 'subscriptionItems'
        });
        
        // Product - ProductActivation: 一対多
        Product.hasMany(models.ProductActivation, {
            foreignKey: 'product_id',
            as: 'activations'
        });
    };

    return Product;
};
