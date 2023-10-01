import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import * as Util from '../../utils/index'
import { Purpose } from '../purpose/entities/purpose.entity';
import { Guest } from '../guest/entities/guest.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { Enquiry } from '../enquiries/entities/enquiry.entity';

export enum Analytics {
  GENDER = 'gender',
  DELIVERY = 'delivery',
  PURPOSE = 'purpose',
  ENQUIRY = 'enquiry'
}

@Injectable()
export class AnalyticsService {

  constructor(

    @InjectModel(Guest) private readonly GuestModel: typeof Guest,
    @InjectModel(Enquiry) private readonly EnquiryModel: typeof Enquiry,
    @InjectModel(Delivery) private readonly DeliveryModel: typeof Delivery,
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(User) private readonly UserModel: typeof User
  ) {}


  async getAllCombinedData(
    analytics : any,
    userId: any
  ) {
  
   
    

    let filterData = {}
    try {
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');
      if(analytics === Analytics?.PURPOSE){


        const getPersonalPurposeCount = await this.PurposeModel.count({
          where: {
            purpose : 'personal',
            organizationId: user?.organizationId
          }
        })
  
        const getOfficialPurposeCount = await this.PurposeModel.count({
          where: {
            purpose : 'official',
            organizationId: user?.organizationId
          }
        })

         filterData = {
          personal : Number(getPersonalPurposeCount),
          official : Number(getOfficialPurposeCount)
        }
      

      }

      if(analytics === Analytics?.GENDER){


        const getMaleCount = await this.GuestModel.count({
          where: {
            gender : 'male',
            organizationId: user?.organizationId
          }
        })
  
        const getFemaleCount = await this.GuestModel.count({
          where: {
            gender : 'female',
            organizationId: user?.organizationId
          }
        })

         filterData = {
          male : Number(getMaleCount),
          female : Number(getFemaleCount)
        }
      
      }

      if(analytics === Analytics?.DELIVERY){


        const getFoodCount = await this.DeliveryModel.count({
          where: {
            type : 'food',
            organizationId: user?.organizationId
          }
        })
  
        const getDocumentCount = await this.DeliveryModel.count({
          where: {
            type : 'document',
            organizationId: user?.organizationId
          }
        })

        const getOtherCount = await this.DeliveryModel.count({
          where: {
            type : 'other',
            organizationId: user?.organizationId
          }
        })

         filterData = {
          food : Number(getFoodCount),
          document : Number(getDocumentCount),
          other : Number(getOtherCount)
        }
      
      }


      if(analytics === Analytics?.ENQUIRY){

        const getOfficialCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Official',
            organizationId: user?.organizationId
          }
        })
  
        const getPersonalCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Personal',
            organizationId: user?.organizationId
          }
        })

        const getPartnershipCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Partnership',
            organizationId: user?.organizationId
          }
        })

        const getLegalCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Legal',
            organizationId: user?.organizationId
          }
        })

        const getCareerCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Career',
            organizationId: user?.organizationId
          }
        })

        const getSalesCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Sales',
            organizationId: user?.organizationId
          }
        })

        const getComplaintsCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Complaints',
            organizationId: user?.organizationId
          }
        })

        const getPaymentsCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Payments',
            organizationId: user?.organizationId
          }
        })

        const getInvestmentsCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Investments',
            organizationId: user?.organizationId
          }
        })

        const getEventsCount = await this.EnquiryModel.count({
          where: {
            purpose : 'Events',
            organizationId: user?.organizationId
          }
        })

         filterData = {
          official : Number(getOfficialCount),
          personal : Number(getPersonalCount),
          partnership : Number(getPartnershipCount),
          legal : Number(getLegalCount),
          career : Number(getCareerCount),
          sales : Number(getSalesCount),
          complaints : Number(getComplaintsCount),
          payments : Number(getPaymentsCount),
          investments : Number(getInvestmentsCount),
          events : Number(getEventsCount)
        }
      
      }

     return Util?.handleSuccessRespone(filterData, 'Data requested successfully')

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

}
