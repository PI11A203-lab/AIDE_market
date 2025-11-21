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
    };

    return Product;
};
