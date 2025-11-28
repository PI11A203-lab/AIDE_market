// features/orderitem/orderItemModel.js
module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define("OrderItem", {
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orders',
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
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        },
        has_review: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    }, {
        tableName: 'order_items',
        timestamps: false
    });
    
    // 모델 간 관계 정의
    OrderItem.associate = function(models) {
        OrderItem.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        });
        OrderItem.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };
    
    return OrderItem;
};

