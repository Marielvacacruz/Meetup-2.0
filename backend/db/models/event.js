'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(
        models.Group, { foreignKey: 'groupId'}
      );

      Event.belongsTo(
        models.Venue, {foreignKey: 'venueId'}
      );

      Event.belongsToMany(
        models.User, { through: models.Attendance, foreignKey: 'eventId', otherKey: 'userId'}
      );

      Event.hasMany(
        models.Image, {foreignKey: 'eventId'}
      );

      Event.hasMany(
        models.Attendance, {foreignKey: 'eventId'}
      );

    }
  }
  Event.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    venueId: {
      type:DataTypes.INTEGER
    },
    groupId: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
    name: {
      allowNull:false,
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING,
    },
    capacity: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    previewImage: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
