import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { Op } from 'sequelize';
import { deliveryConfirmDTO } from 'src/guard/auth/deliveryConfirmDTO';


@Injectable()
export class DeliveryService {


  constructor(
    @InjectModel(Delivery) private readonly DeliveryModel: typeof Delivery
  ) { }

  // Create Delivery
  async create(createDeliveryDto: CreateDeliveryDto) {
    try {
      await Abstract?.createData(Delivery, createDeliveryDto);
      return Util?.handleCreateSuccessRespone("Delivery Created Successfully");
    } catch (error) {
      console.error(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get All Delivery
  async findAll() {
    try {
      const deliveries = await Delivery.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        }
      })
      return Util?.handleSuccessRespone(deliveries, "Deliveries Data retrieved Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get Delivery by deliveryId
  async findOne(deliveryId: string) {
    try {
      const delivery = await Delivery.findOne({
        where: { deliveryId },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      });
      if (!delivery) {
        return Util?.handleFailResponse('The Delivery data does not exist')
      }
      return Util?.handleSuccessRespone(delivery, "Delivery Data retrieved successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Delivery By deliveryId
  async update(deliveryId: string, updateDeliveryDto: UpdateDeliveryDto) {
    try {
      const delivery = await Delivery.findOne({ where: { deliveryId } });
      if (!delivery) {
        return Util?.handleFailResponse("Delivery data not found")
      }
      Object.assign(delivery, updateDeliveryDto);
      await delivery.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, 'Delivery Data successfully updated')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  };


  // Remove Delivery By deliveryId 
  async remove(deliveryId: string) {
    try {
      const delivery = await Delivery.findOne({ where: { deliveryId } });
      if (!delivery) {
        return Util?.handleFailResponse("Delivery Data does not exist")
      }
      await delivery.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Delivery Data deleted Successfully")

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Confirm Delivery
  async deliveryConfirm(deliveryConfirmDTO: deliveryConfirmDTO) {
    try {
      const { receipientName } = deliveryConfirmDTO

      const delivery = await this.DeliveryModel.findOne({ where: { receipientName } })
      if (!delivery) {
        return Util?.SuccessRespone('Delivery Confirmation Failed')
      }

      await Delivery.update({ status: 'delivered' }, { where: { receipientName: receipientName } })
      return Util?.SuccessRespone('Delivery Confirmation Successful')

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Filter By Date Range
  async findByDateRange(startDate: Date, endDate: Date) {
    try {
      const deliver = await Delivery.findAll({
        where: {
          createdAt:
          {
            [Op.between]: [startDate, endDate],
          }
        },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      });

      if (!deliver || deliver.length === 0) {
        return Util?.handleFailResponse('No matching Enquiry data found.');
      }
      return Util?.handleSuccessRespone(deliver,"Delivery Successfully retrieved")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Filter delivery by type
  async deliveryType(keyword: string) {
    try {
      let filter = {}

      if (keyword != null) {
        filter = { type: keyword }
      }

      const filterCheck = await this.DeliveryModel.findAll({
        where: {
          ...filter
        },
      });
      if (!filterCheck) {
        return Util?.handleFailResponse('Type not found')
      }
      return Util?.handleSuccessRespone(filterCheck,"Delivery Successfully retrieved")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

}
