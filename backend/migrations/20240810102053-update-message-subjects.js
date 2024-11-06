'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Messages', 'subject', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'No Subject'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Messages', 'subject');
  }
};