import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'

@Injectable()
export class DeliveryService {
  

  constructor(
    @InjectModel(Delivery) private  deliveryModel: typeof Delivery) { }

  async create(createDeliveryDto: CreateDeliveryDto) {
    try {
      await Abstract?.createData(Delivery, createDeliveryDto);

      
      // console.log(createDeliveryDto.status)
      

      return Util?.handleCreateSuccessRespone( "Delivery Created Successfully");
    } catch (error) {
      console.error(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  async findAll() {
    // return `This action returns all delivery`;
    try {
      const delivery = await Delivery.findAll()
      return Util?.handleSuccessRespone(delivery, "Deliveries Data retrieved Successfully")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  };

  async findOne(id: number) {
    // return `This action returns a #${id} delivery`;
    try {
      const delivery = await Delivery.findOne({ where: { id } });
      if (!delivery) {
        throw new NotAcceptableException('The Delivery does not exist')
      }
      return Util?.handleSuccessRespone(delivery, "Delivery Data retrieved successfully.")
      // return Util?.handleCreateSuccessRespone("Delivery Data retrieved successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    // return `This action updates a #${id} delivery`;
    try {
      const delivery = this.deliveryModel.findOne({ where: { id } });
      if (!delivery) {
        throw new NotAcceptableException('Delivery Data not Found')
      }
      Object.assign(delivery, updateDeliveryDto);
      (await delivery).save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, 'Delivery Data successfully updated')
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };

  async remove(id: number) {
    // return `This action removes a #${id} delivery`;
    try {
      const delivery = await Delivery.findOne({ where: { id } });
      if (!delivery) {
        throw new NotAcceptableException("Delivery Data doen not exist")
      }
    
      Object.assign(delivery)
      await delivery.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"User deleted successfully.")


    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }
}
