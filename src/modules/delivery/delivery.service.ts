import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'

@Injectable()
export class DeliveryService {

  constructor (
    @InjectModel(Delivery) private readonly DeliveryModel: typeof Delivery)
    {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    try {
      await Abstract?.createData(Delivery,createDeliveryDto);
      return Util?.handleCreateSuccessRespone(Util?.SuccessRespone,"Delivery Created Successfully");
    } catch (error) {
      console.error(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  findAll() {
    return `This action returns all delivery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    return `This action updates a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
