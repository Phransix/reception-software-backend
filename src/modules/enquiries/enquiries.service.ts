import { Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { Enquiry } from './entities/enquiry.entity';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import * as Util from '../../utils/index';
import * as Abstract from '../../utils/abstract';
import { Op } from 'sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { error } from 'console';
// import sequelize from 'sequelize';

@Injectable()
export class EnquiriesService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Enquiry) private readonly enquiryModel: typeof Enquiry,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Organization) private orgModel: typeof Organization,
  ) {}

  // Create Enquiry
  async createEnquiry(createEnquiryDto: CreateEnquiryDto,userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(userId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})
      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const enquiry = await Enquiry?.create({
        ...createEnquiryDto,
        organizationId:get_org?.organizationId
      })
      await enquiry.save();
      return Util?.handleCreateSuccessRespone(
        'Enquiry created successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Get All Enquiries
  async findAll(page: number, size: number,userId:any) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Enquiries current page cannot be negative',
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

      const allQueries = await Enquiry.findAndCountAll({
        limit,
        offset,
        where:{organizationId:get_org?.organizationId},
        attributes: { exclude: [ 'updatedAt', 'deletedAt'] },
        order: [
          ['createdAt', 'ASC']
        ],
        include:[{
          model:Organization,
          attributes:{
            exclude:[
              'id',
              'createdAt',
              'updatedAt',
              'deletedAt',
              'isVerified'
            ]
          }
        }]
      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Enquiries Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get Enquiry by The Id
  async findOne(enquiryId: string,userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const enquiry = await Enquiry.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        order: [
          ['createdAt', 'ASC']
        ],
        include:[{
          model:Organization,
          attributes:{
            exclude:[
              'id',
              'createdAt',
              'updatedAt',
              'deletedAt',
              'isVerified'
            ]
          }
        }],
        where: { enquiryId,organizationId:get_org?.organizationId },
      });

      if (!enquiry) {
        return Util?.CustomhandleNotFoundResponse('Enquiry not found');
      }

      return Util?.handleSuccessRespone(
        enquiry,
        'Enquiry retrieve successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Enquiy
  async update(enquiryId: string, updateEnquiryDto: UpdateEnquiryDto,userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const enquiry = await Enquiry.findOne({ where: { enquiryId ,organizationId:get_org?.organizationId} });
      if (!enquiry) {
        return Util?.CustomhandleNotFoundResponse('Enquiry not found');
      }

      Object.assign(enquiry, updateEnquiryDto);
      await enquiry.save();
      return Util?.SuccessRespone('Enquiry updated successfully.');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Delete Enquiry
  async remove(enquiryId: string,userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const enquiry = await Enquiry.findOne({ where: { enquiryId, organizationId:get_org?.organizationId } });
      if (!enquiry) {
        return Util?.CustomhandleNotFoundResponse('Enquiry not found');
      }

      Object.assign(enquiry);
      await enquiry.destroy();
      return Util?.SuccessRespone('Enquiry deleted successfully.');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Filter Enquiry Data By Costom Range
  async findEnquiryByDateRange(
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    userId:any
  ) {
    try {
      let enquiryData = { startDate, endDate };

      let currentPage = Util?.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Enquiry current page cannot be negative',
        );
      }
      const { limit, offset } = Util?.getPagination(page, size);

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const allQueries = await Enquiry.findAndCountAll({
        limit,
        offset,
        where:{organizationId:get_org?.organizationId},
        attributes: { exclude: [ 'updatedAt', 'deletedAt'] },
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
        }]
      });

      const result = Util?.getPagingData(allQueries, page, limit);

      const dataResult = {
        ...enquiryData,
           result
      };

      return Util?.handleSuccessRespone(
        dataResult,
        'Enquiries data retrieve successfully',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Filter Enquiries By Purpose
  async purposefilter(
    keyword: string,
    //  page: number, 
    //  size: number,
     userId:any
     ) {
    try {
      let filter = {};

      if (keyword != null) {
        filter = { purpose: keyword };
      }

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const filterCheck = await this?.enquiryModel.count({
        where: {
          ...filter,
          organizationId:get_org?.organizationId
        },
      });
      console.log(filterCheck)
      
      return Util?.handleSuccessRespone(
        filterCheck,
        'Enquiries Purpose Data Filtered and Counted Successfully.',
      );
     
        //  return filterCheck
      // let currentPage = Util?.Checknegative(page);
      // if (currentPage) {
      //   return Util?.handleErrorRespone(
      //     'Enquiry current Page cannot be negative',
      //   );
      // }

      // const { limit, offset } = Util?.getPagination(page, size);

      // let queryOption: any = {
      //   limit,
      //   offset,
      //   attributes: { exclude: [ 'updatedAt', 'deletedAt'] },
      //   order: [
      //     ['createdAt', 'ASC']
      //   ],
      //   include:[{
      //     model: Organization,
      //     attributes:{
      //       exclude:[
      //         "id",
      //         "createdAt",
      //         "updatedAt",
      //         "deletedAt",
      //         "isVerified",
      //       ]
      //     }
      //   }]
      // };

      // if (keyword) {
      //   queryOption = {
      //     ...queryOption,
      //     where: {
      //       purpose: keyword,
      //       organizationId:get_org?.organizationId
      //     },
      //   };
      // }

      // const allQueries = await Enquiry?.findAndCountAll(queryOption);

      // let result = Util?.getPagingData(allQueries, page, limit);
      // console.log(result);

      // const dataResult = { ...result };
      // return Util?.handleSuccessRespone(
      //   dataResult,
      //   'Enquiries Purpose Data Filtered Successfully.',
      // );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Search Enquiry Data by Full Name
  async searchEnquiry(keyword: string,userId:any) {
    try {

      let user = await this?.userModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.orgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.CustomhandleNotFoundResponse('organization not found');

      const enquiryData = await this?.enquiryModel.findAll({
        attributes: {
          exclude: [ 'updatedAt', 'deletedAt'],
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
          enquirerFullName: { [Op.like]: `%${keyword}%` },
          organizationId:get_org?.organizationId
        },
      });

      return Util?.handleSuccessRespone(
        enquiryData,
        'Enquiries Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }



}
