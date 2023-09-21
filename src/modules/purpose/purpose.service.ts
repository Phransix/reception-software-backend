import { HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Purpose } from './entities/purpose.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { Guest } from '../guest/entities/guest.entity';
import { Department } from '../department/entities/department.entity';
import { Staff } from '../staff/entities/staff.entity';

@Injectable()
export class PurposeService {

  constructor (
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose
  ){ }

  // Create Purpose
  async create(createPurposeDto: CreatePurposeDto) {
    try {
      await Abstract?.createData(Purpose, createPurposeDto)
      return Util?.handleCreateSuccessRespone("Purpose Created Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
    }
  }

  // Get All Purposes
  async findAll(page: number, size: number) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Purpose current page cannot be negative',
        );
      }
      const { limit, offset } = Util.getPagination(page, size);

      const allQueries = await Purpose.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [
          {
            model:Guest,
            attributes: {exclude:['id','guestId','organizationId','createdAt','updatedAt','deletedAt']},
            order: [['id','DESC']],
            as:'guestData'
          },
          {
            model:Department,
            attributes: {exclude: ['id','organizationId','departmentId','createdAt', 'updatedAt', 'deletedAt']},
            order: [['id', 'DESC']],
            as: 'departmentData'
          },
          {
            model:Staff,
            attributes: {exclude: ['id','departmentId','organizationId','staffId','organizationName','departmentName','createdAt', 'updatedAt', 'deletedAt']},
            order: [['id', 'DESC']],
            as: 'staffData'
          }
        ]
      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Purpose Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get Purpose By purposeId
  async findOne(purposeId: string) {
    try {
      const purpose = await Purpose.findOne({where: { purposeId },
        attributes: {exclude:['createdAt','updatedAt']}
      });
      if (!purpose) {
        throw new NotAcceptableException('The Purpose data not exist')
      }
      return Util?.handleSuccessRespone(purpose,'Purpose Data retrieved Successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error)) 
    }
  }

  // Update Purpose By purposeId
  async update(purposeId: string, updatePurposeDto: UpdatePurposeDto) {
    try {
      const purpose = await Purpose.findOne({where:{purposeId}})
      if (!purpose) {
        throw new NotAcceptableException("Purpose Data does not exist")
      }
      Object.assign(purpose, updatePurposeDto)
      await purpose.save()
      return Util?.SuccessRespone("Purpose Data updated Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
        }
  }

  // Remove Purpose By purposeId
  async remove(purposeId: string) {
     try {
      const purpose = await Purpose.findOne({ where: { purposeId } })
      if (!purpose) {
        throw new NotAcceptableException("Purpose Data does not exist")
      }
      await purpose.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Purpose Data deleted successfully")
     } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
         }
  }

  // Filter by Official and Personal Visits
  async guestPurpose (keyword: string){
    try {
    let filter = {}

    if(keyword != null){
     filter = {purpose : keyword}
    }
    // console.log(filter);
    
    
      const filterCheck = await this.PurposeModel.findAll({
        where: {
         ...filter
        },
      });
      if (!filterCheck) {
        throw new HttpException('Purpose not found', HttpStatus.NOT_FOUND)
      }
      return Util?.handleSuccessRespone(filterCheck, "Purpose Data updated Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
        }
  }
}

