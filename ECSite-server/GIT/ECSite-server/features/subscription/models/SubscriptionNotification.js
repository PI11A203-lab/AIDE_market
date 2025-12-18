// features/subscription/models/SubscriptionNotification.js
module.exports = (sequelize, DataTypes) => {
    const SubscriptionNotification = sequelize.define("SubscriptionNotification", {
        notification_id: {
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
        notification_type: {
            type: DataTypes.ENUM('payment_reminder', 'payment_success', 'payment_failed', 'subscription_cancelled'),
            allowNull: false
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        email_sent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        email_sent_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'subscription_notifications',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    // 모델 간 관계 정의
    SubscriptionNotification.associate = function(models) {
        SubscriptionNotification.belongsTo(models.Subscription, {
            foreignKey: 'subscription_id',
            as: 'subscription'
        });
    };

    return SubscriptionNotification;
};

