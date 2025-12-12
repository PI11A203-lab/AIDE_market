// features/creditcard/creditCardModel.js
module.exports = (sequelize, DataTypes) => {
    const CreditCard = sequelize.define("CreditCard", {
        card_id: {
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
        card_company: {
            type: DataTypes.ENUM('VISA', 'Master', 'JCB', 'AMEX', 'Diners', 'etc'),
            allowNull: true,
        },
        card_holder: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        card_number_encrypted: {
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
        cvc_encrypted: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        tableName: 'credit_cards',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
    
    // 모델 간 관계 정의
    CreditCard.associate = function(models) {
        CreditCard.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        CreditCard.hasMany(models.PaymentMethod, {
            foreignKey: 'card_id',
            as: 'paymentMethods'
        });
    };
    
    return CreditCard;
};

