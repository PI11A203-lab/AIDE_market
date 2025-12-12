// features/paymentmethod/paymentMethodModel.js
module.exports = (sequelize, DataTypes) => {
    const PaymentMethod = sequelize.define("PaymentMethod", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        payment_method: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'credit_card'
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        card_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'credit_cards',
                key: 'card_id'
            }
        }
    }, {
        tableName: 'payment_methods',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    
    // 모델 간 관계 정의
    PaymentMethod.associate = function(models) {
        PaymentMethod.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        PaymentMethod.belongsTo(models.CreditCard, {
            foreignKey: 'card_id',
            as: 'creditCard'
        });
        PaymentMethod.hasMany(models.Order, {
            foreignKey: 'payment_id',
            as: 'orders'
        });
    };
    
    return PaymentMethod;
};

