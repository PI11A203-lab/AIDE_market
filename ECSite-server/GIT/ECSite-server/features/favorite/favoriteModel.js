// features/favorite/favoriteModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("ProductFavorite", {
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
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
    }, {
        tableName: 'product_favorites',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'product_id']
            }
        ]
    });
};

