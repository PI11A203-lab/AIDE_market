// features/teammember/teamMemberModel.js
module.exports = (sequelize, DataTypes) => {
    const TeamMember = sequelize.define("TeamMember", {
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'TeamCompositions',
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
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'team_members',
        timestamps: true,
        createdAt: 'added_at',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['team_id', 'product_id']
            }
        ]
    });
    
    // 모델 간 관계 정의
    TeamMember.associate = function(models) {
        TeamMember.belongsTo(models.TeamComposition, {
            foreignKey: 'team_id',
            as: 'team'
        });
        TeamMember.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
        TeamMember.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category'
        });
    };
    
    return TeamMember;
};

