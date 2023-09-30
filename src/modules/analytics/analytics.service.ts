import { Injectable } from '@nestjs/common';
import { GuestService } from '../guest/guest.service';
import { PurposeService } from '../purpose/purpose.service';
import { DeliveryService } from '../delivery/delivery.service';
import { EnquiriesService } from '../enquiries/enquiries.service';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import * as Util from '../../utils/index'

@Injectable()
export class AnalyticsService {

  constructor(
    private readonly guestService:GuestService,
    private readonly purposeService:PurposeService,
    private readonly deliveryService:DeliveryService,
    private readonly enquiryService:EnquiriesService,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(User) private readonly UserModel: typeof User
  ) {}


  async getAllCombinedData(
    guest:string,
    delivery:string,
    guestpurpose:string,
    enquirypurpose:string,
    page: number, 
    size: number,
    userId: any
  ) {
    try {
      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');
      
      const guestGender = await this.purposeService.genderFilterCount
      (
        guest,
        userId
      )
      const deliveryType = await this.deliveryService.deliveryTypeCount
      (
        delivery,
        userId
      )
      const guestPurpose = await this.purposeService.guestPurposeCount
      (
        guestpurpose,
        userId
      )
      const enquiryPurpose = await this.enquiryService.purposefilter
      (
        enquirypurpose,
        page,
        size,
        userId
      )
      
      return {
        guestGender,
        deliveryType,
        guestPurpose,
        enquiryPurpose
      }
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

}
