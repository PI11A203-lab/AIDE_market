// features/tag/tagModel.js
module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define("Tag", {
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

    // アソシエーション（関連付け）を定義
    Tag.associate = (models) => {
        // Tag - Product: 多対多
        Tag.belongsToMany(models.Product, {
            through: 'ProductTags',
            foreignKey: 'tag_id',
            otherKey: 'product_id',
            as: 'products'
        });
    };

    return Tag;
};

