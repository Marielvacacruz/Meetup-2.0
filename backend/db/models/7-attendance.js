'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendance.belongsTo(
        models.Event, {foreignKey: 'eventId'}
      );

      Attendance.belongsTo(
        models.User, {foreignKey: 'userId'}
      );
    }
  }
  Attendance.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId:  {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    eventId:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt" ]
      }
    },
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
