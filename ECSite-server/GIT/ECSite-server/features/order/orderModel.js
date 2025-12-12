// features/order/orderModel.js
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        order_number: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'refunded'),
            allowNull: true,
            defaultValue: 'pending',
        },
        total_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        payment_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'payment_methods',
                key: 'id'
            }
        },
    }, {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'purchased_at',
        updatedAt: false
    });
    
    // 모델 간 관계 정의
    Order.associate = function(models) {
        Order.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Order.belongsTo(models.PaymentMethod, {
            foreignKey: 'payment_id',
            as: 'paymentMethod'
        });
        Order.hasMany(models.OrderItem, {
            foreignKey: 'order_id',
            as: 'orderItems'
        });
        Order.hasMany(models.OrderCoupon, {
            foreignKey: 'order_id',
            as: 'orderCoupons'
        });
    };
    
    return Order;
};

