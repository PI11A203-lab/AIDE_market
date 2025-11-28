// features/teamcomposition/teamCompositionModel.js
module.exports = (sequelize, DataTypes) => {
    const TeamComposition = sequelize.define("TeamComposition", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        total_synergy_score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    }, {
        tableName: 'team_compositions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    
    // 모델 간 관계 정의
    TeamComposition.associate = function(models) {
        // TeamComposition과 TeamMember 관계는 teamMembers 모델에서 정의
    };
    
    return TeamComposition;
};

