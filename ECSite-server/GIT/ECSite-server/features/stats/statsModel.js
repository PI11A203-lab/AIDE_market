// features/stats/statsModel.js
module.exports = (sequelize, DataTypes) => {
    const Stats = sequelize.define("Stats", {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        teamwork: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            validate: {
                min: 0,
                max: 100
            }
        },
        stability: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            validate: {
                min: 0,
                max: 100
            }
        },
        speed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            validate: {
                min: 0,
                max: 100
            }
        },
        creativity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            validate: {
                min: 0,
                max: 100
            }
        },
        productivity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            validate: {
                min: 0,
                max: 100
            }
        },
        maintainability: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
            validate: {
                min: 0,
                max: 100
            }
        },
    }, {
        tableName: 'stats',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });

    // 관계 정의
    Stats.associate = function(models) {
        Stats.belongsTo(models.Product, {
            foreignKey: 'product_id',
            targetKey: 'id',
            as: 'product',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return Stats;
};

