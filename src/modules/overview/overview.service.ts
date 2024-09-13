import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, } from 'sequelize';
import * as Util from '../../utils/index'
import { Guest } from '../guest/entities/guest.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { Enquiry } from '../enquiries/entities/enquiry.entity';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Purpose } from '../purpose/entities/purpose.entity';

export enum DAYS {

  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LASTWEEK = 'lastweek',
  LASTMONTH = 'lastmonth',
  LASTYEAR = 'lastyear'

}


@Injectable()
export class OverviewService {

  constructor(
    @InjectModel(Guest) private guestModel: typeof Guest,
    @InjectModel(Delivery) private deliveryModel: typeof Delivery,
    @InjectModel(Enquiry) private enquiryModel: typeof Enquiry,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
  ) { }

  async getGeneralOverview(
    days: any,
    userId: any
  ) {

    let filteredData = {}

    try {

      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      if (days === DAYS?.TODAY) {

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Get the next day

        const personalVisitToday = await this.PurposeModel.count({
          where: {
            purpose: 'personal',
            createdAt: {
              [Op.between]: [today, tomorrow],
            },
            organizationId: user?.organizationId
          }
        })

        const officialVisitToday = await this.PurposeModel.count({
          where: {
            purpose: 'official',
            createdAt: {
              [Op.between]: [today, tomorrow],
            },
            organizationId: user?.organizationId
          }
        })

        const signedInDataToday = await this.PurposeModel.count({
          where: {
            visitStatus: 'Signed In',
            createdAt: {
              [Op.between]: [today, tomorrow],
            },
            organizationId: user?.organizationId
          }
        })

        const deliveryDataToday = await this.deliveryModel.count({
          where: {
            createdAt: {
              [Op.between]: [today, tomorrow],
            },
            organizationId: user?.organizationId
          }
        })

        const enquiryDataToday = await this.enquiryModel.count({
          where: {
            createdAt: {
              [Op.between]: [today, tomorrow],
            },
            organizationId: user?.organizationId
          }
        })

        let totalVisits = Number(personalVisitToday) + Number(officialVisitToday)

        filteredData = {
          signedInToday: Number(signedInDataToday),
          totalVisits: Number(totalVisits),
          DeliveryToday: Number(deliveryDataToday),
          EnquiryToday: Number(enquiryDataToday)
        }

      }

      if (days === DAYS?.YESTERDAY) {

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); // Get the previous day


        const personalVisitYesterday = await this.PurposeModel.count({
          where: {
            purpose: 'personal',
            createdAt: {
              [Op.between]: [yesterday, today],
            },
            organizationId: user?.organizationId
          }
        })

        const officialVisitYesterday = await this.PurposeModel.count({
          where: {
            purpose: 'official',
            createdAt: {
              [Op.between]: [yesterday, today],
            },
            organizationId: user?.organizationId
          }
        })

        const signedInDataYesterday = await this.PurposeModel.count({
          where: {
            visitStatus: 'Signed In',
            createdAt: {
              [Op.between]: [yesterday, today],
            },
            organizationId: user?.organizationId
          }
        })

        const deliveryDataYesterday = await this.deliveryModel.count({
          where: {
            createdAt: {
              [Op.between]: [yesterday, today],
            },
            organizationId: user?.organizationId
          }
        })

        const enquiryDataYesterday = await this.enquiryModel.count({
          where: {
            createdAt: {
              [Op.between]: [yesterday, today],
            },
            organizationId: user?.organizationId
          }
        })

        let totalVisits = Number(personalVisitYesterday) + Number(officialVisitYesterday)

        filteredData = {
          signedInYesterday: Number(signedInDataYesterday),
          totalVisits: Number(totalVisits),
          DeliveryYesterday: Number(deliveryDataYesterday),
          EnquiryYesterday: Number(enquiryDataYesterday)
        }

      }

      if (days === DAYS?.LASTWEEK) {

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7); // Get the date from a week ago

        const personalVisitLastWeek = await this.PurposeModel.count({
          where: {
            purpose: 'personal',
            createdAt: {
              [Op.between]: [lastWeek, today],
            },
            organizationId: user?.organizationId
          }
        })

        const officialVisitLastWeek = await this.PurposeModel.count({
          where: {
            purpose: 'official',
            createdAt: {
              [Op.between]: [lastWeek, today],
            },
            organizationId: user?.organizationId
          }
        })

        const signedInDataLastWeek = await this.PurposeModel.count({
          where: {
            visitStatus: 'Signed In',
            createdAt: {
              [Op.between]: [lastWeek, today],
            },
            organizationId: user?.organizationId
          }
        })

        const deliveryDataLastWeek = await this.deliveryModel.count({
          where: {
            createdAt: {
              [Op.between]: [lastWeek, today],
            },
            organizationId: user?.organizationId
          }
        })

        const enquiryDataLastWeek = await this.enquiryModel.count({
          where: {
            createdAt: {
              [Op.between]: [lastWeek, today],
            },
            organizationId: user?.organizationId
          }
        })

        let totalVisits = Number(personalVisitLastWeek) + Number(officialVisitLastWeek)

        filteredData = {
          signedInLastWeek: Number(signedInDataLastWeek),
          totalVisits: Number(totalVisits),
          DeliveryLastWeek: Number(deliveryDataLastWeek),
          EnquiryLastWeek: Number(enquiryDataLastWeek)
        }


      }

