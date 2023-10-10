import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Sequelize } from 'sequelize-typescript';
import * as Util from '../../utils/index'
// import { VisitorLog } from './entities/visitor-log.entity';

@Injectable()
export class VisitorLogsService {

  constructor (
    @InjectModel (Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(User) private readonly UserModel: typeof User,
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


}
