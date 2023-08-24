import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index'
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
// import { UsersModule } from './users.module';
import { Role } from '../role/entities/role.entity'
import { Organization } from '../organization/entities/organization.entity';
import { ChangePassDTO } from 'src/guard/auth/changePassDTO';
import { createAccessToken, generateRefreshToken } from '../../utils/index';
import { LoginDTO } from 'src/guard/auth/loginDTO';
import * as Abstract from '../../utils/abstract'
import { AuthPassService } from 'src/guard/auth/authPass.service';



@Injectable()
export class UsersService {

  constructor (@InjectModel(User) private userModel: typeof User,
  @InjectModel(Role) private roleModel: typeof Role,
  @InjectModel(Organization) private orgModel: typeof Organization,
  
  ){}




//  Register New User
  async create(createUserDto: CreateUserDto)  {
    try {
      await Abstract?.createData(User, createUserDto);
      return Util?.handleCreateSuccessRespone( "User Created Successfully");
    } catch (error) {
      console.error(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }


// Login users
async login(loginDto: LoginDTO){
  const {email,password} = loginDto

  const user = await User.findOne({where:{email}})
  if(!user){
    // throw new Error ('User with this email does not exist')
    return Util.handleErrorRespone ('User with this email does not exist')
  }

  const IsPasswordSame = await bcrypt.compare(password,user.password)
  if(!IsPasswordSame){
    return Util.handleErrorRespone('Invalid Credentials')
  }
  let accessToken = await createAccessToken(user?.id);
  let refreshToken = await generateRefreshToken(user?.id);
  let tokens = {
    accessToken,
    refreshToken
  }
  // console.log(tokens)

     let org_data ={
    id: user?.id,
    userId: user.userId,
    roleId: user?.roleId,
    organizationId: user?.organizationId,
    fullname: user.fullName,
    email: user.email,
    IsPhoneNumber: user.phoneNumber
  }

  let userDetails = {
    org_data,tokens
  }

      //  Send user data and tokens
      return Util?.handleSuccessRespone( userDetails,'Login successfully.')
 
 
}

// Get All Users
  async findAll() {

    try {
      const users = await User.findAll({
      
      attributes:{
        exclude:['password','createdAt','updatedAt','deletedAt']
      },
      
      // include:[
      //   {
      //     model: this.orgModel,
      //     attributes:{
      //       exclude:['createdAt','updatedAt']
      //     },
      //     order:['roleId','DESC'],
      //     as:'user_role'
      //   }
      // ]

      })
      return Util?.handleSuccessRespone(users, "Users Data retrieved successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };


  // Get User By Id 
  async findOne(id: number) {

    try {
      const user = await User.findOne({
         
      attributes:{
        exclude:['password','createdAt','updatedAt','deletedAt']
      },
       where: { id } });
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


  // Update User by Id


  async update(id: number, updateUserDto: UpdateUserDto) {

    try {

      const user = await this.userModel.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found.');
      }

      Object.assign(user, updateUserDto)
      await user.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "User updated successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError('User not Updated');
    }
  };


    // delete User by Id 
  async remove(id: number) {

    try{
      const user = await User.findOne({where:{id}});
      if (!user) {
        throw new Error('User data not found.'); 
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


 
  async findByemail(email: string){
      return this.userModel.findOne({where:{email}})
  }

  async findById(id:number){
    return this.userModel.findOne({where:{id}})
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { email } });
  }

//  Change User Password
  async changePass (id:number, changepassDto: ChangePassDTO){
    const {oldPassword,newPassword,confirmNewPassword} = changepassDto

    const user = await User.findOne({where:{id}})
    if(!user){
      throw new BadRequestException('User with this ${id} does not exist')
    }

      // Verify the old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        // throw new Error('Invalid old password');
        return Util?.handleFailResponse("Incorrect old password")
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
    return Util?.handleSuccessRespone(Util?.SuccessRespone, "Your Password has been changed successfully.")
  }


}
