// features/category/categoryModel.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Category", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        name_ja: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        tech_stack: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    });
};

