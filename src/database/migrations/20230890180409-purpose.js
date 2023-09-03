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
    await queryInterface.createTable("Purposes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      purposeId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
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
    await queryInterface.dropTable('Purposes');
  }
};
