import { BadRequestException, HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { DATE } from 'sequelize';
import { deliveryConfirmDTO } from 'src/guard/auth/deliveryConfirmDTO';

@Injectable()
export class DeliveryService {
  

  constructor(
    @InjectModel(Delivery) private readonly DeliveryModel: typeof Delivery,
    ){}

  async create(createDeliveryDto: CreateDeliveryDto) {
    try {
      await Abstract?.createData(Delivery, createDeliveryDto);
      return Util?.handleCreateSuccessRespone( "Delivery Created Successfully");
    } catch (error) {
      console.error(error)
      return Util?.handleFailResponse("Delivery registration failed")
    }
  }

  async findAll(){
    try {
      const delivery = await Delivery.findAll({
        attributes: {
          exclude:['createdAt','updatedAt']
        }
      })
      return Util?.handleSuccessRespone(delivery, "Deliveries Data retrieved Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Deliveries retrieval failed")
    }
  }

  async findOne(id: number) {
    try {
      const delivery = await Delivery.findOne({ 
        where: { id }, 
        attributes: {exclude:['createdAt','updatedAt']}
       });
      if (!delivery) {
        throw new NotAcceptableException('The Delivery does not exist')
      }
      return Util?.handleSuccessRespone(delivery, "Delivery Data retrieved successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Delivery retrieval failed")
    }
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    try {
      const delivery = await Delivery.findOne({ where: { id } });
      if (!delivery) {
        throw new NotAcceptableException('Delivery Data not Found')
      }
      Object.assign(delivery, updateDeliveryDto);
      await delivery.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, 'Delivery Data successfully updated')
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Delivery update failed")
    }
  };

  async remove(id: number) {
    // return `This action removes a #${id} delivery`;
    try {
      const delivery = await Delivery.findByPk(id);
      if (!delivery) {
        throw new NotAcceptableException("Delivery Data does not exist")
      }
      await delivery.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Delivery Data deleted Successfully")

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Delivery removal failed")
    }
  }

  async deliveryConfirm (deliveryConfirmDTO: deliveryConfirmDTO){

    const {staff} = deliveryConfirmDTO
    
    const delivery = await this.DeliveryModel.findOne({where:{staff}})
    if(!delivery) {
      throw new HttpException('Delivery Confirmation Failed',HttpStatus.NOT_FOUND)
    }
    
    else {
      await Delivery.update({status: 'delivered'},{where: {staff: staff}})
      throw new HttpException('Delivery Confirmation Successful',HttpStatus.OK)
    }
  }


}
