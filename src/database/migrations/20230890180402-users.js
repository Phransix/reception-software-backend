'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      userId: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          unique: true
      },
      // roleId: {
      //   type: Sequelize.UUID,
      //   allowNull: false,
      //   references: {
      //     model:{
      //       tableName: 'Roles',
      //     },
      //     key:'roleId'
      //   },
      //   onDelete: 'CASCADE'
      // },

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

      roleName: {
        type: Sequelize.ENUM('Admin', 'Receptionist'),
        allowNull: false,
        required:true,
        defaultValue: 'Admin',
        validate: {
          isIn: [['Admin', 'Receptionist']] 
        }
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

      password: {
        type: Sequelize.STRING,
        allowNull: true
      },

      profilePhoto: {
        type: Sequelize.STRING
      },


      isLogin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('Users');
  }
};