module.exports = (sequelize, DataTypes) => {
  const SecuritySetting = sequelize.define('SecuritySetting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    setting_key: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    setting_value: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'security_settings',
    timestamps: false,
    underscored: true
  });

  return SecuritySetting;
};

