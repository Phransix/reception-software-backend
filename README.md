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






    const today = new Date();
        today.setHours(0, 0, 0, 0);
        // const startOfYear = new Date(startYear, 0, 1);
        // const endOfYear = new Date(endYear, 11, 31);

        const filteredData = [];

        for (let year = startYear; year <= endYear; year++) {
          const startDate = new Date(year, 0, 1, 0, 0, 0, 0);
          const endDate = new Date(year + 1, 0, 1, 0, 0, 0, 0);

          const totalVisit = await this?.guestModel?.count({
            where: {
              createdAt: {
                [Op.between]: [startDate, endDate],
              },
              organizationId: user?.organizationId,
            },
          });

          filteredData.push({
            id: (year - startYear + 1).toString(),
            year: year.toString(),
            totalVisit: Number(totalVisit),
          });

        }

        // Sort the data by year in ascending order
        filteredData.sort((a, b) => a.year - b.year);

        return Util?.handleSuccessRespone(
          filteredData,
          'Data requested successfully',
        );