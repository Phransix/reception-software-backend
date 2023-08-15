import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index'
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {

    try {
      const users = await User.findAll()
      return Util?.handleSuccessRespone(users, "Users Data retrieved successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };


  async findOne(id: number) {

    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found.');
      }

      return Util?.handleSuccessRespone(user, "Enquiry retrieve successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };


  async update(id: number, updateUserDto: UpdateUserDto) {

    try {

      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found.');
      }

      Object.assign(user, updateUserDto)
      await user.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Enquiry updated successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };

  async remove(id: number) {

    try{
      const user = await User.findOne({where:{id}});
      if (!user) {
        throw new Error('User not found.'); 
      }

      Object.assign(user)
      await user.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"User deleted successfully.")

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

  }



}
