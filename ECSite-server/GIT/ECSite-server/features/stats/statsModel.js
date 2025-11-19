// features/stats/statsModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Stats", {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            },
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
    });
};

