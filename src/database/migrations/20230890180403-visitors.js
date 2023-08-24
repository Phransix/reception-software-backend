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
      visitorId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },
      organizationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model:{
            tableName: 'Organizations',
          },
          key:'organizationId'
        },
        onDelete: 'CASCADE'
      },
      visitorFullname: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
        unique:true
      },
      purpose: {
        type: Sequelize.ENUM('personal', 'unofficial'),
        allowNull: false,
        required:true,
        defaultValue: 'unofficial',
        validate: {
          isIn: [['personal', 'unofficial']] 
        }
      },
      host: {
        type: Sequelize.STRING,
        allowNull: false,
        required:true,
      },
      visitStatus: {
        type: Sequelize.ENUM('signedIn', 'signedOut'),
        allowNull: false,
        required:true,
        defaultValue: 'signedOut',
        validate: {
          isIn: [['signedIn', 'signedOut']] // Validates that the value is either 'active' or 'inactive'
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
      },
      deletedAt: {
        type: Sequelize.DATE,
      allowNull: true,
     defaultValue: null
      }, 
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
