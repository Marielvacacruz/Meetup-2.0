'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Venues', [
      {
        groupId: 1,
        address: '123 5th St',
        city: 'New Orleans',
        state: 'Louisiana',
        lat: 37.7645358,
        lng: -122.4730327
    },
    {
      groupId: 2,
      address: '456 Mt.Rainier',
      city: 'Seattle',
      state: 'Washington',
      lat: 25.7645358,
      lng: -122.4730327
    },
    {
      eventId: 1,
      address: '789 Test St',
      city: 'Los Angeles',
      state: 'California',
      lat: 37.7645358,
      lng: -122.4730327
  },
  {
    eventId: 2,
    address: '1011 Mt.Rainier',
    city: 'Seattle',
    state: 'Washington',
    lat: 25.7645358,
    lng: -122.4730327
  }
  ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Venues', null, {});
  }
};
