import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Sequelize } from 'sequelize-typescript';
import * as Util from '../../utils/index'
import { VisitorLog } from './entities/visitor-log.entity';
import { Purpose } from '../purpose/entities/purpose.entity';
import { Guest } from '../guest/entities/guest.entity';
import { Department } from '../department/entities/department.entity';
import { Staff } from '../staff/entities/staff.entity';

@Injectable()
export class VisitorLogsService {

  constructor (
    @InjectModel (Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
    @InjectModel(VisitorLog) private readonly VisitlogModel: typeof VisitorLog,
    @InjectModel(Guest) private readonly GuestModel: typeof Guest,
    private readonly sequelize: Sequelize
  ) {}

  async saveVisitorLog(VisitorLog: string, data: any[], userId: any) {
    const myModel = this.sequelize.model(VisitorLog);
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

      const createMultipleLogs = await myModel.bulkCreate(data, { transaction: t })
      t.commit()
      return Util?.handleCreateSuccessRespone("Visitorlogs Created Successfully")

    } catch (error) {
      t.rollback()
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Getting logs for a Guest
  async getGuestLogs (userId: any, guestId: string) {
    
    try {
      
      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');
      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found')
      let guest = await this.GuestModel.findOne({where: {guestId}})

      const visitLog = await this.VisitlogModel.findAll({
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
                'updatedAt',
                'deletedAt'
              ]
            },
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
          guestId: guest?.guestId,
          organizationId: get_org?.organizationId
        },
        attributes: { exclude: ['guestId','purposeId','departmentId','organizationId','staffId','createdAt', 'updatedAt', 'deletedAt'] },
        order: [['id', 'DESC']]
      })
      return Util?.handleSuccessRespone(visitLog, 'Visitlog Successful');
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }

  }

      // Filter by Official and Personal Visits count for logs
      async guestPurposeCount( guestId: string,  userId: string, keyword: string) {
        try {
    
          console.log(userId)
          let user = await this?.UserModel.findOne({ where: { userId } })
          console.log(user?.organizationId)
          if (!user)
            return Util?.handleErrorRespone('User not found');
    
          let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })
    
          if (!get_org)
            return Util?.handleErrorRespone('organization not found');
    
          let filter = {}
    
          if (keyword != null) {
            filter = { purpose: keyword }
          }
  
          const purposeLog = await this.VisitlogModel.findOne({
            where:{
              guestId
            }
          })
    
          const getOfficialCount = await this.VisitlogModel.count({
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
                    'updatedAt',
                    'deletedAt'
                  ]
                },
                order: [['id', 'DESC']],
                as: 'purposeData',
                where: {
                  purpose: 'official',
                  guestId: purposeLog?.guestId,
                  organizationId: get_org?.organizationId
                },
              }
            ]
          });
    
          const getPersonalCount = await this.VisitlogModel.count({
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
                    'updatedAt',
                    'deletedAt'
                  ]
                },
                order: [['id', 'DESC']],
                as: 'purposeData',
                where: {
                  purpose: 'personal',
                  guestId: purposeLog?.guestId,
                  organizationId: get_org?.organizationId
                },
              }
            ]
          });
    
          const total = Number(getOfficialCount) + Number(getPersonalCount)
    
          filter = {
            official: Number(getOfficialCount),
            personal: Number(getPersonalCount),
            total: total
          }
          return Util?.handleSuccessRespone(filter, "Purpose Data retrieved Successfully")
        } catch (error) {
          console.log(error)
          return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
        }
      }
}
