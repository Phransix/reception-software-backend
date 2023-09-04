'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Staffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      staffId: {
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

      departmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model:{
            tableName: 'Departments',
          },
          key:'departmentId'
        },
        onDelete: 'CASCADE'
      },

      title: {
        allowNull: true,
        type: Sequelize.ENUM(
          'Mr', 
          'Mrs',
          'Prof',
          'Dr')
      },

      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phoneNumber: {
        type:Sequelize.STRING,
        allowNull: false,
        unique: true
      },

           gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false,
        validate: {
          isIn: [['male','female']]
        }
      },

      role: {
        type:Sequelize.STRING,
        allowNull: false,
      },

      profilePhoto: {
        type: Sequelize.STRING
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
   

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Staffs');
  }
};