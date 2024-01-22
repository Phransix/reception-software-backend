'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Guests', 'guestStatus', {
      type: Sequelize.DataTypes.ENUM('registered', 'purposeCreated'),
      allowNull: true,
      defaultValue: 'registered',
      validate: {
        isIn: [['registered', 'created']]
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Guests', 'guestStatus');
  }
};
