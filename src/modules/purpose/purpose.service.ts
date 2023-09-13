import { HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Purpose } from './entities/purpose.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { Op } from 'sequelize';
import { log } from 'console';

@Injectable()
export class PurposeService {

  constructor (
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose
  ){}

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

  async findAll() {
    try {
      const purpose = await Purpose.findAll({
        attributes: {
          exclude:['createdAt','updatedAt']
        }
      })
      return Util?.handleSuccessRespone(purpose,"Purpose Data retrieved Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
        }
  }

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

  async update(purposeId: string, updatePurposeDto: UpdatePurposeDto) {
    try {
      const purpose = await Purpose.findOne({where:{purposeId}})
      if (!purpose) {
        throw new NotAcceptableException("Purpose Data does not exist")
      }
      Object.assign(purpose, updatePurposeDto)
      await purpose.save()
      return Util?.handleSuccessRespone(purpose, "Purpose Data updated Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
        }
  }

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
      return filterCheck
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
        }
  }
}

