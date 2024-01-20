import { Injectable } from '@nestjs/common';
import * as Util from '../../utils/index'
import { InjectModel } from '@nestjs/sequelize';
import { Purpose } from '../purpose/entities/purpose.entity';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { Guest } from '../guest/entities/guest.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Department } from '../department/entities/department.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class NotificationService {

  constructor(
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Notification) private readonly NotificationModel: typeof Notification,
    private readonly sequelize: Sequelize,
  ) {}
  
  // Creating Bulk NOtifications
  async bulkNotification(createNotificationDto: CreateNotificationDto[], userId: any) {
    const t = await this.sequelize.transaction();
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user) {
        t.rollback();
        return Util?.handleErrorRespone('User not found');
      }

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org) {
        t.rollback();
        return Util?.handleErrorRespone('organization not found');
      }

      const createMultipleNotification = await this.NotificationModel.bulkCreate(createNotificationDto, { transaction: t })
      
      t.commit()
      return Util?.handleCreateSuccessRespone("Notifications Created Successfully")

    } catch (error) {
      t.rollback()
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get all Notifications
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
        order: [['id', 'DESC']],
        include: [
          {
            model: Purpose,
            attributes: {
              exclude: [
                'id',
                'guestId',
                'purposeId',
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
          },
          {
            model: Guest,
            attributes: {
              exclude: [
                'id',
                'guestId',
                'organizationId',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'guestData'
          },
          {
            model: Department,
            attributes: {
              exclude: [
                'id',
                'organizationId',
                'departmentId',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'departmentData'
          },
          {
            model: Staff,
            attributes: {
              exclude: [
                'id',
                'departmentId',
                'organizationId',
                'staffId',
                'organizationName',
                'departmentName',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'staffData'
          }
        ]
      })
      return Util?.handleSuccessRespone(getAllStatus, 'Notifications Data retrieved Successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

    // Get Notification by notificationId
    async findOne(notificationId: string, userId: any) {
      try {
        console.log(userId)
        let user = await this?.UserModel.findOne({ where: { userId } })
        console.log(user?.organizationId)
        if (!user)
          return Util?.handleErrorRespone('User not found');
  
        let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })
  
        if (!get_org)
          return Util?.handleErrorRespone('organization not found');
        const getOneNotification = await Notification.findOne({
          include: [
            {
              model: Purpose,
              attributes: {
                exclude: [
                  'id',
                  'guestId',
                  'purposeId',
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
            },
            {
              model: Guest,
              attributes: {
                exclude: [
                  'id',
                  'guestId',
                  'organizationId',
                  'createdAt',
                  'updatedAt',
                  'deletedAt'
                ]
              },
              order: [['id', 'DESC']],
              as: 'guestData'
            },
            {
              model: Department,
              attributes: {
                exclude: [
                  'id',
                  'organizationId',
                  'departmentId',
                  'createdAt',
                  'updatedAt',
                  'deletedAt'
                ]
              },
              order: [['id', 'DESC']],
              as: 'departmentData'
            },
            {
              model: Staff,
              attributes: {
                exclude: [
                  'id',
                  'departmentId',
                  'organizationId',
                  'staffId',
                  'organizationName',
                  'departmentName',
                  'createdAt',
                  'updatedAt',
                  'deletedAt'
                ]
              },
              order: [['id', 'DESC']],
              as: 'staffData'
            }
          ],
          where: { 
            notificationId,
            organizationId: get_org?.organizationId 
          },
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
        });
        return Util?.handleSuccessRespone(getOneNotification, "Notification retrieved successfully")
      } catch (error) {
        console.log(error)
        return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
      }
    }
 
  // Update notification status
  async updateStatus(notificationId: string,userId: any) {
    
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
      await Notification.update({ status: 'read'},{where: {notificationId}})

      return Util?.handleSuccessRespone(Util?.SuccessRespone, 'Notification status successfully updated')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }

  }

  // Delete notification
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
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Notifications Data deleted Successfully")

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }
}
