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
      organization_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type:Sequelize.STRING,
        allowNull: false
      },

      password: {
        type: Sequelize.STRING,
        allowNull: true
      },

       isVerified: {
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
     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }, 
      // soft_Delete: {
      //   type: Sequelize.Date,
      //   allowNull: true,
      //  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      //   after: 'updatedAt'
      // }

     

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};