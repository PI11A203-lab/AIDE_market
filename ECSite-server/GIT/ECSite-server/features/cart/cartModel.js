// features/cart/cartModel.js
module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define("Cart", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('active', 'ordered'),
            allowNull: false,
            defaultValue: 'active'
        }
    }, {
        tableName: 'carts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['user_id', 'status']
            }
        ]
    });

    Cart.associate = function(models) {
        Cart.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Cart.hasMany(models.CartItem, {
            foreignKey: 'cart_id',
            as: 'cartItems'
        });
    };

    return Cart;
};

