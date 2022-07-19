'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Events', [
    {
      venueId: 1,
      groupId: 1,
      name: 'The Station Coffee House',
      type: 'In person',
      capacity: 10,
      price: 10.50,
      description: 'we will be writing',
      startDate: '2021-11-19 20:00:00',
      endDate: '2021-11-19 21:00:00'
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Hike Mt. Rainier',
      type: 'In person',
      capacity: 15,
      price: 0.00,
      description: 'we will be hiking',
      startDate: '2022-05-23 20:00:00',
      endDate: '2022-05-23 24:00:00'
    }
  ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {});
  }
};
