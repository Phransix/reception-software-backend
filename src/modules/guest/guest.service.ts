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
import { User } from '../users/entities/user.entity';



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
  // async create(createGuestDto: CreateGuestDto,userId:any) {
  //   try {

  //     console.log(userId)

  //     let user = await this?.UserModel.findOne({where:{userId}})
  //     if(!user)
  //     return Util?.CustomhandleNotFoundResponse('User not found');

  //     let get_org = await this?.OrgModel.findOne({where:{organizationId:user?.organizationId}})
  //     if(!get_org)
  //     return Util?.CustomhandleNotFoundResponse('organization not found');

  //     const guest = await Guest.create({
  //       ...createGuestDto,
  //       organizationId:get_org?.organizationId
  //     })
  //     await guest.save();
  //     const { phoneNumber } = createGuestDto
  //     const guestData = await this.GuestModel.findOne({ 
  //       where: { 
  //         phoneNumber,
  //         organizationId:get_org?.organizationId 
  //       } 
  //     })
  //     let guest_data = {
  //       guestId: guestData?.guestId,
  //       firstName: guestData?.firstName,
  //       lastname: guestData?.lastName,
  //       gender: guestData?.gender,
  //       countryCode: guestData?.countryCode,
  //       phoneNumber: guestData?.phoneNumber,
  //     }
  //     return Util?.handleCustonCreateResponse(guest_data, "Guest Created Successfully")
  //   } catch (error) {
  //     console.log(error)
  //     return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
  //   }
  // }

  async create(createGuestDto: CreateGuestDto) {
    try {
      console.log(createGuestDto);
      await Abstract?.createData(Guest, createGuestDto);
      return Util?.handleCreateSuccessRespone(
        'Guest created successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Get All Guest
  async findAll(page: number, size: number,userId:string) {
    try {
      console.log(userId)

      let currentPage = Util?.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Guest current page cannot be negative',
        );
      }

      const { limit, offset } = Util?.getPagination(page, size);

      let user = await this?.UserModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.handleErrorRespone('User not found');
      let get_org = await this?.OrgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.handleErrorRespone('organization not found');

      const guestData = await Guest.findAndCountAll({
        limit,
        offset,
        where: {
          organizationId:get_org?.organizationId
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

  // Get Gest By guestId
  async findOne(guestId: string,userId:any) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.handleErrorRespone('organization not found');

      const guest = await Guest.findOne({
        where: { guestId, organizationId:get_org?.organizationId },
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
  async update(guestId: string, updateGuestDto: UpdateGuestDto,userId:string) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.handleErrorRespone('organization not found');

      const guest = await Guest.findOne({ where: { guestId,organizationId:get_org?.organizationId } });
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
  async remove(guestId: string, userId:string) {
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.handleErrorRespone('organization not found');

      const guest = await Guest.findOne({ where: { guestId, organizationId:get_org?.organizationId  } });
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
      
      // console.log(userId)
      // let user = await this?.UserModel.findOne({where:{userId}})
      // if(!user)
      // return Util?.CustomhandleNotFoundResponse('User not found');

      // let get_org = await this?.OrgModel.findOne({where:{organizationId:user?.organizationId}})
      // if(!get_org)
      // return Util?.CustomhandleNotFoundResponse('organization not found');

      const { phoneNumber, countryCode } = guestOpDTO
      const guestNo = await this.GuestModel.findOne({ 
        where: { 
          phoneNumber,
          // organizationId:get_org?.organizationId 
        } 
      })
      const cCode = await this.GuestModel.findOne({ 
        where: { 
          countryCode,
          // organizationId:get_org?.organizationId 
        }
       })
      let guest_data = {
        guestId: guestNo?.guestId,
        firstName: guestNo?.firstName,
        lastname: guestNo?.lastName,
        gender: guestNo?.gender,
        countryCode: guestNo?.countryCode,
        phoneNumber: guestNo?.phoneNumber
      }

      if (!guestNo || !cCode) {
        return Util?.handleFailResponse('Invalid phone number or country code')
      }
      
      return Util?.handleCustonCreateResponse(guest_data, "Guest Sign In Success")
    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Bulk guest create
  async bulkGuest (Guest:string, data: any[], userId:any){
    const myModel = this.sequelize.model(Guest);
    const t = await this.sequelize.transaction();
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
      return Util?.handleErrorRespone('organization not found');

      const createMultipleGuest = await myModel.bulkCreate(data,{transaction: t})
      t.commit()
      return Util?.handleCustonCreateResponse(createMultipleGuest, 'Multiple Guests created successfully')
    
    } catch (error) {
      t.rollback()
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Bulk guest delete
  async bulkGuestDelete (Guest:string, whereClause: any = {},userId:any){
    const myModel = this.sequelize.model(Guest);
    try {

      console.log(userId)
      let user = await this?.UserModel.findOne({where:{userId}})
      console.log(user?.organizationId)
      if(!user)
      return Util?.handleErrorRespone('User not found');

      let get_org = await this?.OrgModel.findOne({where:{organizationId:user?.organizationId}})

      if(!get_org)
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


  

  async findOneByPhoneNumber(phoneNumber: string): Promise<Guest> {
    return await this.GuestModel.findOne<Guest>({ where: { phoneNumber } })
  }

}

