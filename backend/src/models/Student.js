const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define('Student', {
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
    student_number: {
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
    admission_year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    current_semester: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    gpa: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00
    },
    cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00
    },
    total_credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_scholarship: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    advisor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
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
    tableName: 'students',
    timestamps: true,
    underscored: true
  });

  return Student;
};