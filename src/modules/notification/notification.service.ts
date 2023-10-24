import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import * as Util from '../../utils/index'
import { InjectModel } from '@nestjs/sequelize';
import { Purpose } from '../purpose/entities/purpose.entity';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {

  constructor(
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Notification) private readonly NotificationModel: typeof Notification
  ) {}

  async create(createNotificationDto: CreateNotificationDto, userId: any) {
   try {

    let user = await this?.UserModel.findOne({ where: { userId } })
    console.log(userId)
    if (!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

    let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })
    if (!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');
    
    const createNotification = await this.NotificationModel?.create({
      ...createNotificationDto,
      organizationId: get_org?.organizationId
    })
    await createNotification.save();
    return Util?.handleCreateSuccessRespone("Notification Created Successsfully")
   } catch (error) {
    console.log(error)
    return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
   }
  }

  async findAll(userId: string) {
    try {
      
      console.log(userId)
  
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');
      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const getAllStatus = await this.NotificationModel.findAll({
        where: {
          organizationId: get_org?.organizationId
        },
        include: [
          {
            model: Purpose,
            attributes: {
              exclude: [
                'id',
                'guestId',
                'organizationId',
                'departmentId',
                'staffId',
                'signInDate',
                'signInTime',
                'signOutTime',
                'isLogOut',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'purposeStatus'
          }
        ]
      })
      return Util?.handleSuccessRespone(getAllStatus, 'Notifications Data retrieved Successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error))
    }
  }


  async update(notificationId: string, updateNotificationDto: UpdateNotificationDto, userId: any) {
    
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const updateNotice = await Notification.findOne({where: {notificationId,organizationId: get_org?.organizationId}})
      Object.assign(updateNotice, updateNotificationDto);
      await updateNotice.save()

      return Util?.handleSuccessRespone(Util?.SuccessRespone, 'Delivery Data successfully updated')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }

  }

  async remove(notificationId: string, userId: any) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const removeNotification = await Notification.findOne({ where: { notificationId, organizationId: get_org?.organizationId } });
      await removeNotification.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Delivery Data deleted Successfully")

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }
}
