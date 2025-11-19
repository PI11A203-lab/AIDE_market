// features/tag/tagModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Tag", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    });
};

