import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Request, NotFoundException, HttpException, HttpStatus, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index'
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangePassDTO } from 'src/guard/auth/changePassDTO';
import { LoginDTO } from 'src/guard/auth/loginDTO';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';
import { DoesUserExist } from 'src/common/guards/doesUserExist.guard';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserImgDto } from './dto/create-userImg.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../organization/dto/create-organization.dto';
import { Roles } from 'src/common/decorators/roles.decorator';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    @InjectModel(User) private userModel: typeof User,) { }


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
    try {
      let new_user = this.usersService.create(createUserDto);
      return new_user;
    } catch (error) {
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  // Login Users
  @ApiTags('Users')
  @ApiOperation({ summary: 'Organization/User Login' })
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    const user = await this.usersService.login(loginDto);
    if (!user) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED)
    } else {
      // throw new HttpException('Login Successfully',HttpStatus.ACCEPTED)
      return user
    }
  }


  // Get All Users
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get All Users' })
  @Public()
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    required: false
  })

  @UseGuards(AtGuard)
  @Get('getAllUsers')
  async findAllfindAll(@GetCurrentUserId() userId: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    console.log(userId)

    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone("Users current page cannot be negative");
      }

      const { limit, offset } = Util.getPagination(page, size)

      const allQueries = await User?.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      })

      let result = Util?.getPagingData(allQueries, page, limit)
      console.log(result)

      const dataResult = { ...result }
      return Util?.handleSuccessRespone(dataResult, 'Users Data retrieved successfully.')


    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  };


  // Get User By The Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get User By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {

    try {

      let userData = await this.usersService.findOne(id);
      return userData

    } catch (error) {
      console.log(error)
      return Util?.getTryCatchMsg(Util?.getTryCatchMsg(error))
    }
  };


  // Update User By The Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update User By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  async updateOrg(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    try {

      const userUpdate = await this.usersService.update(id, updateUserDto)
      return userUpdate

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError('User data Not updated');
    }
  };


  // Update User Profile Photo With The Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update User Profile Image By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id/profilePhoto')
  async updateImg(@Param('id') id: string, @Body() createUserImgDto: CreateUserImgDto) {

    try {

      const userUpdateImg = await this.usersService.updateImg(id, createUserImgDto)
      return userUpdateImg

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError('User Profile Photo Not updated');
    }
  };


  // Change User Password By The Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Change Password Of User By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id/changePassword')
  async changePassword(@Param('id') id: number, @Body() changePassDTO: ChangePassDTO) {
    try {
      const userPass = await this.usersService.changePass(id, changePassDTO)
      return userPass
      // console.log(userPass)
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  // Forgot Password
  @ApiTags('Users')
  @Public()
  @ApiOperation({ summary: 'Forgot Customer Password' })
  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    try {
      let res = await this.usersService.forgetPassword(data);
      return res;
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Failed to send email');
    }
  }


  // Reset Password
  @ApiTags('Users')
  @Public()
  @ApiOperation({ summary: 'Reset Customer Password' })
  @Post('reset-password/:token')
  @ApiParam({ name: 'token', type: 'string', required: true })
  async resetPassword(@Param('token') token: string, @Body() data: ResetPasswordDto) {
    try {

      let res = await this.usersService.resetPassword(token, data);
      return res;
    } catch (error) {
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
      return Util?.handleFailResponse('Failed to reset Password');
    }
  }


  // Delete/Remove User By The Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete User By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {

    try {

      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw new Error('User data not Found')
      }

      Object.assign(user)
      await user.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "User data deleted successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Restore Deleted User Date By Id
  @ApiTags('Users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Restore User Data By Id' })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Users')
  @Post(':id/restore')
  async restoreUser(@Param('id') id: string) {
    return this.usersService.restoreUser(id)
  }






}
