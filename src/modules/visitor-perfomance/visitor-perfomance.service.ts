import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Guest } from '../guest/entities/guest.entity';
import { Purpose } from '../purpose/entities/purpose.entity';
import * as Util from '../../utils/index';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { MONTHS, filter } from './months.DTO';
import { Op } from 'sequelize';

@Injectable()
export class VisitorPerfomanceService {
  constructor(
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(Guest) private guestModel: typeof Guest,
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
  ) {}

  async getVisitorPerformance(filteredDatas:any,  userId: any) {
    // let filteredData = {};
   

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

      if(filteredDatas === filter?.MONTH){

        const today = new Date();
        today?.setHours(0, 0, 0, 0);

      // January Data
       MONTHS?.JANUARY

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
       MONTHS?.FEBRUARY
  
        const firstDayOfFeb = new Date(
          today?.getFullYear(), 1, 1, 0, 0, 0, 0);

        const firstDayOfMarchs = new Date( 
          today?.getFullYear(), 2,1,0,0,0,0)

        const totalVisitInFeb = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfFeb, firstDayOfMarchs],
            },
            organizationId: user?.organizationId,
          },
        });

      

      // March Data
       MONTHS?.MARCH
        const firstDayOfMarch = new Date(today?.getFullYear(),2,1,0,0,0,0)
        const firstDayOfAprils= new Date( today?.getFullYear(),3,1,0,0,0,0)

        const totalVisitInMarch = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfMarch, firstDayOfAprils],
            },
            organizationId: user?.organizationId,
          },
        });

      

      // April Data
       MONTHS?.APRIL
        
        const firstDayOfApril = new Date(today?.getFullYear(),3,1,0,0,0,0)
    
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
       MONTHS?.MAY
    
        const firstDayOfMay = new Date( today?.getFullYear(), 4, 1, 0, 0, 0, 0);
        const firstDayOfJunes = new Date(today?.getFullYear(), 5, 1, 0, 0, 0, 0);
          
        const totalVisitInMay = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfMay, firstDayOfJunes],
            },
            organizationId: user?.organizationId,
          },
        });

      

      // June Data
       MONTHS?.JUNE
        
        const firstDayOfJune = new Date(today?.getFullYear(), 5, 1, 0, 0, 0, 0);
        const firstDayOfJulys = new Date(today?.getFullYear(), 6, 1, 0, 0, 0, 0);

        const totalVisitInJune = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfJune, firstDayOfJulys],
            },
            organizationId: user?.organizationId,
          },
        });
      

      // July Data
       MONTHS?.JULY

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
       MONTHS?.AUGUST
        
        const firstDayOfAug = new Date(today?.getFullYear(), 7, 1, 0, 0, 0, 0);
        const firstDayOfSepts = new Date(today?.getFullYear(), 8, 1, 0, 0, 0, 0);

        const totalVisitInAug = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfAug, firstDayOfSepts],
            },
            organizationId: user?.organizationId,
          },
        });

      
      

      // September Data
       MONTHS?.SEPTEMBER
       
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
       MONTHS?.OCTOBER
        const firstDayOfOct = new Date(today?.getFullYear(), 9, 1, 0, 0, 0, 0);
        const firstDayOfNovs = new Date(today?.getFullYear(), 10, 1, 0, 0, 0, 0);

        const totalVisitInOct = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfOct, firstDayOfNovs],
            },
            organizationId: user?.organizationId,
          },
        });

      
      

      // November Data
       MONTHS?.NOVEMBER
        const firstDayOfNov = new Date(today?.getFullYear(), 10, 1, 0, 0, 0, 0);
        const firstDayOfDecs = new Date(today?.getFullYear(), 11, 1, 0, 0, 0, 0);

        const totalVisitInNov = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfNov, firstDayOfDecs],
            },
            organizationId: user?.organizationId,
          },
        });

      
      

      // December Data
       MONTHS?.DECEMBER
        const firstDayOfDec = new Date(today?.getFullYear(), 11, 1, 0, 0, 0, 0);
        const firstDayOfJans= new Date(today?.getFullYear(), 12, 1, 0, 0, 0, 0);

        const totalVisitInDec = await this?.guestModel?.count({
          where: {
            createdAt: {
              [Op.between]: [firstDayOfDec, firstDayOfJans],
            },
            organizationId: user?.organizationId,
          },
        });

       let  filteredData = {
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

    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }
}
