import { Injectable, } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Guest } from './entities/guest.entity';
import * as Util from '../../utils/index'
import { guestOpDTO } from 'src/guard/auth/guestOpDTO';
import { Sequelize } from 'sequelize-typescript';
import { Purpose } from '../purpose/entities/purpose.entity';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Op } from 'sequelize';

@Injectable()
export class GuestService {

  constructor(
    @InjectModel(Guest) private readonly GuestModel: typeof Guest,
    @InjectModel(Purpose) private readonly PurposeModel: typeof Purpose,
    @InjectModel(Organization) private readonly OrgModel: typeof Organization,
    @InjectModel(User) private readonly UserModel: typeof User,
    private readonly sequelize: Sequelize
  ) { }

  // Creating a guest
  async create(createGuestDto: CreateGuestDto, userId: any) {
    try {
      console.log(userId)
      const user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      const get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');
      
      // Checking if there's a guest with an existing phone number in the database
        const existingGuest = await this.GuestModel.findOne({
          where: { 
            countryCode: createGuestDto.countryCode,
            phoneNumber: createGuestDto.phoneNumber, 
            organizationId: get_org?.organizationId },
        });
    
        if (existingGuest) {
          return Util.handleErrorRespone('Phone number already exists within this organization');
        }
      
      const guest = await this.GuestModel?.create({
        ...createGuestDto,
        organizationId: get_org?.organizationId
      })
      await guest.save();
      let guest_data = {
        guestId: guest?.guestId,
        firstName: guest?.firstName,
        lastname: guest?.lastName,
        gender: guest?.gender,
        countryCode: guest?.countryCode,
        phoneNumber: guest?.phoneNumber,
      }
      return Util?.handleCustonCreateResponse(guest_data, "Guest Created Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Get All Guest
  async findAll(page: number, size: number, userId: any) {
    try {
      console.log(userId)

      let currentPage = Util?.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Guest current page cannot be negative',
        );
      }

      const { limit, offset } = Util?.getPagination(page, size);

      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');
      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const guestData = await Guest.findAndCountAll({
        limit,
        offset,
        where: {
          organizationId: get_org?.organizationId
        },
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

    // Get All Guest for Tablet
    async findAllGuest(userId: any) {
      try {
        console.log(userId)
        let user = await this?.UserModel.findOne({ where: { userId } })
        console.log(user?.organizationId)
        if (!user)
          return Util?.handleErrorRespone('User not found');
        let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })
  
        if (!get_org)
          return Util?.handleErrorRespone('organization not found');
  
        const guestData = await Guest.findAndCountAll({
          where: {
            organizationId: get_org?.organizationId
          },
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        })

        return Util?.handleSuccessRespone(
          guestData,
          'Guest Data retrieved successfully.',
        );
      } catch (error) {
        console.log(error)
        return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
      }
    }

  // Get Gest By guestId
  async findOne(guestId: string, userId: any) {
    try {

      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(userId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const guest = await Guest.findOne({
        where: { guestId, organizationId: get_org?.organizationId },
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
  async update(guestId: string, updateGuestDto: UpdateGuestDto, userId: any) {
    try {
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(userId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const guest = await Guest.findOne({ where: { guestId, organizationId: get_org?.organizationId } });
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

  // Remove Guest By guestId
  async remove(guestId: string, userId: any) {
    try {
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(userId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const guest = await Guest.findOne({ where: { guestId, organizationId: get_org?.organizationId } });
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
  async guestSignIn(guestOpDTO: guestOpDTO, userId: any) {

    try {

      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(userId)
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const { phoneNumber, countryCode } = guestOpDTO
      const guest = await this.GuestModel.findOne({
        where: {
          countryCode: countryCode,
          phoneNumber: phoneNumber,
          organizationId: get_org?.organizationId
        }
      })

      let guest_data = {
        guestId: guest?.guestId,
        firstName: guest?.firstName,
        lastname: guest?.lastName,
        gender: guest?.gender,
        countryCode: guest?.countryCode,
        phoneNumber: guest?.phoneNumber
      }

      if (!guest) {
        return Util?.handleFailResponse('Invalid phone number or country code')
      }

      return Util?.handleCustonCreateResponse(guest_data, "Guest Sign In Success")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

      // Filter Guest by Gender
      async genderFilter(keyword: string, userId: any) {
        try {
    
          let user = await this?.UserModel.findOne({ where: { userId } })
          console.log(userId)
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
    
          const filterCheck = await this.GuestModel.findAll({
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

  // Search by Custom Date Range
  async customGuestSearch(startDate: Date, endDate: Date, userId: any) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

      const guestSearch = await Guest.findAll({
        where: {
          organizationId: get_org?.organizationId,
          createdAt:{
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: { exclude: ['createdAt', 'updated', 'deletedAt'] },
        order:[['createdAt','ASC']],
      });
      return Util?.handleSuccessRespone(guestSearch, "Guest Data retrieved Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Bulk guest create
  async bulkGuest(Guest: string, data: any[], userId: any) {
    const myModel = this.sequelize.model(Guest);
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

    // Check for duplicates within the same organization
    const duplicatePhoneNumbers = new Set();
    for (const guestData of data) {
      const phoneNumberWithCountryCode = `${guestData.countryCode}${guestData.phoneNumber}`
      const existingGuest = await myModel.findOne({
        where: { 
          phoneNumber: phoneNumberWithCountryCode, 
          organizationId: user.organizationId 
        },
      });
      if (existingGuest) {
        duplicatePhoneNumbers.add(phoneNumberWithCountryCode); // Add to the Set
      }
    }

    if (duplicatePhoneNumbers.size > 0) {
      t.rollback(); // Rollback the transaction if duplicate phone numbers are found
      return Util?.handleErrorRespone('Duplicate phone numbers within this organization: ' + [...duplicatePhoneNumbers].join(', '));
    }

      const createMultipleGuest = await myModel.bulkCreate(data, { transaction: t })
      t.commit()
      return Util?.handleCreateSuccessRespone('Multiple Guests created successfully')

    } catch (error) {
      t.rollback()
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Bulk guest delete
  async bulkGuestDelete(Guest: string, whereClause: any = {}, userId: any) {
    const myModel = this.sequelize.model(Guest);
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({ where: { userId } })
      console.log(user?.organizationId)
      if (!user)
        return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({ where: { organizationId: user?.organizationId } })

      if (!get_org)
        return Util?.handleErrorRespone('organization not found');

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
