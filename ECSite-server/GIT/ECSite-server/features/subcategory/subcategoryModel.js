// features/subcategory/subcategoryModel.js
module.exports = (sequelize, DataTypes) => {
    const SubCategory = sequelize.define("SubCategory", {
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        tech_stack: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    }, {
        tableName: 'sub_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
    
    // 모델 간 관계 정의
    SubCategory.associate = function(models) {
        SubCategory.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category'
        });
    };
    
    return SubCategory;
};

