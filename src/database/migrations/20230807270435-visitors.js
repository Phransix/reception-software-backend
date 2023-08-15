'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("Visitors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      organization_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      visitor: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      phonenumber: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      purpose: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      host: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      visit_Status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        required:true,
        defaultValue: 'inactive',
        validate: {
          isIn: [['active', 'inactive']] // Validates that the value is either 'active' or 'inactive'
        }
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Visitors');
  }
};
