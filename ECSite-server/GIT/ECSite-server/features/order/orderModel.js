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
        subscription_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Subscriptions',
                key: 'subscription_id'
            },
            comment: '구독 ID'
        },
        is_recurring: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: '정기결제 여부'
        },
        is_first_payment: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: '최초 결제 여부'
        },
        parent_order_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Orders',
                key: 'id'
            },
            comment: '최초 주문 ID'
        }
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
        Order.belongsTo(models.Subscription, {
            foreignKey: 'subscription_id',
            as: 'subscription'
        });
        // 자기 참조: parent_order_id
        Order.belongsTo(models.Order, {
            foreignKey: 'parent_order_id',
            as: 'parentOrder'
        });
        Order.hasMany(models.Order, {
            foreignKey: 'parent_order_id',
            as: 'recurringOrders'
        });
    };
    
    return Order;
};

