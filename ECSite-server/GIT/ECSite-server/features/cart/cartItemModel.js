// features/cart/cartItemModel.js
module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define("CartItem", {
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Carts',
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        }
    }, {
        tableName: 'cart_items',
        timestamps: true,
        createdAt: 'added_at',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['cart_id', 'product_id']
            },
            {
                fields: ['cart_id']
            }
        ]
    });

    CartItem.associate = function(models) {
        CartItem.belongsTo(models.Cart, {
            foreignKey: 'cart_id',
            as: 'cart'
        });
        CartItem.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return CartItem;
};

