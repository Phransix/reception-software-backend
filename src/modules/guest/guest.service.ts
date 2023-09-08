import { BadRequestException, HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Guest } from './entities/guest.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { guestOpDTO } from 'src/guard/auth/guestOpDTO';
import { Op } from 'sequelize';
import moment from 'moment';


@Injectable()
export class GuestService {

  constructor(
    @InjectModel(Guest) private readonly GuestModel: typeof Guest
  ) { }

  // Creating a guest
  async create(createGuestDto: CreateGuestDto) {
    try {

      await Abstract?.createData(Guest, createGuestDto)

      const {phoneNumber} = createGuestDto
      const guestData = await this.GuestModel.findOne({where:{phoneNumber}})

      let guest_data = {
        guestId: guestData?.guestId,
        firstName: guestData?.firstName,
        lastname: guestData?.lastName,
        gender: guestData?.gender,
        countryCode: guestData?.countryCode,
        phoneNumber: guestData?.phoneNumber
      }

      return Util?.handleSuccessRespone(guest_data, "Guest Created Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Guest Registration Failed')
    }
  }

  async findAll() {
    try {
      const guest = await Guest.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })
      return Util?.handleSuccessRespone(guest, "Guest Data retrieval Successful")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Guest retrieval failed')
    }
  }

  async findOne(guestId: string) {
    try {
      const guest = await Guest.findOne({
        where: { guestId },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
      if (!guest) {
        throw new NotAcceptableException('The guest does not exist')
      }
      return Util?.handleSuccessRespone(guest, 'Guest data retrieved successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Guest Data retrieval failed')
    }
  }

  async update(guestId: string, updateGuestDto: UpdateGuestDto) {
    try {
      const guest = await Guest.findOne({ where: { guestId } });
      if (!guest) {
        throw new NotAcceptableException('Guest data not found')
      }
      Object.assign(guest, updateGuestDto)
      await guest.save()
      return Util?.handleSuccessRespone(guest, 'Guest data updated successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Guest update failed')
    }
  }

  async remove(guestId: string) {
    try {
      const guest = await Guest.findByPk(guestId);
      if (!guest) {
        throw new NotAcceptableException("Guest Data does not exist")
      }
      await guest.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Guest Data deleted Successfully")

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Guest removal failed")
    }
  }

  async guestSignIn (guestOpDTO:guestOpDTO){
    const {phoneNumber,countryCode} = guestOpDTO
    const guestNo = await this.GuestModel.findOne({where:{phoneNumber}})
    const cCode = await this.GuestModel.findOne({where:{countryCode}})

    let guest_data = {
      guestId: guestNo?.guestId,
      firstName: guestNo?.firstName,
      lastname: guestNo?.lastName,
      gender: guestNo?.gender,
      countryCode: guestNo?.countryCode,
      phoneNumber: guestNo?.phoneNumber
    }

    if (!guestNo && !cCode) {
      throw new HttpException('Guest Sign In failed', HttpStatus.UNAUTHORIZED)
    } else {
      return Util?.handleSuccessRespone(guest_data,"Guest Sign In Success")
    }
  }

  async guestSignOut (guestOpDTO:guestOpDTO){
    const {phoneNumber,countryCode} = guestOpDTO
    const guest = await this.GuestModel.findOne({where:{phoneNumber}})
    const cCode = await this.GuestModel.findOne({where:{countryCode}})
    if (!guest && !cCode) {
      throw new HttpException('Guest Sign Out failed', HttpStatus.UNAUTHORIZED)
    } else {
      throw new HttpException('Guest Sign Out successful', HttpStatus.ACCEPTED)
    }
  }

  // Search guest by names
  async searchGuest(keyword: string) {
    try {
      const guest = await this.GuestModel.findAll({
        where: {
          firstName: {
            [Op.like]: `%${keyword}%`,
          },
        },
      });
      if (!guest) {
        throw new HttpException('Guest not found', HttpStatus.NOT_FOUND)
      }
      return guest
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Guest not found")
    }
  }

  // Search by Custom Date Range
  async customGuestSearch(startDate: Date, endDate: Date){
    try {
      const guestSearch = await Guest.findAll({
        where:{
          createdAt: 
          {
            [Op.between]: [startDate,endDate],
          }
        },
        attributes: {exclude: ['createdAt','updated', 'deletedAt']}
      });
      if (!guestSearch || guestSearch.length === 0){
        return Util?.handleFailResponse("No matching Enquiry data found.")
      }
      return guestSearch
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Guest Search failed")
    }
  }


    // Filter Guest by Gender
    async genderFilter (keyword: string){
      try {
        let filter = {}

        if(keyword != null){
          filter = {gender : keyword}
        }

        const filterCheck = await this.GuestModel.findAll({
          where: {
            ...filter
          },
        });
        if (!filterCheck) {
          throw new HttpException('Gender not found', HttpStatus.NOT_FOUND)
        }
        return filterCheck
      } catch (error) {
        console.log(error)
        return Util?.handleFailResponse('Gender filtering failed')
      }
    }

    async findOneByPhoneNumber(phoneNumber: string): Promise<Guest> {
      return await this.GuestModel.findOne<Guest>({ where: { phoneNumber } })
    }

}

