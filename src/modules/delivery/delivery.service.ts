import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto, Status } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import * as Util from '../../utils/index'
import { Op } from 'sequelize';
import { deliveryConfirmDTO } from 'src/guard/auth/deliveryConfirmDTO';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { UpdateDeliveryStatus } from './dto/updateDeliveryStatus';


@Injectable()
export class DeliveryService {


  constructor(
    @InjectModel(Delivery) private readonly DeliveryModel: typeof Delivery,
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization
  ) { }

  // Create Delivery
  async create(createDeliveryDto: CreateDeliveryDto, userId: any) {
    try {
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(userId)
      if (!user)
        return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })
      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const delivery = await this.DeliveryModel.create({
        ...createDeliveryDto,
        organizationId: get_org?.organizationId
      })
      await delivery.save();
      return Util?.handleCreateSuccessRespone("Delivery Created Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Get All Delivery
  async findAll(page: number, size: number, userId: any) {
    try {
      console.log(userId)
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Deliveries current page cannot be negative',
        );
      }
      const { limit, offset } = Util.getPagination(page, size);
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');


      const allQueries = await Delivery.findAndCountAll({
        limit,
        offset,
        where: {
          organizationId: get_org?.organizationId
        },
        attributes: { exclude: ['updatedAt', 'deletedAt'] },
      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Delivery Data retrieved successfully.',
      );

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  };

  // Get Delivery by deliveryId
  async findOne(deliveryId: string, userId: any) {
    try {
      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');
      const delivery = await Delivery.findOne({
        where: { deliveryId, organizationId: get_org?.organizationId },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      });
      return Util?.handleSuccessRespone(delivery, "Delivery Data retrieved successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Delivery By deliveryId
  async update(deliveryId: string, updateDeliveryDto: UpdateDeliveryDto, userId: any) {
    try {
      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');
      const delivery = await Delivery.findOne({ where: { deliveryId, organizationId: get_org?.organizationId } });

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
  async remove(deliveryId: string, userId: any) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const delivery = await Delivery.findOne({ where: { deliveryId, organizationId: get_org?.organizationId } });
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
  async confirmDelivery(deliveryId: string, userId: string, updateDeliveryStatus: UpdateDeliveryStatus) {
    try {
      let user_data = await this?.UserModel.findOne({ where: { userId } })
      console.log(user_data?.organizationId)
      if (!user_data)
        return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user_data?.organizationId } })

      if (!get_org)

        return Util?.CustomhandleNotFoundResponse('organization not found');

      const { receipientName } = updateDeliveryStatus

      const confirmDelivery = await this.DeliveryModel.findOne({
        where: {
          deliveryId,
          organizationId: get_org?.organizationId
        }
      })

      const receipient = await this.DeliveryModel.findOne({
        where: {
          receipientName
        }
      }
      )

      if (!receipient || !confirmDelivery) {
        return Util?.handleFailResponse('Receipient Does not exist')
      }

      let confirmStas = {
        name: updateDeliveryStatus?.receipientName
      }

      if (confirmDelivery?.status != 'awaiting_pickup')
        return Util?.handleFailResponse('Delivery confirmed already')

      await Delivery.update({ status: 'delivered' }, {
        where: {
          deliveryId: confirmDelivery?.deliveryId
        }
      })
      return Util?.SuccessRespone('Delivery Confirmation Success')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }




  // Filter By Date Range
  async findByDateRange(startDate: Date, endDate: Date, userId: any) {
    try {
      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const deliver = await Delivery.findAll({
        where: {
          createdAt:
          {
            [Op.between]: [startDate, endDate],
          },
          organizationId: get_org?.organizationId
        },
        attributes: { exclude: ['updatedAt', 'deletedAt'] }
      });

      return Util?.handleSuccessRespone(deliver, "Delivery Successfully retrieved")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Filter delivery by type
  async deliveryType(keyword: string, userId: any) {
    try {
      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');
      let filter = {}

      if (keyword != null) {
        filter = { type: keyword }
      }

      const filterCheck = await this.DeliveryModel.findAll({
        where: {
          ...filter,
          organizationId: get_org?.organizationId
        },
      });
      return Util?.handleSuccessRespone(filterCheck, "Delivery Successfully retrieved")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Filter delivery by status
  async deliveryStatus(keyword: string, userId: any) {
    try {
      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');
      let filter = {}

      if (keyword != null) {
        filter = { status: keyword }
      }

      const getPickUpCount = await this.DeliveryModel.count({
        where: {
          status : 'awaiting_pickup',
          organizationId: get_org?.organizationId
        },
      });

      const getDeliveredCount = await this.DeliveryModel.count({
        where: {
          status : 'delivered',
          organizationId: get_org?.organizationId
        },
      });

      const total = Number(getPickUpCount) + Number(getDeliveredCount);

      filter = {
        awaiting_pickup : Number(getPickUpCount),
        delivered : Number(getDeliveredCount),
        total : total
      }

      return Util?.handleSuccessRespone(filter, "Delivery Status Successfully retrieved")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

}
