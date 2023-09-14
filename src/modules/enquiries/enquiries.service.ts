import { Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { Enquiry } from './entities/enquiry.entity';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import * as Util from '../../utils/index';
import * as Abstract from '../../utils/abstract';
import { Op } from 'sequelize';

@Injectable()
export class EnquiriesService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Enquiry) private readonly enquiryModel: typeof Enquiry,
  ) {}

  // Create Enquiry
  async create(createEnquiryDto: CreateEnquiryDto) {
    try {
      console.log(createEnquiryDto);
      await Abstract?.createData(Enquiry, createEnquiryDto);
      return Util?.handleCreateSuccessRespone('Enquiry created successfully.');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get All Enquiries
  async findAll(page: number, size: number) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Enquiries current page cannot be negative',
        );
      }
      const { limit, offset } = Util.getPagination(page, size);

      const allQueries = await Enquiry.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
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
  async findOne(enquiryId: string) {
    try {
      const enquiry = await Enquiry.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        where: { enquiryId },
      });

      if (!enquiry) {
        return Util?.handleFailResponse('Enquiry not found');
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
  async update(enquiryId: string, updateEnquiryDto: UpdateEnquiryDto) {
    try {
      const enquiry = await Enquiry.findOne({ where: { enquiryId } });
      if (!enquiry) {
        return Util?.handleFailResponse('Enquiry not found');
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
  async remove(enquiryId: string) {
    try {
      const enquiry = await Enquiry.findOne({ where: { enquiryId } });
      if (!enquiry) {
        return Util?.handleFailResponse('Enquiry not found');
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

      const allQueries = await Enquiry.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      });

      const result = Util?.getPagingData(allQueries, page, limit);

      const dataResult = {
        ...enquiryData,
        where: {
          pagination: result,
        },
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
  // async purposefilter(keyword: string) {
  //   try {
  //     let filter = {};

  //     if (keyword != null) {
  //       filter = { purpose: keyword };
  //     }
  //     const filterCheck = await this?.enquiryModel.findAll({
  //       where: {
  //         ...filter,
  //       },
  //     });
  //     if (!filterCheck) {
  //       return Util?.handleFailResponse(
  //         'No matching Enquiry Purpose data found.',
  //       );
  //     }

  //     return Util?.handleSuccessRespone(
  //       filterCheck,
  //       'Enquiries Purpose Data Filtered Successfully.',
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
  //   }
  // }

  async purposefilter(keyword: string, page: number, size: number) {
    try {
      let filter = {};

      if (keyword != null) {
        filter = { purpose: keyword };
      }
      const filterCheck = await this?.enquiryModel.findAll({
        where: {
          ...filter,
        },
      });
      if (!filterCheck) {
        return Util?.handleFailResponse(
          'No matching Enquiry Purpose data found.',
        );
      }

      let currentPage = Util?.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Enquiry current Page cannot be negative',
        );
      }

      const { limit, offset } = Util?.getPagination(page, size);

      let queryOption: any = {
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      };

      if (keyword) {
        queryOption = {
          ...queryOption,
          where: {
            purpose: keyword,
          },
        };
      }

      const allQueries = await Enquiry?.findAndCountAll(queryOption);

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Enquiries Purpose Data Filtered Successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Search Enquiry Data by Full Name
  async searchEnquiry(keyword: string) {
    try {
      const enquiryData = await this?.enquiryModel.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },

        where: {
          enquirerFullName: { [Op.like]: `%${keyword}%` },
        },
      });

      if (!enquiryData || enquiryData.length === 0) {
        return Util?.handleFailResponse('No matching Enquiry data found.');
      }

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
