import { BadRequestException,HttpException,HttpStatus,Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Guest } from './entities/guest.entity';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
import { guestLoginDTO } from 'src/guard/auth/guestLoginDTO';

@Injectable()
export class GuestService {
  
  constructor (
    @InjectModel(Guest) private readonly GuestModel: typeof Guest
  ){}

  // Creating a guest
  async create(createGuestDto: CreateGuestDto) {
    try {
      await Abstract?.createData(Guest,createGuestDto);
      return Util?.handleCreateSuccessRespone("Guest Created Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Guest Registration Failed')
    }
  }

  async findAll() {
    try {
      const guest = await Guest.findAll({
        attributes: {
          exclude:['createdAt','updatedAt']
        }
      })
      return Util?.handleSuccessRespone(guest, "Guest Data retrieval Successful")
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Guest retrieval failed')
    }
  }

  async findOne(id: number) {
    try {
      const guest = await Guest.findOne({where: { id },
        attributes: {exclude:['createdAt','updatedAt']}
      });
      if (!guest) {
        throw new NotAcceptableException('The guest does not exist')
      }
      return Util?.handleSuccessRespone(guest,'Guest data retrieved successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Guest Data retrieval failed')
    }
  }

  async update(id: number, updateGuestDto: UpdateGuestDto) {
    try {
      const guest = await Guest.findOne({where:{ id }});
      if (!guest) {
        throw new NotAcceptableException('Guest data not found')
      }
      Object.assign(guest,updateGuestDto)
      await guest.save()
      return Util?.handleSuccessRespone(guest, 'Guest data updated successfully')
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Guest update failed')
    }
  }

  async remove(id: number) {
    try {
      const guest = await Guest.findByPk(id);
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

  async guestSignIn (guestloginDTO: guestLoginDTO){
    const {phoneNumber} = guestloginDTO
    const guest = await this.GuestModel.findOne({where:{phoneNumber}})
    if (!guest) {
      throw new HttpException('Guest Sign In failed', HttpStatus.UNAUTHORIZED)
    } else {
      throw new HttpException('Guest Sign In successful', HttpStatus.ACCEPTED)
    }
  }
}
