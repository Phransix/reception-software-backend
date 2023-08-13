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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      date_and_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      status: {
        type: Sequelize.ENUM('delivered', 'not delivered'),
        allowNull: false,
        defaultValue: 'not delivered',
        required:true,
        validate: {
          isIn: [['delivered', 'not delivered']]
        }
      },
      type: {
        type: Sequelize.ENUM('document', 'food', 'other'),
        allowNull: false,
        defaultValue: 'other',
        required:true,
        validate: {
          isIn: [['document', 'food', 'other']]
        }
      },
      Delivery_Description: {
        type: Sequelize.STRING,
        allowNull: true,
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
