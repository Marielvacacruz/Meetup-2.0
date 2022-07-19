'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Attendees', [
      {
        userId: 1,
        eventId: 1,
        status: 'attending'
      },
      {
        userId: 2,
        eventId: 2,
        status: 'attending'
      },
      {
        userId: 3,
        eventId: 1,
        status: 'attending'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Attendees', null, {});
  }
};
