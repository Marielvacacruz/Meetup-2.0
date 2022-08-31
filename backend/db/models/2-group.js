'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(
        models.User, { as: 'Organizer', foreignKey: 'organizerId'}
      );

      Group.belongsToMany(
        models.User, {through: models.Membership, foreignKey: 'groupId', otherKey: 'memberId'}
      );

      Group.hasMany(
        models.Membership, {foreignKey: 'groupId'}
      );

      Group.hasMany(
        models.Venue, { foreignKey: 'groupId'}
      );

      Group.hasMany(
        models.Image, { foreignKey: 'groupId'}
      );

      Group.hasMany(
        models.Event, {foreignKey: 'groupId'}
      );

    }
  }
  Group.init({
    id:{
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    organizerId: {
      allowNull:false,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    about: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING
    },
    private: {
      type: DataTypes.BOOLEAN
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING
    },
    state: {
      allowNull: false,
      type:  DataTypes.STRING
    },
    previewImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
