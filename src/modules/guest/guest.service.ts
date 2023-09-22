import { BadRequestException, HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Guest } from './entities/guest.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { guestOpDTO } from 'src/guard/auth/guestOpDTO';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Purpose } from '../purpose/entities/purpose.entity';
import * as Abs from '../../utils/abstract'
import { Organization } from '../organization/entities/organization.entity';



@Injectable()
export class GuestService {

  constructor(
    @InjectModel(Guest) private readonly GuestModel: typeof Guest,
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
    @InjectModel(Organization) private readonly OrganizationModel: typeof Organization,
    private readonly sequelize: Sequelize
  ) { }

  // Creating a guest
  async create(createGuestDto: CreateGuestDto) {
    try {

      await Abstract?.createData(Guest, createGuestDto)
      const { phoneNumber } = createGuestDto
      const guestData = await this.GuestModel.findOne({ where: { phoneNumber } })
      const currentTime = new Date().toLocaleTimeString();
      await Guest.update(
        {
          signInDate: new Date()
        }, {
        where:
        {
          phoneNumber: phoneNumber
        }
      }
      );
      await Guest.update(
        {
          signInTime: currentTime
        },
        {
          where:
          {
            phoneNumber: phoneNumber
          }
        }
      );
      await Guest.update(
        {
          visitStatus: 'Signed In'
        },
        {
          where:
          {
            phoneNumber: phoneNumber
          }
        }
      );
      let guest_data = {
        guestId: guestData?.guestId,
        firstName: guestData?.firstName,
        lastname: guestData?.lastName,
        gender: guestData?.gender,
        countryCode: guestData?.countryCode,
        phoneNumber: guestData?.phoneNumber,
        signInTime: guestData?.signInTime,
        signInDate: guestData?.signInDate
      }
      return Util?.handleCustonCreateResponse(guest_data, "Guest Created Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get All Guest
  async findAll(page: number, size: number) {
    try {
      let currentPage = Util?.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Guest current page cannot be negative',
        );
      }

      const { limit, offset } = Util?.getPagination(page, size);

      const guestData = await Guest.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })

      let result = Util?.getPagingData(guestData, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Guest Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get Gest By guestId
  async findOne(guestId: string) {
    try {
      const guest = await Guest.findOne({
        where: { guestId },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
      if (!guest) {
        return Util?.handleFailResponse('The guest does not exist')
      }
      return Util?.handleSuccessRespone(guest, 'Guest data retrieved successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Guest By guestId
  async update(guestId: string, updateGuestDto: UpdateGuestDto) {
    try {
      const guest = await Guest.findOne({ where: { guestId } });
      if (!guest) {
        return Util?.handleFailResponse('Guest data not found')
      }
      Object.assign(guest, updateGuestDto)
      await guest.save()
      return Util?.handleSuccessRespone(guest, 'Guest data updated successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Remve Guest By guestId
  async remove(guestId: string) {
    try {
      const guest = await Guest.findOne({ where: { guestId } });
      if (!guest) {
        return Util?.handleFailResponse("Guest Data does not exist")
      }
      await guest.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Guest Data deleted Successfully")

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Guest sign In
  async guestSignIn(guestOpDTO: guestOpDTO) {
    try {
      const { phoneNumber, countryCode } = guestOpDTO
      const guestNo = await this.GuestModel.findOne({ where: { phoneNumber } })
      const cCode = await this.GuestModel.findOne({ where: { countryCode } })
      const currentTime = new Date().toLocaleTimeString();
      let guest_data = {
        guestId: guestNo?.guestId,
        firstName: guestNo?.firstName,
        lastname: guestNo?.lastName,
        gender: guestNo?.gender,
        countryCode: guestNo?.countryCode,
        phoneNumber: guestNo?.phoneNumber,
        signInDate: guestNo?.signInDate,
        signInTime: guestNo?.signInTime
      }

      if (!guestNo || !cCode) {
        return Util?.handleFailResponse('Invalid phone number or country code')
      } else {
        await Guest.update(
          {
            signInDate: new Date()
          }, {
          where:
          {
            phoneNumber: phoneNumber
          }
        }
        );
        await Guest.update(
          {
            signInTime: currentTime
          },
          {
            where:
            {
              phoneNumber: phoneNumber
            }
          }
        );
        await Guest.update(
          {
            visitStatus: 'Signed In'
          },
          {
            where:
            {
              phoneNumber: phoneNumber
            }
          }
        );
        return Util?.handleCustonCreateResponse(guest_data, "Guest Sign In Success")
      }
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Guest sign Out confirmation
  async guestSignOut(guestOpDTO: guestOpDTO) {
    try {
      const { phoneNumber, countryCode } = guestOpDTO
      const guest = await this.GuestModel.findOne({ where: { phoneNumber } })
      const cCode = await this.GuestModel.findOne({ where: { countryCode } })
      // const guestPurpose = await this.PurposeModel.findOne({where: { guestId }})
      const currentTime = new Date().toLocaleTimeString();
      let guest_data = {
          guestId: guest?.guestId,
          firstName: guest?.firstName,
          lastname: guest?.lastName,
          gender: guest?.gender,
          countryCode: guest?.countryCode,
          phoneNumber: guest?.phoneNumber,
          signInDate: guest?.signInDate,
          signInTime: guest?.signInTime,
          signOutTime: guest?.signOutTime
      }

      // Checking validity of phone number and country code
      if (!guest || !cCode)
        return Util?.handleFailResponse('Invalid phone number or country code')

      // Checking it guest is signed In
      if (guest?.visitStatus != 'Signed In')
        return Util?.handleFailResponse('Guest already signed out, sign in first');

      return Util?.handleCustonCreateResponse(guest_data,"Confirmed") 
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Guest sign Out
  async guestConfirmSignOut(guestOpDTO: guestOpDTO) {
    try {
      const { phoneNumber, countryCode } = guestOpDTO
      const guest = await this.GuestModel.findOne({ where: { phoneNumber } })
      const cCode = await this.GuestModel.findOne({ where: { countryCode } })
      const currentTime = new Date().toLocaleTimeString();
      let guest_data = {
        signOutTime: guest?.signOutTime
      }
      if (!guest || !cCode) {
        return Util?.handleFailResponse('Invalid phone number or country code')
      } else {
        await Guest.update(
          {
            signOutTime: currentTime
          },
          {
            where: {
              phoneNumber: phoneNumber
            }
          }
        );
        await Guest.update(
          {
            visitStatus: 'Signed Out'
          },
          {
            where: {
              phoneNumber: phoneNumber
            }
          }
        )
        return Util?.handleCustonCreateResponse(guest_data, "Guest Sign Out Success")
      }
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Search guest by firstname
  async searchGuest(keyword: string,organizationId: string) {
    try {
      const guest = await this.GuestModel.findAll({
        where: {
          firstName: {
            [Op.like]: `%${keyword}%`,
          },
          organizationId:organizationId
        },
      });
      return Util?.handleSuccessRespone(guest, "Guest Search Success")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Search by Custom Date Range
  async customGuestSearch(startDate: Date, endDate: Date) {
    try {
      const guestSearch = await Guest.findAll({
        where: {
          createdAt:
          {
            [Op.between]: [startDate, endDate],
          }
        },
        attributes: { exclude: ['createdAt', 'updated', 'deletedAt'] }
      });
      return Util?.handleSuccessRespone(guestSearch, "Guest Data retrieved Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Filter Guest by Gender
  async genderFilter(keyword: string) {
    try {
      let filter = {}

      if (keyword != null) {
        filter = { gender: keyword }
      }

      const filterCheck = await this.GuestModel.findAll({
        where: {
          ...filter
        },
      });

      return Util?.handleSuccessRespone(filterCheck, "Guest Data filtered Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Filter Guest by Organizationid
  async orgGuestFilter(keyword: string) {
    try {
      let filter = {}

      if (keyword != null) {
        filter = { organizationId: keyword }
      }

      const filterCheck = await this.GuestModel.findAll({
        where: {
          ...filter
        },
      });

      return Util?.handleSuccessRespone(filterCheck, "Guest Data filtered Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Filter Guest By visit status
  async guestVisitStatus(keyword: string) {
    try {
      let filter = {}

      if (keyword != null) {
        filter = { visitStatus: keyword }
      }

      const filterStatus = await this.GuestModel.findAll({
        where: {
          ...filter
        },
      });

      return Util?.handleSuccessRespone(filterStatus, "Guest Data filtered Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<Guest> {
    return await this.GuestModel.findOne<Guest>({ where: { phoneNumber } })
  }

  // Bulk guest create
  async bulkGuest (Guest:string, data: any[]){
    const myModel = this.sequelize.model(Guest);
    const t = await this.sequelize.transaction();
    try {
      const createMultipleGuest = await myModel.bulkCreate(data,{transaction: t})
      t.commit()
      return Util?.handleCustonCreateResponse(createMultipleGuest, 'Multiple Guests created successfully')
    
    } catch (error) {
      t.rollback()
      console.log(error)
      // throw new Error(`Error bulk creating records in ${Guest}: ${error.message}`);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Bulk guest delete
  async bulkGuestDelete (Guest:string, whereClause: any = {}){
    const myModel = this.sequelize.model(Guest);
    try {
      const deleteMultipleGuest = await myModel.destroy({
        where: whereClause
      });
      return Util?.handleCustonCreateResponse(deleteMultipleGuest, 'Multiple Guests deleted successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

}

