'use strict';
const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, email, firstName, lastName} = this;
      return { id, email, firstName, lastName};
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }

    static async login({ credential, password }) {
      const user = await User.scope('loginUser').findOne({
        where: {
            email: credential
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ email, password, firstName, lastName }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        email,
        firstName,
        lastName,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    }

    static associate(models) {
      User.hasMany(
        models.Group, { as: 'Organizer', foreignKey: 'organizerId', onDelete: 'CASCADE', hooks: true}
      );

      User.belongsToMany(
        models.Group, {through: models.Membership, foreignKey: 'memberId', otherKey: 'groupId'}
      );

      User.hasMany(
        models.Membership, {foreignKey: 'memberId'}
      );

      User.belongsToMany(
        models.Event, { through: models.Attendance, foreignKey: 'userId', otherKey: 'eventId'}
      );

      User.hasMany(
        models.Attendance, { foreignKey: 'userId'}
      );
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName:{
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [3, 256]
      },
      unique:true
    },
    hashedPassword:{
      allowNull: false,
      type: DataTypes.STRING.BINARY,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "createdAt", "updatedAt" ]
      }
    },
    scopes: {
      currentUser: {
        attributes: {exclude: ["hashedPassword"]}
      },
      loginUser: {
        attributes: {}
      }
    }
  });
  return User;
};
