'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Image.belongsTo(
      //   models.Group, {foreignKey: 'imageableId', constraints: false}
      //   );

      // Image.belongsTo(
      //   models.Event, {foreignKey: 'imageableId', constraints: false}
      //   );
    }
  }
  Image.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    imageableId:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    imageableType: {
      allowNull: false,
      type: DataTypes.STRING
    },
    url:{
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
