'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Guests', 'guestStatus', {
      type: Sequelize.DataTypes.ENUM('pending', 'active'),
      allowNull: true,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'active']]
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Guests', 'guestStatus');
  }
};
