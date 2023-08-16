Commands:
  sequelize-cli db:migrate                        Run pending migrations
  sequelize-cli db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize-cli db:migrate:status                 List the status of all migrations
  sequelize-cli db:migrate:undo                   Reverts a migration
  sequelize-cli db:migrate:undo:all               Revert all migrations ran
  sequelize-cli db:seed                           Run specified seeder
  sequelize-cli db:seed:undo                      Deletes data from the database
  sequelize-cli db:seed:all                       Run every seeder
  sequelize-cli db:seed:undo:all                  Deletes data from the database
  sequelize-cli db:create                         Create database specified by configuration
  sequelize-cli db:drop                           Drop database specified by configuration
  sequelize-cli init                              Initializes project
  sequelize-cli init:config                       Initializes configuration
  sequelize-cli init:migrations                   Initializes migrations
  sequelize-cli init:models                       Initializes models
  sequelize-cli init:seeders                      Initializes seeders
  sequelize-cli migration:generate                Generates a new migration file
  sequelize-cli migration:create                  Generates a new migration file
  sequelize-cli model:generate                    Generates a model and its migration
  sequelize-cli model:create                      Generates a model and its migration
  sequelize-cli seed:generate                     Generates a new seed file
  sequelize-cli seed:create                       Generates a new seed file

"@types/uuid": "^8.3.4",

"uuid": "^8.3.2",

@Column({defaultValue: uuidv4})
    uuid: string


    const { v4: uuidv4 } = require('uuid');

    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      unique: true,
    },

    user_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Customers',
          },
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },

      currency_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'SystemCurrenciesTB',
          },
          key: 'id',
        },
        onDelete: 'NO ACTION',
      },
