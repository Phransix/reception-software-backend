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

  async create(createPurposeDto: CreatePurposeDto) {
    try {
      await Abstract?.createData(Purpose, createPurposeDto)
      return Util?.handleCreateSuccessRespone("Purpose Created Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Purpose Registration Failed")
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
      return Util?.handleFailResponse('Purpose Data retrieval failed')
    }
  }

  async findOne(id: number) {
    try {
      const purpose = await Purpose.findOne({where: { id },
        attributes: {exclude:['createdAt','updatedAt']}
      });
      if (!purpose) {
        throw new NotAcceptableException('The Purpose data not exist')
      }
      return Util?.handleSuccessRespone(purpose,'Purpose Data retrieved Successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Purpose Data retrieval failed')
    }
  }

  async update(id: number, updatePurposeDto: UpdatePurposeDto) {
    try {
      const purpose = await Purpose.findOne({where:{id}})
      if (!purpose) {
        throw new NotAcceptableException("Purpose Data does not exist")
      }
      Object.assign(purpose, updatePurposeDto)
      await purpose.save()
      return Util?.handleSuccessRespone(purpose, "Purpose Data updated Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Purpose update  failed")
    }
  }

  async remove(id: number) {
     try {
      const purpose = await Purpose.findByPk(id)
      if (!purpose) {
        throw new NotAcceptableException("Purpose Data does not exist")
      }
      await purpose.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Purpose Data deleted successfully")
     } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Purpose Data removal failed")
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
      return Util?.handleFailResponse('Purpose filtering failed')
    }
  }
}

