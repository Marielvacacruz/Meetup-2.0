'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Groups',[
      {
      organizerId: 1,
      name: 'Academic Writing Group',
      about: 'lorem ipsum',
      type: 'In person',
      private: true,
      city: 'New Orleans',
      state: 'Louisiana',
      previewImage: 'image url'
    },
    {
      organizerId: 2,
      name: 'Outdoor Adventures',
      about: 'we go outside',
      type: 'In person',
      private: true,
      city: 'Seattle',
      state: 'Washington',
      previewImage: 'image url'
    }
  ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', {
      name: ['Academic Writing Group', 'Outdoor Adventures']
    });
  }
}
