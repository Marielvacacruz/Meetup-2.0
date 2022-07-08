'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'demouser1@user.io',
        firstName: 'Bob',
        lastName: 'Ramirez',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user2@user.io',
        firstName: 'Rebecca',
        lastName: 'Lewis',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user3@user.io',
        firstName: 'Travis',
        lastName: 'Scott',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user4@user.io',
        firstName: 'Wonder',
        lastName: 'Woman',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'user5@user.io',
        firstName: 'Alicia',
        lastName: 'Keys',
        hashedPassword: bcrypt.hashSync('password5')
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('Users', {
      email: {[Op.in]: ['demouser1@user.io', 'user2@user.io', 'user3@user.io', 'user4@user.io', 'user5@user.io']}
    }, {});
  }
};
