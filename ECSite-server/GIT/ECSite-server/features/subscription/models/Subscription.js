// features/subscription/models/Subscription.js
module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define("Subscription", {
        subscription_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            comment: '사용자 ID'
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'id'
            },
            comment: '최초 주문 ID'
        },
        card_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CreditCards',
                key: 'card_id'
            },
            comment: '사용할 카드 ID'
        },
        status: {
            type: DataTypes.ENUM('active', 'paused', 'cancelled', 'failed'),
            allowNull: false,
            defaultValue: 'active'
        },
        next_payment_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: '다음 결제일 (매월 말일)'
        },
        last_payment_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        last_payment_status: {
            type: DataTypes.ENUM('success', 'failed', 'pending'),
            allowNull: true
        },
        coupon_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Coupons',
                key: 'coupon_id'
            }
        },
        grace_period_end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: '유예 기간 종료일 (결제 실패 후 3일)'
        },
        reminder_token: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: '이메일 링크용 토큰'
        },
        reminder_token_expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        user_language: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'ko',
            comment: '사용자 언어 (ko/en/ja)'
        }
    }, {
        tableName: 'subscriptions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    // 모델 간 관계 정의
    Subscription.associate = function(models) {
        Subscription.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Subscription.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        });
        Subscription.belongsTo(models.CreditCard, {
            foreignKey: 'card_id',
            as: 'creditCard'
        });
        Subscription.belongsTo(models.Coupon, {
            foreignKey: 'coupon_id',
            as: 'coupon'
        });
        Subscription.hasMany(models.SubscriptionItem, {
            foreignKey: 'subscription_id',
            as: 'items'
        });
        Subscription.hasMany(models.SubscriptionPayment, {
            foreignKey: 'subscription_id',
            as: 'payments'
        });
        Subscription.hasMany(models.SubscriptionNotification, {
            foreignKey: 'subscription_id',
            as: 'notifications'
        });
        Subscription.hasMany(models.ProductActivation, {
            foreignKey: 'subscription_id',
            as: 'activations'
        });
    };

    return Subscription;
};

