'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("VisitorLogs", {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      purposeId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model:{
            tableName: 'Purposes',
          },
          key:'purposeId'
        },
        onDelete: 'CASCADE'
      },
      guestId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        references: {
          model:{
            tableName: 'Guests',
          },
          key:'guestId'
        },
        onDelete: 'CASCADE'
      },
      purpose: {
        type: Sequelize.ENUM('personal', 'official'),
        allowNull: false,
        required:true,
        defaultValue: 'official',
        validate: {
          isIn: [['personal', 'official']] 
        }
      },
      departmentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model:{
            tableName: 'Departments',
          },
          key:'departmentId'
        },
        onDelete: 'CASCADE'
      },
      staffId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model:{
            tableName: 'Staffs',
          },
          key:'staffId'
        },
        onDelete: 'CASCADE'
      },
      signInDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      signInTime: {
        type: Sequelize.TIME,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      signOutTime: {
        type: Sequelize.TIME,
        allowNull: true
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('VisitorLogs');
  }
};