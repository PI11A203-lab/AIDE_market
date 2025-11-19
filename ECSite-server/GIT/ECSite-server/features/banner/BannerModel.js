// features/banner/bannerModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Banner", {
        imageUrl: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
        href: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
    });
};
