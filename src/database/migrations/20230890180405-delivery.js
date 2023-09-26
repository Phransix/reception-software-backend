
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
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.ENUM('document', 'food', 'other'),
        allowNull: false,
        defaultValue: null,
        validate: {
          isIn: [['document', 'food', 'other']]
        }
      },
      itemQuantity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      unit: {
        type: Sequelize.ENUM('pc(s)', 'bx(s)', 'pck(s)'),
        allowNull: true,
        defaultValue: null,
        validate: {
          isIn: [['pc(c)', 'bx(s)', 'pck(s)']]
        }
      },
      itemDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('delivered', 'awaiting_pickup'),
        allowNull: true,
        defaultValue: 'awaiting_pickup',
        validate: {
          isIn: [['delivered', 'awaiting_pickup']]
        }
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
    await queryInterface.dropTable("Deliveries")
  }
};

