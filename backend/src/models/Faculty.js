const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Faculty = sequelize.define('Faculty', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    employee_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.ENUM(
        'Profesör',
        'Doçent',
        'Dr. Öðretim Üyesi',
        'Öðretim Görevlisi',
        'Araþtýrma Görevlisi'
      ),
      allowNull: false
    },
    office_location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    office_hours: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    research_areas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'faculty',
    timestamps: true,
    underscored: true
  });

  return Faculty;
};