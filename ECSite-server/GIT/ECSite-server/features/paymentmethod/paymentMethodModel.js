// features/paymentmethod/paymentMethodModel.js
module.exports = (sequelize, DataTypes) => {
    const PaymentMethod = sequelize.define("PaymentMethod", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        payment_method: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'credit_card'
        },
        card_company: {
            type: DataTypes.ENUM('VISA', 'Master', 'JCB', 'AMEX', 'Diners', 'etc'),
            allowNull: true,
        },
        card_number_encrypted: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        card_cvc_encrypted: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        exp_month: {
            type: DataTypes.TINYINT,
            allowNull: true,
            validate: {
                min: 1,
                max: 12
            }
        },
        exp_year: {
            type: DataTypes.SMALLINT,
            allowNull: true,
            validate: {
                min: 2000,
                max: 9999
            }
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
    };
    
    return PaymentMethod;
};

