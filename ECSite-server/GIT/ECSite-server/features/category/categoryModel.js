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
    
    // 모델 간 관계 정의
    Category.associate = function(models) {
        // 자기 참조 관계 (부모-자식 카테고리)
        Category.hasMany(models.Category, {
            foreignKey: 'parentId',
            as: 'children'
        });
        Category.belongsTo(models.Category, {
            foreignKey: 'parentId',
            as: 'parent'
        });
        // Product와의 관계
        Category.hasMany(models.Product, {
            foreignKey: 'category_id',
            as: 'products'
        });
        Category.hasMany(models.Product, {
            foreignKey: 'sub_category_id',
            as: 'subcategoryProducts'
        });
        // ProductFavorite와의 관계
        Category.hasMany(models.ProductFavorite, {
            foreignKey: 'category_id',
            as: 'favorites'
        });
        // TeamMember와의 관계
        Category.hasMany(models.TeamMember, {
            foreignKey: 'category_id',
            as: 'teamMembers'
        });
    };
    
    return Category;
};

