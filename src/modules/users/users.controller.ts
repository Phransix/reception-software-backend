import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index';
import { User } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChangePassDTO } from 'src/guard/auth/changePassDTO';
import { LoginDTO } from 'src/guard/auth/loginDTO';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';
import { DoesUserExist } from 'src/common/guards/doesUserExist.guard';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserImgDto } from './dto/create-userImg.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../organization/dto/create-organization.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { LogOutDTO } from 'src/guard/auth/logoutDto';
import * as jwt from 'jsonwebtoken'
import { log } from 'console';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  // Register New User
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Create New User/Receptionist' })
  @UseGuards(AtGuard)
  @Public()
  @UseGuards(DoesUserExist)
  @Post('registerNewUser')
  async createDelivery(@Body() createUserDto: CreateUserDto) {
    let ErrorCode: number
    try {
      let new_user = await this.usersService.create(createUserDto);
      if ((new_user)?.status_code != HttpStatus.CREATED) {
        ErrorCode = ( new_user)?.status_code;
        throw new Error(( new_user)?.message)
    } 
      return new_user;
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Login Users
  @ApiTags('Users')
  @ApiResponse({
    status: 201,
    description: 'The login record',
  })
  @ApiOperation({ summary: 'Organization/User Login' })
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    let ErrorCode: number
    try {
      let user = await this.usersService.login(loginDto); 
      if (user?.status_code != HttpStatus.CREATED) {
          ErrorCode = user?.status_code;
          throw new Error(user?.message)
      } 
        return user;
    
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Get All Users
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get All Users' })
  @Public()
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    required: false,
  })
  @UseGuards(AtGuard)
  @Get('getAllUsers')
  async findAll(@Query('page') page: number, @Query('size') size: number) {
    let ErrorCode: number;
    try {
      let staffData = await this.usersService?.findAll(page, size);

      if (staffData?.status_code != HttpStatus.OK) {
        ErrorCode = staffData?.status_code;
        throw new Error(staffData?.message);
      }
      return staffData;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Get User By The Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get User By userId' })
  @Public()
  @UseGuards(AtGuard)
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    let ErrorCode: number
    try {
      let userData = await this.usersService.findOne(userId);
      if (userData?.status_code != HttpStatus.OK) {
        ErrorCode = userData?.status_code;
        throw new Error(userData?.message)
    } 
      return userData

    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }



  // Update User By The Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update User By userId' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':userId')
  async updateOrg(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    let ErrorCode: number
    try {
      const userUpdate = await this.usersService.update(userId, updateUserDto);
      if ((userUpdate)?.status_code != HttpStatus.OK) {
        ErrorCode = ( userUpdate)?.status_code;
        throw new Error(( userUpdate)?.message)
    } 
      return userUpdate;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Update User Profile Photo With The Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update User Profile Image By userId' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':userId/profilePhoto')
  async updateImg(
    @Param('userId') userId: string,
    @Body() createUserImgDto: CreateUserImgDto,
  ) {
    let ErrorCode: number
    try {
      const userUpdateImg = await this.usersService.updateImg(
        userId,
        createUserImgDto,
      );
      if ((userUpdateImg)?.status_code != HttpStatus.OK) {
        ErrorCode = ( userUpdateImg)?.status_code;
        throw new Error(( userUpdateImg)?.message)
    } 
      return userUpdateImg;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Change User Password By The Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Change Password Of User By userId' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':userId/changePassword')
  async changePassword(
    @Param('userId') userId: string,
    @Body() changePassDTO: ChangePassDTO,
  ) {
    let ErrorCode: number
    try {
      const userPass = await this.usersService.changePass(
        userId,
        changePassDTO,
      );
      if ((userPass)?.status_code != HttpStatus.OK) {
        ErrorCode = ( userPass)?.status_code;
        throw new Error(( userPass)?.message)
    } 
      return userPass;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Forgot Password
  @ApiTags('Users')
  @Public()
  @ApiOperation({ summary: 'Forgot Customer Password' })
  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    let ErrorCode: number
    try {
      let res = await this.usersService.forgetPassword(data);
      if ((res)?.status_code != HttpStatus.CREATED) {
        ErrorCode = ( res)?.status_code;
        throw new Error(( res)?.message)
    } 
      return res;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Reset Password
  @ApiTags('Users')
  @Public()
  @ApiOperation({ summary: 'Reset Customer Password' })
  @Post('reset-password/:token')
  @ApiParam({ name: 'token', type: 'string', required: true })
  async resetPassword(
    @Param('token') token: string,
    @Body() data: ResetPasswordDto,
  ) {
    let ErrorCode: number
    try {
      let res = await this.usersService.resetPassword(token, data);
      if ((res)?.status_code != HttpStatus.CREATED) {
        ErrorCode = ( res)?.status_code;
        throw new Error(( res)?.message)
    } 
      return res;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Delete/Remove User By The Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete User By userId' })
  @Public()
  @UseGuards(AtGuard)
  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    let ErrorCode: number
    try {
     
      let user_delete = await this.usersService.remove(userId);
      if (user_delete?.status_code != HttpStatus.OK) {
        ErrorCode = user_delete?.status_code;
        throw new Error(user_delete?.message)
    } 
      return user_delete
     
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode);
    }
  }

  // Restore Deleted User Date By Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Restore User Data By userId' })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Users')
  @Post(':userId/restore')
  async restoreUser(@Param('userId') userId: string) {
    return this.usersService.restoreUser(userId);
  }

  // Logout Users
  @ApiTags('Users')
  @ApiOperation({ summary: 'Organization/User Logout' })
  @Public()
  @Post('logout')
  async logout(@Body() logoutDto: LogOutDTO) {
    let ErrorCode: number
    try {
      const user = await this.usersService.logout(logoutDto);
      if (user?.status_code != HttpStatus.CREATED) {
        ErrorCode = user?.status_code;
        throw new Error(user?.message)
    } 
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }



}
