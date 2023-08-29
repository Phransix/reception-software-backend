import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index'
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/entities/role.entity'
import { Organization } from '../organization/entities/organization.entity';
import { ChangePassDTO } from 'src/guard/auth/changePassDTO';
// import { createAccessToken, generateRefreshToken, verifyEmailToken } from '../../utils/index';
import { LoginDTO } from 'src/guard/auth/loginDTO';
import * as Abstract from '../../utils/abstract'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { log } from 'console';



@Injectable()
export class UsersService {

  constructor (@InjectModel(User) private userModel: typeof User,
  @InjectModel(Role) private roleModel: typeof Role,
  @InjectModel(Organization) private orgModel: typeof Organization,
  private jwtService: JwtService,
  private config: ConfigService,
  
  
  ){}

  



//  Register New User
  async create(createUserDto: CreateUserDto)  {
    try {

      const hash = await argon.hash(createUserDto.password)
    
      

      const user = await this.userModel?.create({...createUserDto})

      let user_data ={
        roleId: user?.roleId,
        organizationId: user?.organizationId,
        fullName: user?.fullName,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        password: await hash
      }

      console.log(user_data);
      console.log(createUserDto);
      console.log(hash)

      const users = await this.userModel?.create({...user_data})
      console.log(users)

      // await Abstract?.createData(User, createUserDto);
      return Util?.handleCreateSuccessRespone( "User Created Successfully");
    } catch (error) {
      console.error(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }


  // // Verify Email Account
  // async verifyEmail(verifyEmailDto:VerifyEmailDto) {
  //   try{
  

  //     const decodeToken = verifyEmailToken(verifyEmailDto?.token);
  //     // console.log(decodeToken);
     
  //     if(!decodeToken){
  //       return Util?.handleFailResponse('User not verified')
  //     }

   
  //     const orgToken = await this.userModel.findOne({where:{email:decodeToken?.email}})
      
  //     // console.log(decodeToken?.email);
  //     // return;

  //     if(!orgToken){
  //       return Util?.handleFailResponse('User not found')
  //     }

  //     if(orgToken?.isVerified === true)
  //     return Util?.handleFailResponse('User account already verified')

  //     await Organization.update({isVerified: true},{where: {id: orgToken?.id, email: orgToken?.email}} )
  //     return Util?.SuccessRespone('Your account has been successfully verified')

  //   }catch (error) {
  //     console.log(error)
  //     return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
  //   }
  // };


// Login users


async login(loginDto: LoginDTO){
  const {email,password} = loginDto

  

  const user = await User.findOne({where:{email}})
  const org = await Organization.findOne({where:{email}})
  if(!user){
    return Util.handleForbiddenExceptionResponses('Invaid email or password');
  }


  const passwordMatches = await argon.verify(
    user.password,
    loginDto.password,
  );
  if (!passwordMatches)
    return Util.handleForbiddenExceptionResponses('Invaid email or password');


      // Check if the oraganiazation is verified
     if (org?.isVerified != true)
     return Util?.handleFailResponse('Oraganiazation account not verified')
     console.log(org?.isVerified);

 

  const user_role = await Role.findOne({where:{roleId:user?.roleId}})

  if(!user_role)
    // throw new Error ('User with this email does not exist')
    return Util.handleErrorRespone ('User not found')
  

  let tokens =  await this?.getTokens(user.userId,user.email,user_role?.name)

     console.log(tokens)
    //return;
     let org_data ={
    id: user?.id,
    userId: user.userId,
    roleId: user?.roleId,
    role_name : user_role?.name,
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
       where: { id }
       });
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
        // throw new Error('User not found.');
        return Util?.handleFailResponse(`User with this #${id} not found`)
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


  // Restore Deleted Data
  async restoreUser(id:string){

    try {

      const organization = await this.userModel.restore({where:{id}})
      console.log(organization)
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Organization restored successfully.")
      
    } catch (error) {
      return Util.handleForbiddenExceptionResponses('Data Not Restored');
    }
 
  }

 

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
      const match = await argon.verify(user.password, oldPassword)
      if(!match){
        return Util?.handleFailResponse("Incorrect old password")
      }

      // Testing if confirmNewPassword != newPassword
      if (confirmNewPassword != newPassword) {
        return Util?.handleFailResponse("Passwords do not match")
      }

     
       // Hash the new password and update the user's password
    const hashedNewPassword = await argon.hash(newPassword);
    user.password = hashedNewPassword;
  
    // await this.userModel.save(user);
    Object.assign(user, changepassDto)
    await user.save()
    return Util?.handleSuccessRespone(Util?.SuccessRespone, "Your Password has been changed successfully.")
  }

  async getTokens(user_id: string, email: string,role:string) {
    const jwtPayload ={
      sub: user_id,
      email: email,
      scopes: role,
    };


  


    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        // expiresIn: '15m',
        expiresIn: '7d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;

  }

}
