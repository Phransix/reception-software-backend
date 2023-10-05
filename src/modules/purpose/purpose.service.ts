import { HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Purpose } from './entities/purpose.entity';
import * as Util from '../../utils/index'
import { Guest } from '../guest/entities/guest.entity';
import { Department } from '../department/entities/department.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Op } from 'sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { guestOpDTO } from 'src/guard/auth/guestOpDTO';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PurposeService {

  constructor(
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Guest) private readonly GuestModel: typeof Guest,
    private readonly sequelize: Sequelize
  ) { }

  // Create Purpose
  async createPurpose(createPurposeDto: CreatePurposeDto, userId: any) {
    try {

      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(userId)
      if (!user)
        return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })
      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const purpose = await Purpose?.create({
        ...createPurposeDto,
        organizationId: get_org?.organizationId
      })
      await purpose.save()
      return Util?.handleCreateSuccessRespone("Purpose Created Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Get All Purposes
  async findAll(page: number, size: number, userId: string) {
    try {

      console.log(userId)

      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Purpose current page cannot be negative',
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

      const allQueries = await Purpose.findAndCountAll({
        limit,
        offset,
        where: {
          organizationId: get_org?.organizationId
        },
        attributes: { exclude: ['updatedAt', 'deletedAt'] },
        include: [
          {
            model: Guest,
            attributes: {
              exclude: [
                'id',
                'guestId',
                'organizationId',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'guestData'
          },
          {
            model: Department,
            attributes: {
              exclude: [
                'id',
                'organizationId',
                'departmentId',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'departmentData'
          },
          {
            model: Staff,
            attributes: {
              exclude: [
                'id',
                'departmentId',
                'organizationId',
                'staffId',
                'organizationName',
                'departmentName',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'staffData'
          }
        ]
      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Purpose Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get Purpose By purposeId
  async findOne(purposeId: string, userId: string) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const purpose = await Purpose.findOne({
        where:
        {
          purposeId,
          organizationId: get_org?.organizationId
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: Guest,
            attributes: {
              exclude: [
                'id',
                'guestId',
                'organizationId',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'guestData'
          },
          {
            model: Staff,
            attributes: {
              exclude: [
                'id',
                'departmentId',
                'organizationId',
                'staffId',
                'organizationName',
                'departmentName',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'staffData'
          }
        ]
      });
      if (!purpose) {
        throw new NotAcceptableException('The Purpose data not exist')
      }
      return Util?.handleSuccessRespone(purpose, 'Purpose Data retrieved Successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
    }
  }

  // Update Purpose By purposeId
  async update(purposeId: string, updatePurposeDto: UpdatePurposeDto, userId: string) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const purpose = await Purpose.findOne({ where: { purposeId, organizationId: get_org?.organizationId } })
      if (!purpose) {
        throw new NotAcceptableException("Purpose Data does not exist")
      }
      Object.assign(purpose, updatePurposeDto)
      await purpose.save()
      return Util?.SuccessRespone("Purpose Data updated Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
    }
  }

  // Remove Purpose By purposeId
  async remove(purposeId: string, userId: string) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const purpose = await Purpose.findOne({ where: { purposeId, organizationId: get_org?.organizationId } })
      if (!purpose) {
        throw new NotAcceptableException("Purpose Data does not exist")
      }
      await purpose.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Purpose Data deleted successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
    }
  }

  // Filter by Official and Personal Visits
  async guestPurpose(keyword: string, userId: string) {
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
        filter = { purpose: keyword }
      }

      const filterCheck = await this.PurposeModel.findAll({
        where: {
          ...filter,
          organizationId: get_org?.organizationId
        },
      });
      if (!filterCheck) {
        throw new HttpException('Purpose not found', HttpStatus.NOT_FOUND)
      }
      return Util?.handleSuccessRespone(filterCheck, "Purpose Data updated Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcReqError(Util?.getTryCatchMsg(error))
    }
  }

  // Filter By Date Range
  async findByDateRange(startDate: Date, endDate: Date, userId: string) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const purpose = await Purpose.findAll({
        where: {
          createdAt:
          {
            [Op.between]: [startDate, endDate],
          },
          organizationId: get_org?.organizationId
        },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [
          {
            model: Guest,
            attributes: {
              exclude: [
                'id',
                'guestId',
                'organizationId',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'guestData'
          },
          {
            model: Department,
            attributes: {
              exclude: [
                'id',
                'organizationId',
                'departmentId',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'departmentData'
          },
          {
            model: Staff,
            attributes: {
              exclude: [
                'id',
                'departmentId',
                'organizationId',
                'staffId',
                'organizationName',
                'departmentName',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'staffData'
          }
        ]
      });

      return Util?.handleSuccessRespone(purpose, "Delivery Successfully retrieved")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Search guest by firstname or lastname
  async searchGuest(keyword: string, userId: string) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const guest = await this.PurposeModel.findAll({

        include: [
          {
            model: Guest,
            attributes: {
              exclude: [
                'id',
                'guestId',
                'organizationId',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'guestData',
            where: {
              [Op.or]: [
                {
                  firstName: {
                    [Op.like]: `%${keyword}%`,
                  },
                },
                {
                  lastName: {
                    [Op.like]: `%${keyword}%`,
                  },
                }
              ],
              organizationId: get_org?.organizationId
            },
          },
          {
            model: Department,
            attributes: {
              exclude: [
                'id',
                'organizationId',
                'departmentId',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'departmentData'
          },
          {
            model: Staff,
            attributes: {
              exclude: [
                'id',
                'departmentId',
                'organizationId',
                'staffId',
                'organizationName',
                'departmentName',
                'createdAt',
                'updatedAt',
                'deletedAt'
              ]
            },
            order: [['id', 'DESC']],
            as: 'staffData'
          }
        ]
      });
      return Util?.handleSuccessRespone(guest, "Guest Search Success")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Guest sign Out
  async guestSignOut(guestOpDTO: guestOpDTO, userId: any) {
    try {

      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(userId)
      if (!user)
        return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })
      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const { phoneNumber, countryCode } = guestOpDTO
      const guest = await this.GuestModel.findOne({
        where: {
          phoneNumber: phoneNumber,
          organizationId: get_org?.organizationId
        }
      });
      const cCode = await this.GuestModel.findOne({
        where: {
          countryCode,
          organizationId: get_org?.organizationId
        }
      })

      // const currentTime = new Date().toLocaleTimeString();

      if (!guest)
        return Util?.handleFailResponse('Guest not found')

      if (!guest || !cCode)
        return Util?.handleFailResponse('Invalid phone number or country code')

      console.log(phoneNumber);
      return Util?.handleCreateSuccessRespone('Logout successful');
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Confirm Guest Signout
  async guestConfirmSignOut(guestOpDTO: guestOpDTO, userId: any) {
    try {

      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(userId)
      if (!user)
        return Util?.CustomhandleNotFoundResponse('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })
      if (!get_org)
        return Util?.CustomhandleNotFoundResponse('organization not found');

      const { phoneNumber, countryCode } = guestOpDTO
      const guest = await this.GuestModel.findOne({
        where: {
          phoneNumber: phoneNumber,
          organizationId: get_org?.organizationId
        }
      });
      const cCode = await this.GuestModel.findOne({
        where: {
          countryCode,
          organizationId: get_org?.organizationId
        }
      }
      )

      const currentTime = new Date().toLocaleTimeString();

      if (!guest)
        return Util?.handleFailResponse('Guest not found')

      if (!guest || !cCode)
        return Util?.handleFailResponse('Invalid phone number or country code')

      const purpose = await this.PurposeModel.findOne(
        {
          where: {
            guestId: guest?.guestId
          }
        });

      // Checking if guest is signed In
      if (purpose?.isLogOut != false) {
        return Util?.handleFailResponse('Guest already logged Out')
      };

      await Purpose.update({ isLogOut: true },
        { where: { guestId: guest?.guestId } }
      )
      await Purpose.update({ visitStatus: 'Signed Out' },
        { where: { guestId: guest?.guestId } }
      )
      await Purpose.update({ signOutTime: currentTime },
        { where: { guestId: guest?.guestId } }
      )

      console.log(phoneNumber);

      let guest_data = {
        guestId: guest?.guestId,
        firstName: guest?.firstName,
        lastname: guest?.lastName,
        gender: guest?.gender,
        countryCode: guest?.countryCode,
        phoneNumber: guest?.phoneNumber,
        guestPurpose: purpose?.purpose,
        signInDate: purpose?.signInDate,
        signInTime: purpose?.signInTime,
        signOutTime: purpose?.signOutTime
      }
      return Util?.handleCustonCreateResponse(guest_data, 'Logout Confirmation Successful');
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Filter Guest by Status
  async statusFilter(keyword: string, userId: string) {
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
        filter = { visitStatus: keyword }
      }

      const getSingedInCount = await this.PurposeModel.count({
        where: {
          visitStatus: 'Signed In',
          organizationId: get_org?.organizationId
        },
      });

      const getSingedOutCount = await this.PurposeModel.count({
        where: {
          visitStatus: 'Signed Out',
          organizationId: get_org?.organizationId
        },
      });

      const total = Number(getSingedInCount) + Number(getSingedOutCount)

      filter = {
        signed_in: Number(getSingedInCount),
        signed_out: Number(getSingedOutCount),
        total : total
      }

      return Util?.handleSuccessRespone(filter, "Guest Data filtered Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Filter Guest by Gender
  async genderFilter(keyword: string, userId: string) {
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
        filter = { gender: keyword }
      }

      const filterCheck = await this.PurposeModel.findAll({
        where: {
          ...filter,
          organizationId: get_org?.organizationId
        },
      });

      return Util?.handleSuccessRespone(filterCheck, "Guest Data filtered Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Bulk Purpose
  async bulkPurpose(Guest: string, data: any[], userId: any) {
    const myModel = this.sequelize.model(Purpose);
    const t = await this.sequelize.transaction();
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
      {
        t.rollback();
        return Util?.handleErrorRespone('User not found');
      }

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
      {
        t.rollback();
        return Util?.handleErrorRespone('organization not found');
      }

      const createMultiplePurpose = await myModel.bulkCreate(data, { transaction: t })
      t.commit()
      return Util?.handleCustonCreateResponse(createMultiplePurpose, 'Multiple Purposes created successfully')

    } catch (error) {
      t.rollback()
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

}

