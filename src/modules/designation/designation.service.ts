import { Injectable } from '@nestjs/common';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { User } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Designation } from './entities/designation.entity';
import * as Util from '../../utils/index';
import { Organization } from '../organization/entities/organization.entity';
import { Department } from '../department/entities/department.entity';

@Injectable()
export class DesignationService {
  constructor(
    @InjectModel(Designation) private designationModel: typeof Designation,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Organization) private orgModel: typeof Organization,
  ) {}

  // Create New Designation
  async create(createDesignationDto: CreateDesignationDto, userId: string) {
    try {
      const user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) {
        return Util?.CustomhandleNotFoundResponse('User not found');
      }

      let get_org = await this?.orgModel?.findOne({
        where: { organizationId: user?.organizationId },
      });
      if (!get_org) {
        return Util?.CustomhandleNotFoundResponse('organization not found');
      }

      const new_designation = await this?.designationModel.create({
        ...createDesignationDto,
        organizationId: get_org?.organizationId,
      });
      await new_designation?.save();

      return Util?.handleCreateSuccessRespone(
        'Designation Created Successfully',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
    
  }

  // Get All Designation
  async findAll( userId: string) {
    try {
      console.log(userId);

      let user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({
        where: { organizationId: user?.organizationId },
      });

      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const allQueries = await Designation.findAll({
        where: { organizationId: get_org?.organizationId },
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'deletedAt',
          ],
        },
        order: [['createdAt', 'ASC']],

        include: [
          {
            model: Organization,
            attributes: {
              exclude: [
                'id',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'isVerified',
              ],
            },
          },
          {
            model: Department,
            attributes: {
              exclude: [
                'organizationId',
                'id',
                'createdAt',
                'updatedAt',
                'deletedAt',
              ],
            },
          },
        ],
      });


      const dataResult = [
        { ...allQueries }
      ];
      return Util?.handleSuccessRespone(
        dataResult,
        'Designations Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Designation By The Id
  async update(designationId: string, updateDesignationDto: UpdateDesignationDto, userId: any) {
    try {
      let user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({
        where: { organizationId: user?.organizationId },
      });

      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const designation_data = await this.designationModel.findOne({
        where: { designationId, organizationId: get_org?.organizationId },
      });
      if (!designation_data) {
        return Util?.handleFailResponse('Designation not found');
      }

      await this?.designationModel?.update(updateDesignationDto, {
        where: {
          designationId: designation_data?.designationId,
          organizationId: user?.organizationId
        },
      });

      return Util?.SuccessRespone('Designation updated successfully');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


// Delete Staff By The Id
async remove(designationId: string, userId: any) {
  try {
    let user = await this?.userModel.findOne({ where: { userId } });
    console.log(user?.organizationId);
    if (!user) return Util?.CustomhandleNotFoundResponse('User not found');

    let get_org = await this?.orgModel.findOne({
      where: { organizationId: user?.organizationId },
    });

    if (!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

    const designation = await Designation.findOne({
      where: { designationId, organizationId: get_org?.organizationId },
    });
    if (!designation) {
      return Util?.handleFailResponse('Designation not found');
    }

    Object?.assign(designation);
    await designation?.destroy();

    return Util?.handleSuccessRespone(
      Util?.SuccessRespone,
      'Designation data deleted successfully',
    );
  } catch (error) {
    console.log(error);
    return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
  }
}

async findOneByDesignationName(designation_name:string): Promise<Designation>{
  return await this?.designationModel?.findOne<Designation>({where:{designation_name}})
}


}
