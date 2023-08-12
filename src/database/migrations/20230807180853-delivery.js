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
    await queryInterface.createTable("Deliveries", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      phonenumber: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      type: {
        type: Sequelize.ENUM('document', 'food', 'other'),
        allowNull: false,
        required:true,
        validate: {
          isIn: [['document', 'food', 'other']]
        }
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        required:true,
        validate: {
          isIn: [['active', 'inactive']]
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
    await queryInterface.dropTable('Deliveries');
  }
};
