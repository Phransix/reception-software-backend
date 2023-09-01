'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Departments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      departmentId: {
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

      departmentName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      departmentRoomNum: {
        type: Sequelize.STRING
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
    });
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.dropTable('Departments')
  }
};