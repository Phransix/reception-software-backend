
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DoesUserExist } from 'src/common/guards/doesUserExist.guard';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import * as Util from '../../utils/index'
import { LoginDTO } from 'src/guard/auth/loginDTO';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
// import { LoginDTO } from 'src/guard/auth/loginDTO';


 @ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  

  constructor(
    private readonly organizationService: OrganizationService,
    // private readonly userService: UsersService
   
  ) {}



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

 
  @Get(':id')
  async findOne(@Param('id') id: number) {

    try {
      let orgData = this.organizationService.findOne(id)
      return orgData

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }


  };

  
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateOrganizationDto: UpdateOrganizationDto) {

    try {
      const orgUpdate = await this.organizationService.update(id, updateOrganizationDto)
      return orgUpdate

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }

  }


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
  
  @Delete(':id')
 async remove(@Param('id') id: number) {

    try {
      
      let orgDelete = await this.organizationService.remove(id)
      return orgDelete

     }catch(error){
      console.log(error)
      return Util?.handleNotFoundResponse()
      // return Util?.checkIfRecordNotFound
     }

  }
}