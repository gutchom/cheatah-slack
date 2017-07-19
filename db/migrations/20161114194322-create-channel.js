'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('channels', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      belongs_team: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('channels');
  }
};