      if (days === DAYS?.LASTMONTH) {

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1); // Get the date from last month

        const personalVisitLastMonth = await this.PurposeModel.count({
          where: {
            purpose: 'personal',
            createdAt: {
              [Op.between]: [lastMonth, today],
            },
            organizationId: user?.organizationId
          }
        })

        const officialVisitLastMonth = await this.PurposeModel.count({
          where: {
            purpose: 'official',
            createdAt: {
              [Op.between]: [lastMonth, today],
            },
            organizationId: user?.organizationId
          }
        })

        const signedInDataLastMonth = await this.PurposeModel.count({
          where: {
            visitStatus: 'Signed In',
            createdAt: {
              [Op.between]: [lastMonth, today],
            },
            organizationId: user?.organizationId
          }
        })

        const deliveryDataLastMonth = await this.deliveryModel.count({
          where: {
            createdAt: {
              [Op.between]: [lastMonth, today],
            },
            organizationId: user?.organizationId
          }
        })

        const enquiryDataLastMonth = await this.enquiryModel.count({
          where: {
            createdAt: {
              [Op.between]: [lastMonth, today],
            },
            organizationId: user?.organizationId
          }
        })

        
        let totalVisits = Number(personalVisitLastMonth) + Number(officialVisitLastMonth)

        filteredData = {
          signedInLastMonth: Number(signedInDataLastMonth),
          totalVisits: Number(totalVisits),
          DeliveryLastMonth: Number(deliveryDataLastMonth),
          EnquiryLastMonth: Number(enquiryDataLastMonth)
        }


      }

      if (days === DAYS?.LASTYEAR) {

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1); // Get the date from last year

        const personalVisitLastYear = await this.PurposeModel.count({
          where: {
            purpose: 'personal',
            createdAt: {
              [Op.between]: [lastYear, today],
            },
            organizationId: user?.organizationId
          }
        })

        const officialVisitLastYear = await this.PurposeModel.count({
          where: {
            purpose: 'official',
            createdAt: {
              [Op.between]: [lastYear, today],
            },
            organizationId: user?.organizationId
          }
        })

        const signedInDataLastYear = await this.PurposeModel.count({
          where: {
            visitStatus: 'Signed In',
            createdAt: {
              [Op.between]: [lastYear, today],
            },
            organizationId: user?.organizationId
          }
        })

        const deliveryDataLastYear = await this.deliveryModel.count({
          where: {
            createdAt: {
              [Op.between]: [lastYear, today],
            },
            organizationId: user?.organizationId
          }
        })

        const enquiryDataLastYear = await this.enquiryModel.count({
          where: {
            createdAt: {
              [Op.between]: [lastYear, today],
            },
            organizationId: user?.organizationId
          }
        })

        
        let totalVisits = Number(personalVisitLastYear) + Number(officialVisitLastYear)

        filteredData = {
          signedInLastYear: Number(signedInDataLastYear),
          totalVisits: Number(totalVisits),
          DeliveryLastYear: Number(deliveryDataLastYear),
          EnquiryLastYear: Number(enquiryDataLastYear)
        }


      }

      return Util?.handleSuccessRespone(filteredData, 'Data requested successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error))
    }

  }

}

// Last Month
// const today = new Date();
// today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

// const lastMonth = new Date(today);
// lastMonth.setMonth(today.getMonth() - 1); // Get the date from last month

// Last Year
// const today = new Date();
// today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

// const lastYear = new Date(today);
// lastYear.setFullYear(today.getFullYear() - 1); // Get the date from last year
