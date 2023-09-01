import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Request, NotFoundException, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index'
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangePassDTO } from 'src/guard/auth/changePassDTO';
import { LoginDTO } from 'src/guard/auth/loginDTO';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { Role } from '../role/role.enum';
// import { VerifyEmailDto } from '../organization/dto/create-organization.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';
import { DoesUserExist } from 'src/common/guards/doesUserExist.guard';
import { InjectModel } from '@nestjs/sequelize';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { hasRoles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../role/role.enum';
import { CreateUserImgDto } from './dto/create-userImg.dto';


@Controller('users')
export class UsersController {
  // roles: Role[]
  constructor(private readonly usersService: UsersService,
    @InjectModel(User) private userModel: typeof User,) {}


  // Register New User
  
  @ApiTags('Users')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Create New User/Receptionist'})
  @UseGuards(AtGuard)
  // @hasRoles(UserRole.Admin)
  // @UseGuards(RolesGuard)
  @Public()
  @UseGuards(DoesUserExist)
  @Post('registerNewUser')
  async createDelivery(@Body()  createUserDto: CreateUserDto) {
    try {
      let new_user = this.usersService.create(createUserDto);
      return new_user;
    } catch (error) {
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

 
  // @ApiTags('Users')
  // @ApiOperation({summary:'Verify Organization Email '})
  // @Public()
  // @Post('verifyEmail')
  // async verifyEmail(@Body()token:VerifyEmailDto){
  //   try{

  //     console.log(token)
      
  //     const emailVerify = await this.usersService.verifyEmail(token)
  //     return emailVerify

  //   }catch(error){
  //   console.log(error)
  //   return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
  // }
  // };

  // Login Users
  
  
  @ApiTags('Users')
  @ApiOperation({summary:'Organization/User Login'})
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDTO){
    const user = await this.usersService.login(loginDto);
    if (!user){
      throw new HttpException('Invalid Credentials',HttpStatus.UNAUTHORIZED)
    }else{
      // throw new HttpException('Login Successfully',HttpStatus.ACCEPTED)
      return user
    }
  }



  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get All Users'})
  @Public()
  @UseGuards(AtGuard)
  @Get('getAllUsers')
  async findAllfindAll(@GetCurrentUserId()userId:string){
      console.log(userId)

    try {
      const allQueries = this.usersService.findAll()
      return allQueries;

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  };


  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get User By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {

    try{

      let userData = await this.usersService.findOne(id);
        return userData
      
    }catch(error){
      console.log(error)
      return Util?.getTryCatchMsg(Util?.getTryCatchMsg(error))
    }
  };


  @ApiTags('Users')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update User By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  async updateOrg(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    try {

      const userUpdate = await this.usersService.update(id, updateUserDto)
      return userUpdate

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError('User data Not updated');
    }
  };


  @ApiTags('Users')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update User Profile Image By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id/profilePhoto')
  async updateImg(@Param('id') id: string, @Body() createUserImgDto: CreateUserImgDto) {

    try {

      const userUpdateImg = await this.usersService.updateImg(id, createUserImgDto)
      return userUpdateImg

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError('User data Not updated');
    }
  };
  


  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Delete User By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {

    try{

      const user = await User.findOne({where:{id}});
      if(!user) {
        throw new Error('User data not Found')
      } 

      Object.assign(user)
      await user.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"User data deleted successfully.")

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  }
     
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Change Password Of User By Id'})
  @Public()
  @UseGuards(AtGuard)
    @Patch(':id/changePassword')
    async changePassword(@Param('id') id: number,@Body() changePassDTO: ChangePassDTO) {
      try {
        const userPass = await this.usersService.changePass(id, changePassDTO)
        return userPass
        // console.log(userPass)
      } catch (error) {
        console.log(error)
        return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
      } 
    }


    @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Restore User Data By Id'})
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Users')
  @Post(':id/restore')
  async restoreUser(@Param('id') id: string){
    return this.usersService.restoreUser(id)
  }





}
