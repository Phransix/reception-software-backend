import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { DATE } from 'sequelize';

@Injectable()
export class DeliveryService {
  

  constructor(
<<<<<<< HEAD
    @InjectModel(Delivery) private  deliveryModel: typeof Delivery) { }
=======
    @InjectModel(Delivery) private readonly DeliveryModel: typeof Delivery,
    ){}
>>>>>>> francis

  async create(createDeliveryDto: CreateDeliveryDto) {
    try {
      await Abstract?.createData(Delivery, createDeliveryDto);

      
      // console.log(createDeliveryDto.status)
      

      return Util?.handleCreateSuccessRespone( "Delivery Created Successfully");
    } catch (error) {
      console.error(error)
      return Util?.handleFailResponse("Delivery registration failed")
    }
  }

  async findAll(){
    try {
<<<<<<< HEAD
      const delivery = await Delivery.findAll()
=======
      const delivery = await Delivery.findAll({paranoid:false})
>>>>>>> francis
      return Util?.handleSuccessRespone(delivery, "Deliveries Data retrieved Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Deliveries retrieval failed")
    }
  };

  async findOne(id: number) {
    try {
      const delivery = await Delivery.findOne({ where: { id } });
      if (!delivery) {
        throw new NotAcceptableException('The Delivery does not exist')
      }
<<<<<<< HEAD
      return Util?.handleSuccessRespone(delivery, "Delivery Data retrieved successfully.")
      // return Util?.handleCreateSuccessRespone("Delivery Data retrieved successfully")
=======
      return Util?.handleSuccessRespone(delivery, "Delivery Data retrieved successfully")
>>>>>>> francis
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Delivery retrieval failed")
    }
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    // return `This action updates a #${id} delivery`;
    try {
<<<<<<< HEAD
      const delivery = this.deliveryModel.findOne({ where: { id } });
=======
      const delivery = await Delivery.findOne({ where: { id } });
>>>>>>> francis
      if (!delivery) {
        throw new NotAcceptableException('Delivery Data not Found')
      }
      Object.assign(delivery, updateDeliveryDto);
<<<<<<< HEAD
      (await delivery).save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, 'Delivery Data successfully updated')
=======
      await delivery.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, 'Delivery Data successfullt updated')
>>>>>>> francis
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Delivery update failed")
    }
  };

  async remove(id: number) {
    // return `This action removes a #${id} delivery`;
    try {
<<<<<<< HEAD
      const delivery = await Delivery.findOne({ where: { id } });
      if (!delivery) {
        throw new NotAcceptableException("Delivery Data doen not exist")
      }
    
      Object.assign(delivery)
      await delivery.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"User deleted successfully.")

=======
      const delivery = await Delivery.findByPk(id);
      if (!delivery) {
        throw new NotAcceptableException("Delivery Data doen not exist")
      }
      // Object.assign(delivery)
      // delivery.deletedAt = new Date()
      await delivery.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Delivery Data deleted Successfully")
>>>>>>> francis

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Delivery removal failed")
    }
  }

}
