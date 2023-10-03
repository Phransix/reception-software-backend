import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Guest } from '../guest/entities/guest.entity';
import { Purpose } from '../purpose/entities/purpose.entity';
import * as Util from '../../utils/index';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { MONTHS } from './months.DTO';
import { Op } from 'sequelize';

@Injectable()
export class VisitorPerfomanceService {
  constructor(
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(Guest) private guestModel: typeof Guest,
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
  ) {}

  async getVisitorPerformance(months: any, userId: any) {
    let filteredData = {};

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

      // January Data
      if (months === MONTHS?.JANUARY) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfJan = new Date(
          today?.getFullYear(), 0, 1, 0, 0, 0, 0);

        const firstDayOfFeb = new Date(
          today?.getFullYear(), 1, 1, 0, 0, 0, 0);

        const totalVisitInJan = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfJan, firstDayOfFeb],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          vistInJan: Number(totalVisitInJan),
        };
      }

      // February Data
      if (months === MONTHS?.FEBRUARY) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfFeb = new Date(
          today?.getFullYear(), 1, 1, 0, 0, 0, 0);

        const firstDayOfMarch = new Date( 
          today?.getFullYear(), 2,1,0,0,0,0)

        const totalVisitInFeb = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfFeb, firstDayOfMarch],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          vistInFeb: Number(totalVisitInFeb),
        };
      }

      // March Data
      if (months === MONTHS?.MARCH) {
        const today = new Date();

        const firstDayOfMarch = new Date(today?.getFullYear(),2,1,0,0,0,0)
      
        const firstDayOfApril = new Date( today?.getFullYear(),3,1,0,0,0,0)

        const totalVisitInMarch = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfMarch, firstDayOfApril],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          vistInMarch: Number(totalVisitInMarch),
        };
      }

      // April Data
      if (months === MONTHS?.APRIL) {
        const today = new Date();today?.setHours(0, 0, 0, 0);

        const firstDayOfApril = new Date(today?.getFullYear(),3,1,0,0,0,0)
    
        const firstDayOfMay = new Date(today?.getFullYear(), 4, 1, 0, 0, 0, 0);

        const totalVisitInApril = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfApril, firstDayOfMay],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          vistInApril: Number(totalVisitInApril),
        };
      }

      // May Data
      if (months === MONTHS?.MAY) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfMay = new Date( today?.getFullYear(), 4, 1, 0, 0, 0, 0);
         
        const firstDayOfJune = new Date(today?.getFullYear(), 5, 1, 0, 0, 0, 0);
          
        const totalVisitInMay = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfMay, firstDayOfJune],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          vistInMay: Number(totalVisitInMay),
        };
      }

      // June Data
      if (months === MONTHS?.JUNE) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfJune = new Date(today?.getFullYear(), 5, 1, 0, 0, 0, 0);
        const firstDayOfJuly = new Date(today?.getFullYear(), 6, 1, 0, 0, 0, 0);

        const totalVisitInJune = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfJune, firstDayOfJuly],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          vistInJune: Number(totalVisitInJune),
        };
      }

      // July Data
      if (months === MONTHS?.JULY) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfJuly = new Date(today?.getFullYear(), 6, 1, 0, 0, 0, 0);
        const firstDayOfAug = new Date(today?.getFullYear(), 7, 1, 0, 0, 0, 0);

        const totalVisitInJuly = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfJuly, firstDayOfAug],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          visitInJuly: Number(totalVisitInJuly),
        };
      }

      // August Data
      if (months === MONTHS?.AUGUST) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfAug = new Date(today?.getFullYear(), 7, 1, 0, 0, 0, 0);
        const firstDayOfSept = new Date(today?.getFullYear(), 8, 1, 0, 0, 0, 0);

        const totalVisitInAug = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfAug, firstDayOfSept],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          visitInAug: Number(totalVisitInAug),
        };
      }

      // September Data
      if (months === MONTHS?.SEPTEMBER) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfSept = new Date(today?.getFullYear(), 8, 1, 0, 0, 0, 0);
        const firstDayOfOct = new Date(today?.getFullYear(), 9, 1, 0, 0, 0, 0);

        const totalVisitInSept = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfSept, firstDayOfOct],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          visitInSept: Number(totalVisitInSept),
        };
      }

      // October Data
      if (months === MONTHS?.OCTOBER) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfOct = new Date(today?.getFullYear(), 9, 1, 0, 0, 0, 0);
        const firstDayOfNov = new Date(today?.getFullYear(), 10, 1, 0, 0, 0, 0);

        const totalVisitInOct = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfOct, firstDayOfNov],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          visitInOct: Number(totalVisitInOct),
        };
      }

      // November Data
      if (months === MONTHS?.NOVEMBER) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfNov = new Date(today?.getFullYear(), 10, 1, 0, 0, 0, 0);
        const firstDayOfDec = new Date(today?.getFullYear(), 11, 1, 0, 0, 0, 0);

        const totalVisitInNov = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfNov, firstDayOfDec],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          visitInDec: Number(totalVisitInNov),
        };
      }

      // December Data
      if (months === MONTHS?.DECEMBER) {
        const today = new Date();
        today?.setHours(0, 0, 0, 0);

        const firstDayOfDec = new Date(today?.getFullYear(), 11, 1, 0, 0, 0, 0);
        const firstDayOfJan = new Date(today?.getFullYear(), 12, 1, 0, 0, 0, 0);

        const totalVisitInDec = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfDec, firstDayOfJan],
            },
            organizationId: user?.organizationId,
          },
        });

        filteredData = {
          visitInDec: Number(totalVisitInDec),
        };
      }

      return Util?.handleSuccessRespone(
        filteredData,
        'Data requested successfully',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }
}
