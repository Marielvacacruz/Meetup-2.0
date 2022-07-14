'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Memberships', [
      {
        memberId: 1,
        groupId: 1,
        status: 'host'
      },
      {
        memberId: 1,
        groupId: 2,
        status: 'member'
      },
      {
        memberId: 2,
        groupId: 1,
        status: 'member'
      },
      {
        memberId: 2,
        groupId: 2,
        status:'co-host'
      },

      {
        memberId: 3,
        groupId: 1,
        status: 'member'
      },
      {
        memberId: 4,
        groupId: 2,
        status: 'pending'
      },
      {
        memberId: 5,
        groupId: 2,
        status: 'member'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Memberships', null, {});
  }
};
