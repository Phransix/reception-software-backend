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

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff) private staffModel: typeof Staff,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Organization) private orgModel: typeof Organization,
    private staffImgHelper: staffImageUploadProfile,
  ) {}

  // Create New Staff
  async create(createStaffDto: CreateStaffDto,userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');


      var image_matches = createStaffDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file');
      }

      let staff_image = await this?.staffImgHelper?.uploadStaffImage(
        createStaffDto?.profilePhoto,
      );

      let insertQry = {
        organizationId: createStaffDto?.organizationId,
        organizationName: createStaffDto?.organizationName,
        departmentId: createStaffDto?.departmentId,
        departmentName: createStaffDto?.departmentName,
        title: createStaffDto?.title,
        fullName: createStaffDto?.fullName,
        email: createStaffDto?.email,
        phoneNumber: createStaffDto?.phoneNumber,
        // gender: createStaffDto?.gender,
        role: createStaffDto?.role,
        profilePhoto: staff_image,
      };
      console.log(insertQry);

     const new_staff = await this.staffModel?.create({ 
        ...insertQry,
        organizationId:get_org?.organizationId
       });
       await new_staff.save();
    
      return Util?.handleCreateSuccessRespone('Staff Created Successfully');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get All Staffs
  async findAll(page: number, size: number,userId:string) {
    try {
      console.log(userId)
      
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Staffs current page cannot be negative',
        );
      }
      const { limit, offset } = Util.getPagination(page, size);

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');


      const allQueries = await Staff.findAndCountAll({
        limit,
        offset,
        where:{organizationId:get_org?.organizationId},
        attributes: { exclude: ['organizationName','departmentName','createdAt', 'updatedAt', 'deletedAt'] },
        order: [
          ['createdAt', 'ASC']
        ],

        include:[
          {
          model: Organization,
          attributes:{
            exclude:[
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "isVerified",
            ]
          },
        },
        {
          model:Department,
          attributes:{
            exclude:[
              'organizationId',
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
            ]
          }
        },  
      ]

      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Staffs Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get Staff By The Id
  async findOne(staffId: string,userId:string) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const staff = await Staff.findOne({
        attributes: { exclude: ['organizationName','departmentName','createdAt', 'updatedAt', 'deletedAt'] },
        order: [
          ['createdAt', 'ASC']
        ],

        include:[
          {
          model: Organization,
          attributes:{
            exclude:[
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "isVerified",
            ]
          },
        },
        {
          model:Department,
          attributes:{
            exclude:[
              'organizationId',
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
            ]
          }
        },  
      ],
        where: { 
          organizationId:get_org?.organizationId,
          staffId,
         },
      });

      if (!staff) {
        return Util?.CustomhandleNotFoundResponse(
          `Staff with this id not found`,
        );
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
  async update(staffId: string, updateStaffDto: UpdateStaffDto,userId:any) {
  
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');


      const staff_data = await this.staffModel.findOne({ where: { staffId , organizationId:get_org?.organizationId,} });
      if (!staff_data) {
        return Util?.handleFailResponse(
          'Staff with this #${staffId} not found',
        );
      }

      let insertQry = {
      
        organizationName: updateStaffDto?.organizationName,
        departmentName: updateStaffDto?.departmentName,
        title: updateStaffDto?.title,
        fullName: updateStaffDto?.fullName,
        email: updateStaffDto?.email,
        phoneNumber: updateStaffDto?.phoneNumber,
        role: updateStaffDto?.role,
        
      };

      await this?.staffModel?.update(insertQry, {
        where: { 
          staffId: staff_data?.staffId
        },
      });

      return Util?.SuccessRespone(
        'Staff with this #${staffId} updated successfully',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Staff Profile Photo By The Id
  async updateImg(staffId: string, createStaffImgDto: CreateStaffImgDto,userId:any) {
    let rollImage = '';
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      
      const staff_data = await this.staffModel.findOne({ where: { staffId ,organizationId:get_org?.organizationId} });
      if (!staff_data) {
        return Util?.CustomhandleNotFoundResponse(
          'Staff with this #${staffId} not found',
        );
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

      rollImage = staff_image;

      // Delete the old profile photo if it exists in the directorate
      let front_path = staff_data?.profilePhoto;

      if (front_path != null) {
        fs.access(front_path, fs.F_OK, async (err) => {
          if (err) {
            console.error(err);
            return;
          }
          await this.staffImgHelper.unlinkFile(front_path);
        });
      }
      let insertQry = {
        profilePhoto: staff_image,
      };
      await this?.staffModel?.update(insertQry, {
        where: { 
          staffId: staff_data?.staffId,
          organizationId:get_org?.organizationId
         },
      });

      return Util?.SuccessRespone(
        'Staff with this #${staffId}  Image updated successfully',
      );
    } catch (error) {
      if (rollImage) {
        await this?.staffImgHelper?.unlinkFile(rollImage);
      }
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Delete Staff By The Id
  async remove(staffId: string,userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const staff = await Staff.findOne({ where: { staffId ,organizationId:get_org?.organizationId} });
      if (!staff) {
        return Util?.handleFailResponse(
          'Staff with this #${staffId} not found',
        );
      }

      await this?.staffModel?.destroy();

      return Util?.handleSuccessRespone(
        Util?.SuccessRespone,
        'Staff with this #${staffId}  deleted successfully',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Search Staff by FullName
  async searchStaff(keyword: string,userId:any) {
    try {
      // console.log(staffId)

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const staffData = await this?.staffModel.findAll({
       
        attributes: { exclude: ['organizationName','departmentName','createdAt', 'updatedAt', 'deletedAt'] },
        order: [
          ['createdAt', 'ASC']
        ],

        include:[
          {
          model: Organization,
          attributes:{
            exclude:[
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "isVerified",
            ]
          },
        },
        {
          model:Department,
          attributes:{
            exclude:[
              'organizationId',
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
            ]
          }
        },  
      ],

        where: {
          fullName: { [Op.like]: `%${keyword}%` },
          organizationId:get_org?.organizationId
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

  async findOneByEmail(email: string): Promise<Staff> {
    return await this.staffModel.findOne<Staff>({ where: { email } });
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<Staff> {
    return await this.staffModel.findOne<Staff>({ where: { phoneNumber } });
  }
}
