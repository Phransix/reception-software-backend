'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let [template, func] = await queryInterface.sequelize.query(`Select count(*) from "Units"`);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    if(template[0]?.count <= 0){
      
      queryInterface.bulkInsert("Units", [
       {
         unitId: uuidv4(),
         name: 'piece',
         shortName:'pc(s)',
         createdAt: new Date(),
         updatedAt: new Date()
       },
       {
        unitId: uuidv4(),
        name: 'box',
        shortName:'bx(s)',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        unitId: uuidv4(),
        name: 'pack',
        shortName:'pck(s)',
        createdAt: new Date(),
        updatedAt: new Date()
      },
     
     ],
     {}
     );
   }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Units", null, {});
  }
};
