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
        payment_method: {
            type: DataTypes.STRING(50),
            allowNull: true,
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
        card_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
    };
    
    return Order;
};

