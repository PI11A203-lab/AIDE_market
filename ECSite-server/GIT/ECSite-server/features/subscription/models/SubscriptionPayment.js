// features/subscription/models/SubscriptionPayment.js
module.exports = (sequelize, DataTypes) => {
    const SubscriptionPayment = sequelize.define("SubscriptionPayment", {
        payment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        subscription_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Subscriptions',
                key: 'subscription_id'
            }
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Orders',
                key: 'id'
            },
            comment: '생성된 주문 ID'
        },
        payment_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('success', 'failed', 'pending', 'refunded'),
            allowNull: false,
            defaultValue: 'pending'
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        failure_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        retry_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        is_first_payment: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'subscription_payments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    // 모델 간 관계 정의
    SubscriptionPayment.associate = function(models) {
        SubscriptionPayment.belongsTo(models.Subscription, {
            foreignKey: 'subscription_id',
            as: 'subscription'
        });
        SubscriptionPayment.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        });
    };

    return SubscriptionPayment;
};

