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

  async getVisitorPerformance(
    filterData: any,
    userId: any
  ) {
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

      //  Filter Visitor Activity Performanc By Months
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
          today?.getFullYear(),
          2,
          1,
          0,
          0,
          0,
          0,
        );

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
          today?.getFullYear(),
          2,
          1,
          0,
          0,
          0,
          0,
        );

        const firstDayOfAprils = new Date(
          today?.getFullYear(),
          3,
          1,
          0,
          0,
          0,
          0,
        );

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
          today?.getFullYear(),
          3,
          1,
          0,
          0,
          0,
          0,
        );

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
          today?.getFullYear(),
          5,
          1,
          0,
          0,
          0,
          0,
        );

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
          today?.getFullYear(),
          5,
          1,
          0,
          0,
          0,
          0,
        );

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
          today?.getFullYear(),
          8,
          1,
          0,
          0,
          0,
          0,
        );

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
          today?.getFullYear(),
          10,
          1,
          0,
          0,
          0,
          0,
        );

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
          today?.getFullYear(),
          11,
          1,
          0,
          0,
          0,
          0,
        );

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
          today?.getFullYear(),
          12,
          1,
          0,
          0,
          0,
          0,
        );

        const totalVisitInDec = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfDec, firstDayOfJans],
            },
            organizationId: user?.organizationId,
          },
        });

        const filteredData = [
          { id: 1, month: 'January', totalVisit: Number(totalVisitInJan) },
          { id: 2, month: 'February', totalVisit: Number(totalVisitInFeb) },
          { id: 3, month: 'March', totalVisit: Number(totalVisitInMarch) },
          { id: 4, month: 'April', totalVisit: Number(totalVisitInApril) },
          { id: 5, month: 'May', totalVisit: Number(totalVisitInMay) },
          { id: 6, month: 'June', totalVisit: Number(totalVisitInJune) },
          { id: 7, month: 'July', totalVisit: Number(totalVisitInJuly) },
          { id: 8, month: 'August', totalVisit: Number(totalVisitInAug) },
          { id: 9, month: 'September', totalVisit: Number(totalVisitInSept) },
          { id: 10, month: 'October', totalVisit: Number(totalVisitInOct) },
          { id: 11, month: 'November', totalVisit: Number(totalVisitInNov) },
          { id: 12, month: 'December', totalVisit: Number(totalVisitInDec) },
        ];

        return Util?.handleSuccessRespone(
          filteredData,
          'Data requested successfully',
        );
      }

      //  Filter Visitor Activity Performance By week(days)
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
          today.getDate() - (today.getDay() - dayOfWeekSun),
          0,
          0,
          0,
          0,
        );

        const visitOnMons = new Date(
          year,
          month,
          visitOnSunday.getDate() + 1,
          0,
          0,
          0,
          0,
        );

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
          today.getDate() - (today.getDay() - dayOfWeekMon),
          0,
          0,
          0,
          0,
        );

        const visitOnTues = new Date(
          year,
          month,
          visitOnMon.getDate() + 1,
          0,
          0,
          0,
          0,
        );

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
          today.getDate() - (today.getDay() - dayOfWeekTues),
          0,
          0,
          0,
          0,
        );

        const visitOnWed = new Date(
          year,
          month,
          visitOnTuesday.getDate() + 1,
          0,
          0,
          0,
          0,
        );

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
          today.getDate() - (today.getDay() - dayOfWeekWed),
          0,
          0,
          0,
          0,
        );

        const visitOnThur = new Date(
          year,
          month,
          visitOnWednesday.getDate() + 1,
          0,
          0,
          0,
        );

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
          today.getDate() - (today.getDay() - dayOfWeekThurs),
          0,
          0,
          0,
          0,
        );

        const visitOnFri = new Date(
          year,
          month,
          visitOnThursday.getDate() + 1,
          0,
          0,
          0,
          0,
        );

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
          today.getDate() - (today.getDay() - dayOfWeekFri),
          0,
          0,
          0,
          0,
        );

        const visitOnSat = new Date(
          year,
          month,
          visitOnFriday.getDate() + 1,
          0,
          0,
          0,
          0,
        );

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

        let filterData = [
          { id: 1, days: 'Sunday', totalVisit: Number(totalVisitsSunday) },
          { id: 2, days: 'Monday', totalVisit: Number(totalVisitsMonday) },
          { id: 3, days: 'Tuesday', totalVisit: Number(totalVisitsTuesday) },
          {
            id: 4,
            days: 'Wednesday',
            totalVisit: Number(totalVisitsWednesday),
          },
          { id: 5, days: 'Thursday', totalVisit: Number(totalVisitsThursday) },
          { id: 6, days: 'Friday', totalVisit: Number(totalVisitsFriday) },
          { id: 7, days: 'Satuarday', totalVisit: Number(totalVisitsSaturday) },
        ];

        return Util?.handleSuccessRespone(
          filterData,
          'Data requested successfully',
        );
      }

      // Filter Visitor Activity Performance In A Day(hours)
      if (filterData === filter?.Day) {
        const start0 = new Date();
        start0?.setHours(0, 0, 0, 0);
        const end2 = new Date(start0);
        end2?.setHours(2, 0, 0, 0);

        const totalVisitfrm0_2 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start0, end2],
            },
            organizationId: user?.organizationId,
          },
        });
        // console.log(`Total visits from 0 to 1:59: ${totalVisitfrm0_2}`);

        const start2 = new Date();
        start2?.setHours(2, 0, 0, 0);
        const end4 = new Date(start2);
        end4?.setHours(4, 0, 0, 0);

        const totalVisitfrm2_4 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start2, end4],
            },
            organizationId: user?.organizationId,
          },
        });

        const start4 = new Date();
        start4?.setHours(4, 0, 0, 0);
        const end6 = new Date(start4);
        end6?.setHours(6, 0, 0, 0);

        const totalVisitfrm4_6 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start4, end6],
            },
            organizationId: user?.organizationId,
          },
        });

        const start6 = new Date();
        start6?.setHours(6, 0, 0, 0);
        const end8 = new Date(start6);
        end8?.setHours(8, 0, 0, 0);

        const totalVisitfrm6_8 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start6, end8],
            },
            organizationId: user?.organizationId,
          },
        });

        const start8 = new Date();
        start8?.setHours(8, 0, 0, 0);
        const end10 = new Date(start8);
        end10?.setHours(10, 0, 0, 0);

        const totalVisitfrm8_10 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start8, end10],
            },
            organizationId: user?.organizationId,
          },
        });

        const start10 = new Date();
        start10?.setHours(10, 0, 0, 0);
        const end12 = new Date(start10);
        end12?.setHours(12, 0, 0, 0);

        const totalVisitfrm10_12 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start10, end8],
            },
            organizationId: user?.organizationId,
          },
        });

        const start12 = new Date();
        start12?.setHours(12, 0, 0, 0);
        const end14 = new Date(start12);
        end14?.setHours(14, 0, 0, 0);

        const totalVisitfrm12_14 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start12, end14],
            },
            organizationId: user?.organizationId,
          },
        });

        const start14 = new Date();
        start14?.setHours(14, 0, 0, 0);
        const end16 = new Date(start14);
        end16?.setHours(16, 0, 0, 0);

        const totalVisitfrm14_16 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start14, end16],
            },
            organizationId: user?.organizationId,
          },
        });

        const start16 = new Date();
        start16?.setHours(16, 0, 0, 0);
        const end18 = new Date(start16);
        end18?.setHours(18, 0, 0, 0);

        const totalVisitfrm16_18 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start16, end18],
            },
            organizationId: user?.organizationId,
          },
        });

        const start18 = new Date();
        start18?.setHours(18, 0, 0, 0);
        const end20 = new Date(start18);
        end20?.setHours(18, 0, 0, 0);

        const totalVisitfrm18_20 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start18, end20],
            },
            organizationId: user?.organizationId,
          },
        });

        const start20 = new Date();
        start20?.setHours(20, 0, 0, 0);
        const end22 = new Date(start20);
        end22?.setHours(22, 0, 0, 0);

        const totalVisitfrm20_22 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start20, end22],
            },
            organizationId: user?.organizationId,
          },
        });

        const start22 = new Date();
        start22?.setHours(22, 0, 0, 0);
        const end24 = new Date(start22);
        end24?.setHours(0, 0, 0, 0);

        const totalVisitfrm22_24 = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [start22, end24],
            },
            organizationId: user?.organizationId,
          },
        });

        let filterData = [
          { id: 1, hours: '00:00-01:59', totalVisit: Number(totalVisitfrm0_2) },
          { id: 2, hours: '02:00-03:59', totalVisit: Number(totalVisitfrm2_4) },
          { id: 3, hours: '04:00-05:59', totalVisit: Number(totalVisitfrm4_6) },
          { id: 4, hours: '06:00-07:59', totalVisit: Number(totalVisitfrm6_8) },
          {
            id: 5,
            hours: '08:00-09:59',
            totalVisit: Number(totalVisitfrm8_10),
          },
          {
            id: 6,
            hours: '10:00-11:59',
            totalVisit: Number(totalVisitfrm10_12),
          },
          {
            id: 7,
            hours: '12:00-13:59',
            totalVisit: Number(totalVisitfrm12_14),
          },
          {
            id: 8,
            hours: '14:00-15:59',
            totalVisit: Number(totalVisitfrm14_16),
          },
          {
            id: 9,
            hours: '16:00-17:59',
            totalVisit: Number(totalVisitfrm16_18),
          },
          {
            id: 10,
            hours: '18:00-19:59',
            totalVisit: Number(totalVisitfrm18_20),
          },
          {
            id: 11,
            hours: '20:00-21:59',
            totalVisit: Number(totalVisitfrm20_22),
          },
          {
            id: 12,
            hours: '22:00-23:59',
            totalVisit: Number(totalVisitfrm22_24),
          },
        ];

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
