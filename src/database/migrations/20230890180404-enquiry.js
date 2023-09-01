'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Enquiries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      enquiryId:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique:true
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

      enquirerFullName: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      email: {
        allowNull: true,
        type: Sequelize.STRING,
        unique:true
      },

      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },

      purpose: {
        allowNull: false,
        type: Sequelize.ENUM(
          'Official', 
          'Personal',
          'Partnership',
          'Legal',
          'Career',
          'Sales',
          'Complaints',
          'Payments',
          'Investments',
          'Events')
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      
      deletedAt: {
        type: Sequelize.DATE,
      allowNull: true,
     defaultValue: null
      }, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Enquiries');
  },
};
