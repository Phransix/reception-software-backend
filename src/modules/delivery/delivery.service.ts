import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { PaginateOptions, PaginateService } from 'nestjs-sequelize-paginate';

@Injectable()
export class DeliveryService {

  constructor(
    @InjectModel(Delivery) private readonly DeliveryModel: typeof Delivery,
    private readonly paginateService: PaginateService
    ){}

  async create(createDeliveryDto: CreateDeliveryDto) {
    try {
      await Abstract?.createData(Delivery, createDeliveryDto);
      return Util?.handleCreateSuccessRespone( "Delivery Created Successfully");
    } catch (error) {
      console.error(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  // async findAll(options: PaginateOptions) 
  async findAll(){
    // return `This action returns all delivery`;
    try {
      const delivery = this.DeliveryModel.findAll()
      return Util?.handleSuccessRespone(delivery, "Deliveries Data retrieved Successfully")
      // // const paginate = this.paginateService.findAllPaginate({
      // //   ...options,
      // //   model: Delivery,
      // //   path: '/delivery',
      // // })
      // return paginate
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  };

  async findOne(id: number) {
    // return `This action returns a #${id} delivery`;
    try {
      const delivery = this.DeliveryModel.findOne({ where: { id } });
      if (!delivery) {
        throw new NotAcceptableException('The Delivery does not exist')
      }
      return Util?.handleSuccessRespone(delivery, "Delivery Data retrieved successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    // return `This action updates a #${id} delivery`;
    try {
      const delivery = this.DeliveryModel.findOne({ where: { id } });
      if (!delivery) {
        throw new NotAcceptableException('Delivery Data not Found')
      }
      Object.assign(delivery, updateDeliveryDto);
      (await delivery).save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, 'Delivery Data successfullt updated')
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };

  async remove(id: number) {
    // return `This action removes a #${id} delivery`;
    try {
      const delivery = this.DeliveryModel.findOne({ where: { id } });
      if (!delivery) {
        throw new NotAcceptableException("Delivery Data doen not exist")
      }
      Object.assign(delivery)
        (await delivery).destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Delivery Data deleted Successfully")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

}
