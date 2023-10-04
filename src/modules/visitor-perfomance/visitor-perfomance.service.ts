import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Guest } from '../guest/entities/guest.entity';
import { Purpose } from '../purpose/entities/purpose.entity';
import * as Util from '../../utils/index';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { Days, MONTHS, filter } from './months.DTO';
import { Op } from 'sequelize';

@Injectable()
export class VisitorPerfomanceService {
  constructor(
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(Guest) private guestModel: typeof Guest,
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
  ) {}

  async getVisitorPerformance(filterData: any, userId: any) {
    try {
      let user = await this?.UserModel?.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) {
        return Util?.CustomhandleNotFoundResponse('User Not Found');
      }

      let get_org = await this?.OrgModel.findOne({
        where: { organizationId: user?.organizationId },
      });
      if (!get_org) {
        return Util?.CustomhandleNotFoundResponse('Organization Not Found');
      }

      if (filterData === filter?.MONTH) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        // January Data
        MONTHS?.JANUARY;

        const firstDayOfJan = new Date(today?.getFullYear(), 0, 1, 0, 0, 0, 0);
        const firstDayOfFebs = new Date(today?.getFullYear(), 1, 1, 0, 0, 0, 0);

        const totalVisitInJan = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfJan, firstDayOfFebs],
            },
            organizationId: user?.organizationId,
          },
        });

        // February Data
        MONTHS?.FEBRUARY;

        const firstDayOfFeb = new Date(today?.getFullYear(), 1, 1, 0, 0, 0, 0);

        const firstDayOfMarchs = new Date(
          today?.getFullYear(),2, 1, 0, 0, 0, 0);

        const totalVisitInFeb = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfFeb, firstDayOfMarchs],
            },
            organizationId: user?.organizationId,
          },
        });

        // March Data
        MONTHS?.MARCH;
        const firstDayOfMarch = new Date(
          today?.getFullYear(),2, 1, 0, 0, 0, 0);
      
        const firstDayOfAprils = new Date(
          today?.getFullYear(),3, 1, 0, 0, 0, 0);
        
        const totalVisitInMarch = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfMarch, firstDayOfAprils],
            },
            organizationId: user?.organizationId,
          },
        });

        // April Data
        MONTHS?.APRIL;

        const firstDayOfApril = new Date(
          today?.getFullYear(),3, 1, 0, 0, 0, 0);

        const firstDayOfMays = new Date(today?.getFullYear(), 4, 1, 0, 0, 0, 0);

        const totalVisitInApril = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfApril, firstDayOfMays],
            },
            organizationId: user?.organizationId,
          },
        });

        // May Data
        MONTHS?.MAY;

        const firstDayOfMay = new Date(today?.getFullYear(), 4, 1, 0, 0, 0, 0);
        const firstDayOfJunes = new Date(
          today?.getFullYear(),5, 1, 0, 0, 0, 0);

        const totalVisitInMay = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfMay, firstDayOfJunes],
            },
            organizationId: user?.organizationId,
          },
        });

        // June Data
        MONTHS?.JUNE;

        const firstDayOfJune = new Date(today?.getFullYear(), 5, 1, 0, 0, 0, 0);
        const firstDayOfJulys = new Date(
          today?.getFullYear(),5, 1, 0, 0, 0, 0);

        const totalVisitInJune = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfJune, firstDayOfJulys],
            },
            organizationId: user?.organizationId,
          },
        });

        // July Data
        MONTHS?.JULY;

        const firstDayOfJuly = new Date(today?.getFullYear(), 6, 1, 0, 0, 0, 0);
        const firstDayOfAugs = new Date(today?.getFullYear(), 7, 1, 0, 0, 0, 0);

        const totalVisitInJuly = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfJuly, firstDayOfAugs],
            },
            organizationId: user?.organizationId,
          },
        });

        // August Data
        MONTHS?.AUGUST;

        const firstDayOfAug = new Date(today?.getFullYear(), 7, 1, 0, 0, 0, 0);
        const firstDayOfSepts = new Date(
          today?.getFullYear(),8, 1, 0, 0, 0, 0);

        const totalVisitInAug = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfAug, firstDayOfSepts],
            },
            organizationId: user?.organizationId,
          },
        });

        // September Data
        MONTHS?.SEPTEMBER;

        const firstDayOfSept = new Date(today?.getFullYear(), 8, 1, 0, 0, 0, 0);
        const firstDayOfOcts = new Date(today?.getFullYear(), 9, 1, 0, 0, 0, 0);

        const totalVisitInSept = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfSept, firstDayOfOcts],
            },
            organizationId: user?.organizationId,
          },
        });

        // October Data
        MONTHS?.OCTOBER;
        const firstDayOfOct = new Date(today?.getFullYear(), 9, 1, 0, 0, 0, 0);
        const firstDayOfNovs = new Date(
          today?.getFullYear(),10, 1, 0, 0, 0, 0);

        const totalVisitInOct = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfOct, firstDayOfNovs],
            },
            organizationId: user?.organizationId,
          },
        });

        // November Data
        MONTHS?.NOVEMBER;
        const firstDayOfNov = new Date(today?.getFullYear(), 10, 1, 0, 0, 0, 0);
        const firstDayOfDecs = new Date(
          today?.getFullYear(),  11, 1, 0, 0, 0, 0);

        const totalVisitInNov = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfNov, firstDayOfDecs],
            },
            organizationId: user?.organizationId,
          },
        });

        // December Data
        MONTHS?.DECEMBER;
        const firstDayOfDec = new Date(today?.getFullYear(), 11, 1, 0, 0, 0, 0);
        const firstDayOfJans = new Date(
          today?.getFullYear(),12, 1, 0, 0, 0, 0);

        const totalVisitInDec = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfDec, firstDayOfJans],
            },
            organizationId: user?.organizationId,
          },
        });

        let filteredData = {
          January: Number(totalVisitInJan),
          February: Number(totalVisitInFeb),
          March: Number(totalVisitInMarch),
          April: Number(totalVisitInApril),
          May: Number(totalVisitInMay),
          June: Number(totalVisitInJune),
          July: Number(totalVisitInJuly),
          August: Number(totalVisitInAug),
          September: Number(totalVisitInSept),
          October: Number(totalVisitInOct),
          November: Number(totalVisitInNov),
          December: Number(totalVisitInDec),
        };

        return Util?.handleSuccessRespone(
          filteredData,
          'Data requested successfully',
        );
      }

         //  Filter Visitor Activity Performanc By week
      if (filterData === filter?.WEEK) {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        // Data For Sunday
        Days?.SUNDAY;

        const dayOfWeekSun = 0; // 0 for Sunday
        // Calculate the start and end dates for the current Sunday
        const visitOnSunday = new Date(
          year,
          month,
          today.getDate() - (today.getDay() - dayOfWeekSun),0,0,0,0)

        const visitOnMons = new Date(
          year,
          month,
          visitOnSunday.getDate() + 1,0,0,0,0)

        const totalVisitsSunday = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [visitOnSunday, visitOnMons],
            },
            organizationId: user?.organizationId,
          },
        });
        // console.log(`Total visits on Sunday: ${totalVisitsSun}`);

        // Data For Monday
        Days?.MONDAY;

        const dayOfWeekMon = 1; // 1 for monday

        // // Calculate the start and end dates for the current Monday
        const visitOnMon = new Date(
          year,
          month,
          today.getDate() - (today.getDay() - dayOfWeekMon),0,0,0,0)

        const visitOnTues = new Date(
          year,
          month,
          visitOnMon.getDate() + 1,0,0,0,0)
    
        const totalVisitsMonday = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [visitOnMon, visitOnTues],
            },
            organizationId: user?.organizationId,
          },
        });

        // console.log(`Total visits on Monday: ${totalVisitsMonday}`);

        // Data For Tuesday
        Days?.TUESDAY;

        const dayOfWeekTues = 2; // 2 for Tuesday

        // // Calculate the start and end dates for the current Tuesday
        const visitOnTuesday = new Date(
          year,
          month,
          today.getDate() - (today.getDay() - dayOfWeekTues),0,0,0,0)

        const visitOnWed = new Date(
          year,
          month,
          visitOnTuesday.getDate() + 1,0,0,0,0)

        const totalVisitsTuesday = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [visitOnTuesday, visitOnWed],
            },
            organizationId: user?.organizationId,
          },
        });

        // console.log(`Total visits on Tuesday: ${totalVisitsTuesday}`);

        // Data For Wednesday
        Days?.WEDNESDAY;

        const dayOfWeekWed = 3; // 3 for Wednesday

        // // Calculate the start and end dates for the current Wednesday
        const visitOnWednesday = new Date(
          year,
          month,
          today.getDate() - (today.getDay() - dayOfWeekWed),0,0,0,0)

        const visitOnThur = new Date(
          year,
          month,
          visitOnWednesday.getDate() + 1,0,0,0,)

        const totalVisitsWednesday = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [visitOnWednesday, visitOnThur],
            },
            organizationId: user?.organizationId,
          },
        });

        // console.log(`Total visits on Wednesday: ${totalVisitsWednesday}`);

        // Data For Thursday
        Days?.THURSDAY;

        const dayOfWeekThurs = 4; // 4 for Thursday

        // // Calculate the start and end dates for the current Thursday
        const visitOnThursday = new Date(
          year,
          month,
          today.getDate() - (today.getDay() - dayOfWeekThurs),0,0,0,0)
       
        const visitOnFri = new Date(
          year,
          month,
          visitOnThursday.getDate() + 1,0,0,0,0)

        const totalVisitsThursday = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [visitOnThursday, visitOnFri],
            },
            organizationId: user?.organizationId,
          },
        });

        // console.log(`Total visits on Thursday: ${totalVisitsThursday}`);

        // Data For Friday
        Days?.FRIDAY;

        const dayOfWeekFri = 5; // 1 for monday

        // // Calculate the start and end dates for the current Friday
        const visitOnFriday = new Date(
          year,
          month,
          today.getDate() - (today.getDay() - dayOfWeekFri),0,0,0,0)

        const visitOnSat = new Date(
          year,
          month,
          visitOnFriday.getDate() + 1,0,0,0,0)

        const totalVisitsFriday = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [visitOnFriday, visitOnSat],
            },
            organizationId: user?.organizationId,
          },
        });

        // console.log(`Total visits on Friday: ${totalVisitsFriday}`);

        // Data For Saturday
        Days?.SATUARDAY;

        const dayOfWeekSaturday = 6; // 1 for monday

        // // Calculate the start and end dates for the current Sunday
        const visitOnSaturday = new Date(
          year,
          month,
          today.getDate() - (today.getDay() - dayOfWeekSaturday),
          0,
          0,
          0,
          0,
        );

        const visitOnSun = new Date(
          year,
          month,
          visitOnSaturday.getDate() + 1,
          0,
          0,
          0,
          0,
        );

        const totalVisitsSaturday = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [visitOnSaturday, visitOnSun],
            },
            organizationId: user?.organizationId,
          },
        });

        // console.log(`Total visits on Saturday: ${totalVisitsSaturday}`);

        let filterData = {
          Sunday: Number(totalVisitsSunday),
          Monday: Number(totalVisitsMonday),
          Tuesday: Number(totalVisitsTuesday),
          Wednesday: Number(totalVisitsWednesday),
          Thursday: Number(totalVisitsThursday),
          Friday: Number(totalVisitsFriday),
          Satuarday: Number(totalVisitsSaturday),
         
        };

        return Util?.handleSuccessRespone(
          filterData,
          'Data requested successfully',
        );
      }
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }
}
