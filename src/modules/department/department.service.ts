import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import * as Util from '../../utils/index';
import * as Abstract from '../../utils/abstract';
import { Op } from 'sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { deptProfileUpload } from 'src/helper/departmentProfile';
import { CreateDepartImgDto } from './dto/create-departImage.dto';
const fs = require('fs');

@Injectable()
export class DepartmentService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
    private readonly deptImageHelper: deptProfileUpload,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Organization) private orgModel: typeof Organization,
  ) {}

  // Create New Department
  async create(createDepartmentDto: CreateDepartmentDto,userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(userId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})
      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      var image_matches = createDepartmentDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if(!image_matches){
        return Util?.handleFailResponse('Invalid Input file');
      }

      let dept_image = await this?.deptImageHelper?.uploadDeptImage(
        createDepartmentDto?.profilePhoto
      )

      const insertQry ={
        organizationId: createDepartmentDto?.organizationId,
        departmentName: createDepartmentDto?.departmentName,
        departmentRoomNumber: createDepartmentDto?.departmentRoomNum,
        profilePhoto: dept_image
      }
      console.log(insertQry);

      const new_dept = await Department?.create({
        ...insertQry,
        organizationId:get_org?.organizationId
      })
      await new_dept.save();
      return Util?.handleCreateSuccessRespone(
        'Department created successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get All Departments
  async findAll(page: number, size: number, userId:any) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Departments current page cannot be negative',
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

      const allQueries = await Department.findAndCountAll({
        limit,
        offset,
        where:{organizationId:get_org?.organizationId},
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        order: [
          ['createdAt', 'ASC']
        ],

        include:[{
          model: Organization,
           attributes:{
            exclude:[
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "isVerified",
            ]
           }
        }],

      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      
      return Util?.handleSuccessRespone(
        dataResult,
        'Departments Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get One Department By The departmentId
  async findOne(departmentId: string, userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const data = await Department.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        include:[{
          model: Organization,
           attributes:{
            exclude:[
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "isVerified",
            ]
           }
        }],
        where: { departmentId ,organizationId:get_org?.organizationId},
      });

      if (!data) {
        return Util?.CustomhandleNotFoundResponse('Department not found');
      }
      return Util?.handleSuccessRespone(
        data,
        'Department retrieve successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Department By The departmentId
  async update(departmentId: string, updateDepartmentDto: UpdateDepartmentDto,userId:any) {
    let rollImage = ""
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const dept_data = await Department.findOne({ where: { departmentId ,organizationId:get_org?.organizationId} });
      if (!dept_data) {
        return Util?.CustomhandleNotFoundResponse(
          'Department with this #${departmentId} not found',
        );
      }

      var image_matches = updateDepartmentDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file');
      }

      let dept_image = await this?.deptImageHelper?.uploadDeptImage(
        updateDepartmentDto?.profilePhoto,
      );
      rollImage = dept_image;

        // Delete the old profile photo if it exists in the directorate
        let front_path = dept_data?.profilePhoto;

      if (front_path != null) {
        fs.access(front_path, fs.F_OK, async (err) => {
          if (err) {
            console.error(err);
            return;
          }
          await this?.deptImageHelper.unlinkFile(front_path);
        });
      }

       let insertQry = {
        organizationId: updateDepartmentDto?.organizationId,
        departmentName: updateDepartmentDto?.departmentName,
        departmentRoomNumber: updateDepartmentDto?.departmentRoomNum,
        profilePhoto: dept_image
       }   

       await this?.departmentModel.update(
          insertQry,
        {where:{
          departmentId:dept_data?.departmentId
        }}
       )
      
      return Util?.SuccessRespone(
        'Department with this #${departmentId} updated successfully',
      );
    } catch (error) {
      if (rollImage) {
        await this?.deptImageHelper?.unlinkFile(rollImage);
      }
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Department Profile Photo By The departmentId
  async updateDeptImage(departmentId:string,createDepartImageDto:CreateDepartImgDto,userId:any){
    let rollImage = '';
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const dept_data = await this?.departmentModel?.findOne({where:{departmentId, organizationId:get_org?.organizationId}})
      if(!dept_data){
        return Util?.CustomhandleNotFoundResponse(
          'Department with this #${staffId} not found',
        );
      }

      if (
        createDepartImageDto?.profilePhoto == null ||
        createDepartImageDto?.profilePhoto == undefined ||
        createDepartImageDto?.profilePhoto == ''
      ) {
        return Util?.handleFailResponse('File Can not be empty');
      }

      var image_matches = createDepartImageDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file');
      }

      let dept_image = await this?.deptImageHelper?.uploadDeptImage(
        createDepartImageDto?.profilePhoto
      )

      rollImage = dept_image;


      // Delete the old profile photo if it exists in the directorate
      let front_path = dept_data?.profilePhoto;

      if (front_path != null) {
        fs.access(front_path, fs.F_OK, async (err) => {
          if (err) {
            console.error(err);
            return;
          }
          await this?.deptImageHelper?.unlinkFile(front_path);
        });
      }

      let insertQry = {
        profilePhoto: dept_image
      };

      await this?.departmentModel?.update(
        insertQry,
        {where:{
          departmentId:dept_data?.departmentId,
          organizationId:get_org?.organizationId
        }}
      );
      return Util?.SuccessRespone(
        'Staff with this id, Image updated successfully',
      );
      
    } catch (error) {
      if (rollImage) {
        await this?.deptImageHelper?.unlinkFile(rollImage);
      }
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Delete Department By The DepartmentId
  async remove(departmentId: string,userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const data = await Department.findOne({ where: { departmentId  ,organizationId:get_org?.organizationId} });
      if (!data) {
        return Util?.CustomhandleNotFoundResponse(
          'Department with this #${departmentId} not found',
        );
      }

      Object.assign(data);
      await data.destroy();
      return Util?.SuccessRespone(
        `Department with this #${departmentId}  deleted successfully`,
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Search Department By  Name
  async searchDepartment(keyword: string,userId:any) {
    try {


      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');


      const deptData = await this?.departmentModel.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        order: [
          ['createdAt', 'ASC']
        ],
        include:[{
          model: Organization,
           attributes:{
            exclude:[
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "isVerified",
            ]
           }
        }],
        where: {
          departmentName: { [Op.like]: `%${keyword}%` },
          organizationId:get_org?.organizationId,
        },
      });

      return Util?.handleSuccessRespone(
        deptData,
        'Departments Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  async findOneByorganizationName(departmentName: string): Promise<Department> {
    return await this.departmentModel.findOne<Department>({ where: { departmentName } })
  }




}
