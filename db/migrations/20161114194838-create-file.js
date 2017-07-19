'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mime_type: {
        type: Sequelize.STRING
      },
      s3_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_private: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      belongs_team: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      created_channel: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'channels',
          key: 'id'
        }
      },
      owner: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('files');
  }
};
