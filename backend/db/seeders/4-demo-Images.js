'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Images', [
      {
        imageableId: 1,
        imageableType: 'Group',
        url: 'image url 123'
      },
      {
        imageableId: 2,
        imageableType: 'Event',
        url: 'image url 345'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {});
  }
};
