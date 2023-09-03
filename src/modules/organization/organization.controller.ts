
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DoesOrgExist } from 'src/common/guards/doesOrgExist.guard';
import { ApiBearerAuth,  ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import * as Util from '../../utils/index'
// import * as bcrypt from 'bcrypt';
// import { LoginDTO } from 'src/guard/auth/loginDTO';
// import { User } from '../users/entities/user.entity';
// import { UsersService } from '../users/users.service';
// import { log } from 'console';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { CreateOrganizationImgDto } from './dto/create-organizationImg.dto';


 @ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    // private readonly userService: UsersService
   
  ) {}

// Create New Organization
  @ApiOperation({summary:'create New Organization'})
  @Public()
  @UseGuards(DoesOrgExist)
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

  // Verify Organization Account
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


// Get All Organization In the System
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
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

 
  // Get Organization By The Id
  @ApiTags('Organization')
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


  // Update Organization By The Id
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

  // Update Organization  Profile Photo
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Organization Profile Photo By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id/profilePhoto')
  async updateImg(@Param('id') id: string, @Body()  createOrganizationImgDto: CreateOrganizationImgDto) {

    try {
      const orgUpdate = await this.organizationService.updateImg(id, createOrganizationImgDto)
      return orgUpdate

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }


  // Forgot Password
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