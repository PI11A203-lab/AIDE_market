// features/ordercoupon/orderCouponModel.js
module.exports = (sequelize, DataTypes) => {
    const OrderCoupon = sequelize.define("OrderCoupon", {
        order_coupon_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        coupon_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Coupons',
                key: 'coupon_id'
            }
        },
        applied_value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
    }, {
        tableName: 'order_coupons',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
    
    // 모델 간 관계 정의
    OrderCoupon.associate = function(models) {
        OrderCoupon.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        });
        OrderCoupon.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        OrderCoupon.belongsTo(models.Coupon, {
            foreignKey: 'coupon_id',
            as: 'coupon'
        });
    };
    
    return OrderCoupon;
};

