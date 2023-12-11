import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateStaffImgDto } from './dto/create-staffImg.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Staff } from './entities/staff.entity';
import * as Util from '../../utils/index';
import { staffImageUploadProfile } from 'src/helper/staffProfiles';
import { Op } from 'sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { Department } from '../department/entities/department.entity';
import { User } from '../users/entities/user.entity';
const fs = require('fs');
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class StaffService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Staff) private staffModel: typeof Staff,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Organization) private orgModel: typeof Organization,
    private staffImgHelper: staffImageUploadProfile,
  ) {}

  // Create New Staff
  async create(createStaffDto: CreateStaffDto, userId: any) {
    try {
      let user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({
        where: { organizationId: user?.organizationId },
      });

      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      let insertQry = {
        organizationId: createStaffDto?.organizationId,
        organizationName: createStaffDto?.organizationName,
        departmentId: createStaffDto?.departmentId,
        departmentName: createStaffDto?.departmentName,
        title: createStaffDto?.title,
        fullName: createStaffDto?.fullName,
        email: createStaffDto?.email,
        phoneNumber: createStaffDto?.phoneNumber,
        role: createStaffDto?.role,
      };
      console.log(insertQry);

      const new_staff = await this.staffModel?.create({
        ...insertQry,
        organizationId: get_org?.organizationId,
      });
      await new_staff.save();

      return Util?.handleCreateSuccessRespone('Staff Created Successfully');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get All Staffs
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

      const allQueries = await Staff.findAll({
        
        where: { organizationId: get_org?.organizationId },
        attributes: {
          exclude: [
            'organizationName',
            'departmentName',
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
      
      return Util?.handleSuccessRespone(
        allQueries,
        'Staffs Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get Staff By The Id
  async findOne(staffId: string, userId: string) {
    try {
      let user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({
        where: { organizationId: user?.organizationId },
      });

      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const staff = await Staff.findOne({
        attributes: {
          exclude: [
            'organizationName',
            'departmentName',
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
        where: {
          organizationId: get_org?.organizationId,
          staffId,
        },
      });

      if (!staff) {
        return Util?.CustomhandleNotFoundResponse(`Staff not found`);
      }

      return Util?.handleSuccessRespone(
        staff,
        'Staffs Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Staff By The Id
  async update(staffId: string, updateStaffDto: UpdateStaffDto, userId: any) {
    try {
      let user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({
        where: { organizationId: user?.organizationId },
      });

      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const staff_data = await this.staffModel.findOne({
        where: { staffId, organizationId: get_org?.organizationId },
      });
      if (!staff_data) {
        return Util?.handleFailResponse('Staff not found');
      }

      let insertQry = {
        organizationName: updateStaffDto?.organizationName,
        departmentId: updateStaffDto?.departmentId,
        departmentName: updateStaffDto?.departmentName,
        title: updateStaffDto?.title,
        fullName: updateStaffDto?.fullName,
        email: updateStaffDto?.email,
        phoneNumber: updateStaffDto?.phoneNumber,
        role: updateStaffDto?.role,
      };

      await this?.staffModel?.update(insertQry, {
        where: {
          staffId: staff_data?.staffId,
          organizationId: user?.organizationId
        },
      });

      return Util?.SuccessRespone('Staff updated successfully');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Staff Profile Photo By The Id
  async updateImg(
    staffId: string,
    createStaffImgDto: CreateStaffImgDto,
    userId: any,
  ) {
    let rollImage = '';
    try {
      let user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({
        where: { organizationId: user?.organizationId },
      });

      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const staff_data = await this.staffModel.findOne({
        where: { staffId, organizationId: get_org?.organizationId },
      });
      if (!staff_data) {
        return Util?.CustomhandleNotFoundResponse('Staff not found');
      }

      if (
        createStaffImgDto?.profilePhoto == null ||
        createStaffImgDto?.profilePhoto == undefined ||
        createStaffImgDto?.profilePhoto == ''
      ) {
        return Util?.handleFailResponse('File Can not be empty');
      }

      var image_matches = createStaffImgDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file');
      }

      let staff_image = await this?.staffImgHelper?.uploadStaffImage(
        createStaffImgDto?.profilePhoto,
      );

      rollImage = staff_image?.profilePhoto;

      // Delete the old profile photo if it exists in the directorate
      let front_path = staff_data?.profilePhoto;

      if (front_path != null) {
        const s3FilePath = front_path.replace(process.env.AWS_BUCKET_URL, '');
        await this.staffImgHelper.unlinkFile(s3FilePath);
      }
      let insertQry = {
        profilePhoto: staff_image?.profilePhoto,
        imageUrl: staff_image?.imageUrl,
      };
      await this?.staffModel?.update(insertQry, {
        where: {
          staffId: staff_data?.staffId,
          organizationId: get_org?.organizationId,
        },
      });

      return Util?.SuccessRespone('Staff Image updated successfully');
    } catch (error) {
      if (rollImage) {
        await this?.staffImgHelper?.unlinkFile(rollImage);
      }
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Delete Staff By The Id
  async remove(staffId: string, userId: any) {
    try {
      let user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({
        where: { organizationId: user?.organizationId },
      });

      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const staff = await Staff.findOne({
        where: { staffId, organizationId: get_org?.organizationId },
      });
      if (!staff) {
        return Util?.handleFailResponse('Staff not found');
      }

      Object?.assign(staff);
      await staff?.destroy();

      return Util?.handleSuccessRespone(
        Util?.SuccessRespone,
        'Staff deleted successfully',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Search Staff by FullName
  async searchStaff(keyword: string, userId: any) {
    try {
      // console.log(staffId)

      let user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({
        where: { organizationId: user?.organizationId },
      });

      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const staffData = await this?.staffModel.findAll({
        attributes: {
          exclude: [
            'organizationName',
            'departmentName',
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

        where: {
          fullName: { [Op.like]: `%${keyword}%` },
          organizationId: get_org?.organizationId,
        },
      });

      return Util?.handleSuccessRespone(
        staffData,
        'Staffs Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Bulk Create Staff
  async bulkCreateStaff(createStaffDto: CreateStaffDto[], userId: any) {
    const t = await this?.sequelize?.transaction();
    try {
      console.log(userId);

      let user = await this?.userModel.findOne({ where: { userId } });
      console.log(user?.organizationId);
      if (!user) {
        t?.rollback();
        return Util?.CustomhandleNotFoundResponse('User not found');
      }

      let get_org = await this?.orgModel.findOne({
        where: { organizationId: user?.organizationId },
      });
      if (!get_org) {
        t?.rollback;
        return Util?.CustomhandleNotFoundResponse('organization not found');
      }

      // Check for duplicates emails within the same organization
      const duplicateEmail = new Set();
      for (const staffData of createStaffDto) {
        const existingGuest = await Staff?.findOne({
          where: {
            email: staffData?.email,
            organizationId: user?.organizationId,
          },
        });
        if (existingGuest) {
          duplicateEmail?.add(staffData?.email); // Add to the Set
        }
      }
      if (duplicateEmail.size > 0) {
        t.rollback(); // Rollback the transaction if duplicate emails are found
        return Util?.handleErrorRespone(
          'Duplicate emails within this organization: ' +
            [...duplicateEmail].join(', '),
        );
      }

      // Check for duplicates phoneNumbers within the same organization
      const duplicatePhoneNumbers = new Set();
      for (const staffData of createStaffDto) {
        const existingGuest = await Staff?.findOne({
          where: {
            phoneNumber: staffData?.phoneNumber,
            organizationId: user?.organizationId,
          },
        });
        if (existingGuest) {
          duplicatePhoneNumbers?.add(staffData?.phoneNumber); // Add to the Set
        }
      }

      if (duplicatePhoneNumbers.size > 0) {
        t.rollback(); // Rollback the transaction if duplicate phone numbers are found
        return Util?.handleErrorRespone(
          'Duplicate phone numbers within this organization: ' +
            [...duplicatePhoneNumbers].join(', '),
        );
      }

      const createBulk = await this?.staffModel?.bulkCreate(createStaffDto, {
        transaction: t,
      });
      t?.commit();
      console.log(createBulk);

      return Util?.handleCreateSuccessRespone('Satffs created successfully.');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  async findOneByEmail(email: string): Promise<Staff> {
    return await this.staffModel.findOne<Staff>({ where: { email } });
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<Staff> {
    return await this.staffModel.findOne<Staff>({ where: { phoneNumber } });
  }
}
