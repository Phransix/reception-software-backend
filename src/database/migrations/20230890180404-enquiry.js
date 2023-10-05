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

      enquiryId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      },

      organizationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'Organizations',
          },
          key: 'organizationId',
        },
        onDelete: 'CASCADE',
      },

      enquirerFullName: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      email: {
        allowNull: true,
        type: Sequelize.STRING,
      },

      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING,
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
          'Events',
        ),
      },

      description: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Enquiries');
  },
};
