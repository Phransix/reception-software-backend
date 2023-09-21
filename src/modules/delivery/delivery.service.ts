import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { Op } from 'sequelize';
import { deliveryConfirmDTO } from 'src/guard/auth/deliveryConfirmDTO';
import { Purpose } from '../purpose/entities/purpose.entity';
import { Unit } from '../unit/entities/unit.entity';


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
  async findAll(page: number, size: number) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Deliveries current page cannot be negative',
        );
      }
      const { limit, offset } = Util.getPagination(page, size);

      const allQueries = await Delivery.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['updatedAt', 'deletedAt'] },
        include:[
          {
            model: Unit,
            attributes:{exclude:['id','unitId','name','createdAt','updatedAt','deletedAt']},
            as: 'deliveryUnit'
          }
        ]
      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Delivery Data retrieved successfully.',
      );

      const delivery = await Delivery.findAll({paranoid:false})
      return Util?.handleSuccessRespone(delivery, "Deliveries Data retrieved Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Deliveries retrieval failed")
    }
  };

  // Get Delivery by deliveryId
  async findOne(deliveryId: string) {
    try {
      const delivery = await Delivery.findOne({
        where: { deliveryId },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      });
      // if (!delivery) {
      //   return Util?.handleFailResponse('The Delivery data does not exist')
      // }
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
        return Util?.handleFailResponse('Delivery Confirmation Failed')
      }

      if (delivery?.status != 'awaiting_pickup') 
        return Util?.handleFailResponse('Delivery confirmed already')
      

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
      return Util?.handleSuccessRespone(filterCheck,"Delivery Successfully retrieved")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

}
