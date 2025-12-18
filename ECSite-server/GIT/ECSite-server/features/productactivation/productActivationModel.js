// features/productactivation/productActivationModel.js
module.exports = (sequelize, DataTypes) => {
    const ProductActivation = sequelize.define("ProductActivation", {
        activation_id: {
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
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
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
            comment: '정기결제인 경우'
        },
        activation_code: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('active', 'suspended', 'expired', 'revoked'),
            allowNull: false,
            defaultValue: 'active'
        },
        activated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        suspended_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        suspended_reason: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: '정지 사유 (결제 실패 등)'
        },
        grace_period_end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: '유예 기간 종료일'
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'product_activations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    // 모델 간 관계 정의
    ProductActivation.associate = function(models) {
        ProductActivation.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        ProductActivation.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
        ProductActivation.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        });
        ProductActivation.belongsTo(models.Subscription, {
            foreignKey: 'subscription_id',
            as: 'subscription'
        });
    };

    return ProductActivation;
};

