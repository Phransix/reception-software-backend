
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DoesUserExist } from 'src/common/guards/doesUserExist.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import * as Util from '../../utils/index'
import { LoginDTO } from 'src/guard/auth/loginDTO';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
<<<<<<< HEAD
import { log } from 'console';
=======
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
// import { LoginDTO } from 'src/guard/auth/loginDTO';
>>>>>>> 1e7973acd6332942c95ebe00a33a4ab5f6280ff7


 @ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  

  constructor(
    private readonly organizationService: OrganizationService,
    // private readonly userService: UsersService
   
  ) {}


  @ApiOperation({summary:'create New Organization'})
  @Public()
  @UseGuards(DoesUserExist)
  @Post('signUp')
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    try {

      let new_Enquiry = this.organizationService.create(createOrganizationDto);
      return new_Enquiry;

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }

  @ApiOperation({summary:'Verify Organization Email '})
  @Public()
  @Post('verifyEmail')
  async verifyEmail(@Body()token:VerifyEmailDto){
    try{

      console.log(token)
      
      const emailVerify = await this.organizationService.verifyEmail(token)
      return emailVerify

    }catch(error){
    console.log(error)
    return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
  }
  };

<<<<<<< HEAD
  @Post('login')
  async login(@Body() loginDto: LoginDTO){
 
    const user = await this.organizationService.validateUser(loginDto);
    if (!user){
      throw new HttpException('Invalid Credentials',HttpStatus.UNAUTHORIZED)
    }else{
      // throw new HttpException('Login Successfully',HttpStatus.ACCEPTED)
      return user
    }
  }
=======
  // @Public()
  // @Post('login')
  // async login(@Body() loginDto: LoginDTO){
  //   const user = await this.organizationService.validateUser(loginDto);
  //   if (!user){
  //     throw new HttpException('Invalid Credentials',HttpStatus.UNAUTHORIZED)
  //   }else{
  //     // throw new HttpException('Login Successfully',HttpStatus.ACCEPTED)
  //     return user
  //   }
  // }
>>>>>>> 1e7973acd6332942c95ebe00a33a4ab5f6280ff7

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get All Organization'})
  @Public()
  @UseGuards(AtGuard)
  @Get('getAllOrganizations')
 async findAll() {

  try {
    const allQueries = this.organizationService.findAll()
    return allQueries;

  }catch(error){
    console.log(error)
    return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
  }

  };

 
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get Organization By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {
      let orgData = this.organizationService.findOne(id)
      return orgData

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }


  };

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Organization By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {

    try {
      const orgUpdate = await this.organizationService.update(id, updateOrganizationDto)
      return orgUpdate

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }

  }


  @Public()
  @ApiOperation({ summary: 'Forgot Customer Password' })
  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {


    try {
      let res = await this.organizationService.forgetPassword(data);
      return res;
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }

  @Public()
  @ApiOperation({ summary: 'Reset Customer Password' })
  @Post('reset-password/:token')
  @ApiParam({ name: 'token', type: 'string', required: true })
  async resetPassword(@Param('token') token: string, @Body() data: ResetPasswordDto) {
    try {
   
      let res = await this.organizationService.resetPassword(token, data);
      return res;
    } catch (error) {
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }

  }
  

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Delete Organization By Id'})
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Organization')
  @Delete(':id')
 async remove(@Param('id') id: string) {

    try {
      
      let orgDelete = await this.organizationService.remove(id)
      return orgDelete

     }catch(error){
      console.log(error)
      return Util.handleForbiddenExceptionResponses('Organization does not exist');
      
     }

  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Restore Organization By Id'})
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Organization')
  @Post(':id/restore')
  async restoreUser(@Param('id') id: string){
    return this.organizationService.restoreUser(id)
  }

}