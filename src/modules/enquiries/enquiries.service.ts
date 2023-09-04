import { Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { Enquiry } from './entities/enquiry.entity';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import * as Util from '../../utils/index'
import * as Abstract from '../../utils/abstract'
import { Op } from 'sequelize';

@Injectable()
export class EnquiriesService {

  constructor(
    private sequelize: Sequelize,
    @InjectModel(Enquiry) private readonly enquiryModel: typeof Enquiry
  ) { }


  // Create Enquiry
  async create(createEnquiryDto: CreateEnquiryDto) {
    try {
      console.log(createEnquiryDto)
      await Abstract?.createData(Enquiry, createEnquiryDto);
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Enquiry created successfully.")

    } catch (error) {
      console.log(error)
      // return Util
      return Util?.handleFailResponse('Enquiry registration failed')
    }
  };


// Get All Enquiries 
  async findAll() {
    try {
      const enquiries = await Enquiry.findAll({

        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        },

      })
      return Util?.handleSuccessRespone(enquiries, "Enquiries Data retrieved successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };

  // Get Enquiry by The Id
  async findOne(id: number) {
    try {
      const enquiry = await Enquiry.findOne({

        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        },
        where: { id }
      });

      if (!enquiry) {
        return Util?.handleFailResponse('Enquiry not found')
      }

      return Util?.handleSuccessRespone(enquiry, "Enquiry retrieve successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Enquiy
  async update(id: number, updateEnquiryDto: UpdateEnquiryDto) {
    try {

      const enquiry = await Enquiry.findOne({ where: { id } });
      if (!enquiry) {
        return Util?.handleFailResponse('Enquiry not found')
      }

      Object.assign(enquiry, updateEnquiryDto)
      await enquiry.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Enquiry updated successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

  };


  // Delete Enquiry
  async remove(id: number) {
    try {
      const enquiry = await Enquiry.findOne({ where: { id } });
      if (!enquiry) {
        return Util?.handleFailResponse('Enquiry not found')
      }

      Object.assign(enquiry)
      await enquiry.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Enquiry deleted successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Filter Enquiry Data By Costom Range
  async filterByCustomRange(startDate: Date, endDate: Date) {
    try {

      let enquiryData = await Enquiry.findAll({
        where: {
          createdAt:
          {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      })
      if (!enquiryData || enquiryData.length === 0) {
        return Util?.handleFailResponse('No matching Enquiry data found.');
      }

      return Util?.handleSuccessRespone(enquiryData, "Enquiries Data retrieved successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleErrorRespone('Enquiry data search failed')
    }
  }

  // Search Enquiry Data
  async searchEnquiry(keyword: string) {
    try {
      const enquiryData = await this?.enquiryModel.findAll({

        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        },

        where: {
          enquirerFullName : { [Op.like]: `%${keyword}%`, },
        }, 

      });

      if (!enquiryData || enquiryData.length === 0) {
        return Util?.handleFailResponse('No matching Enquiry data found.');
      }

      return Util?.handleSuccessRespone(enquiryData, "Enquiries Data retrieved successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('The Enquiry data does not exist')
    }
  }


  // async searchEnquiry(keyword: string) {
  //   try {
  //     const enquiryData = await this?.enquiryModel.findAll({
  //       where: {
  //         [Op.or]: [
  //           { enquirerFullName: { [Op.iLike]: `%${keyword}%` } },
  //           { email: { [Op.iLike]: `%${keyword}%` } },
  //           { phoneNumber: { [Op.iLike]: `%${keyword}%` } },
  //           { purpose: { [Op.iLike]: `%${keyword}%` } },
  //         ],
  //       },
  //     });

  //     if (!enquiryData || enquiryData.length === 0) {
  //       return Util?.handleFailResponse('No matching Enquiry data found.');
  //     }

  //     return Util?.handleSuccessRespone(enquiryData, 'Enquiries Data retrieved successfully.');
  //   } catch (error) {
  //     console.error(error);
  //     return Util?.handleFailResponse('An error occurred while searching for Enquiry data.');
  //   }
  // }



}

