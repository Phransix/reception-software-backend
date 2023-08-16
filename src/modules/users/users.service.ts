import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index'
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { UsersModule } from './users.module';
import { ChangePassDTO } from 'src/guard/auth/changePassDTO';

@Injectable()
export class UsersService {

  constructor (@InjectModel(User) private userModel: typeof User,){}

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

      return Util?.handleSuccessRespone(user, "User retrieve successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleNotFoundResponse()
    }
  };

  // async findByEmail(email: string) {

  //   try {
  //     const user = await User.findOne({ where: { email } });
  //     if (!user) {
  //       throw new Error('User not found.');
  //     }

  //     return Util?.handleSuccessRespone(user, "Enquiry retrieve successfully.")

  //   } catch (error) {
  //     console.log(error)
  //     return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
  //   }
  // };


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

  //  async findOneByuserFullname(fullname: string): Promise<User>{
  //   return await this.userModel.findOne<User>({where: {fullname}})
  // }

   async findOneByuserEmail(email: string): Promise<User>{
    return await this.userModel.findOne<User>({where: {email}})
  }

  // Change Password
 
  async findByemail(email: string){
      return this.userModel.findOne({where:{email}})
  }

  async findById(id:number){
    return this.userModel.findOne({where:{id}})
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { email } });
  }


  // async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
  //   const user = await this.findById(userId);

  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   // Verify the old password
  //   const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  //   if (!isPasswordValid) {
  //     throw new Error('Invalid old password');
  //   }

  //   // Hash the new password and update the user's password
  //   const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  //   user.password = hashedNewPassword;
    
  //   await this.userModel.save(user);

  // }
  
  async changePass (id:number, changepassDto: ChangePassDTO){
    const {oldPassword,newPassword,confirmNewPassword} = changepassDto

    const user = await User.findOne({where:{id}})
    if(!user){
      throw new BadRequestException('User with this ${id} does not exist')
    }

      // Verify the old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid old password');
      }

      // Testing if confirmNewPassword != newPassword
      if (confirmNewPassword != newPassword) {
        return Util?.handleFailResponse("Passwords do not match")
      }

     
       // Hash the new password and update the user's password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
  
    // await this.userModel.save(user);
    Object.assign(user, changepassDto)
    await user.save()
    return Util?.handleSuccessRespone(Util?.SuccessRespone, "Enquiry updated successfully.")
  }


}
