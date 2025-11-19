// features/synergy/synergyModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Synergy", {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        related_product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        synergy_score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 80,
            validate: {
                min: 0,
                max: 100
            }
        },
        synergy_description: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    });
};

