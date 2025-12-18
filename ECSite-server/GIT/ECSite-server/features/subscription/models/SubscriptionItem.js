// features/subscription/models/SubscriptionItem.js
module.exports = (sequelize, DataTypes) => {
    const SubscriptionItem = sequelize.define("SubscriptionItem", {
        subscription_item_id: {
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
        },
        unit_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'subscription_items',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    // 모델 간 관계 정의
    SubscriptionItem.associate = function(models) {
        SubscriptionItem.belongsTo(models.Subscription, {
            foreignKey: 'subscription_id',
            as: 'subscription'
        });
        SubscriptionItem.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return SubscriptionItem;
};

