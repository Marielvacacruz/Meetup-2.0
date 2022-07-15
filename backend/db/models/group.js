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
        models.User, { as: 'Organizer', foreignKey: 'organizerId', onDelete: 'CASCADE', hooks: true }
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
        //Polymorphic set up; waiting to test route before implementing
      // Group.hasMany(
      //   models.Image, {
      //     foreignKey: 'imageableId',
      //     constraints: false,
      //     scope: {
      //       imageableType: 'group'
      //     }
      //   }
      // );
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
      allowNull: false,
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
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
