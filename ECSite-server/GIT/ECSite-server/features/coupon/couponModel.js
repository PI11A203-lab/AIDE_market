// features/coupon/couponModel.js
module.exports = (sequelize, DataTypes) => {
    const Coupon = sequelize.define("Coupon", {
        coupon_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        discount_type: {
            type: DataTypes.ENUM('amount', 'rate'),
            allowNull: false,
        },
        discount_value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        max_discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        min_order: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
    }, {
        tableName: 'coupons',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
    
    // 모델 간 관계 정의
    Coupon.associate = function(models) {
        Coupon.hasMany(models.OrderCoupon, {
            foreignKey: 'coupon_id',
            as: 'orderCoupons'
        });
    };
    
    return Coupon;
};

