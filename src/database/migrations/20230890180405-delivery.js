
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
    await queryInterface.createTable("Deliveries",{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      deliveryId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },
      unitId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: true,
        references: {
          model: {
            tableName: 'Units',
          },
          key: 'unitId'
        },
        onDelete: 'CASCADE'
      },
      organizationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'Organizations',
          },
          key: 'organizationId'
        },
        onDelete: 'CASCADE'
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receipientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receipientPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      type: {
        type: Sequelize.ENUM('document', 'food', 'other'),
        allowNull: true,
        defaultValue: 'other',
        validate: {
          isIn: [['document', 'food', 'other']]
        }
      },
      status: {
        type: Sequelize.ENUM('delivered', 'awaiting_pickup'),
        allowNull: true,
        defaultValue: 'awaiting_pickup',
        validate: {
          isIn: [['delivered', 'awaiting_pickup']]
        }
      },
      documentTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      itemQuantity: {
        type: Sequelize.STRING,
        allowNull: true
      },
      itemName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable("Deliveries")
  }
};

