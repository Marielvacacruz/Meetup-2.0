'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Images', [
      {
        groupId: 1,
        imageableType: 'Group',
        url: 'image url 123'
      },
      {
        groupId: 1,
        imageableType: 'Group',
        url: 'image url abc'
      },
      {
        eventId: 1,
        imageableType: 'Event',
        url: 'image url 345'
      },
      {
        eventId: 2,
        imageableType: 'Event',
        url: 'image url 678'
      },
      {
        eventId: 2,
        imageableType: 'Event',
        url: 'image url 910'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {});
  }
};
