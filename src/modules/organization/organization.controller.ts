
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DoesOrgExist } from 'src/common/guards/doesOrgExist.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { Organization } from './entities/organization.entity';


@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    // private readonly userService: UsersService

  ) { }

  // Create New Organization
  @ApiOperation({ summary: 'create New Organization' })
  @Public()
  @UseGuards(DoesOrgExist)
  @Post('signUp')
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    try {
      let new_Enquiry = this.organizationService.create(createOrganizationDto);
      return new_Enquiry;

    } catch (error) {
      console.log(error)
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
      return Util?.handleFailResponse('Registration Failed');
    }
  }

  // Verify Organization Account
  @ApiOperation({ summary: 'Verify Organization Email ' })
  @Public()
  @Post('verifyEmail')
  async verifyEmail(@Body() token: VerifyEmailDto) {
    try {

      console.log(token)

      const emailVerify = await this.organizationService.verifyEmail(token)
      return emailVerify

    } catch (error) {
      console.log(error)
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
      return Util?.handleFailResponse('Accounts verification failed');
    }
  };


  // Get All Organization In the System
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get All Organization' })
  @Public()
  @ApiQuery({
    name:'page',
    type:'number',
    required:false
  })
  @ApiQuery({
    name:'size',
    type:'number',
    required:false
  })
  @ApiQuery({
    name:'length',
    type:'number',
    required:false
  })
  @UseGuards(AtGuard)
  @Get('getAllOrganizations')
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('length') length: number,
  ) {
    try {

      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone("Organizations current page cannot be negative");
      }

      const { limit, offset } = Util.getPagination(page, size)

      const allQueries = await Organization?.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      })

      let result = Util?.getPagingData(allQueries, page, limit, length)
      console.log(result)

      const dataResult = { ...allQueries }
      return Util?.handleSuccessRespone(dataResult, 'Organizations Data retrieved successfully.')


    } catch (error) {
      console.log(error)
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
      return Util?.handleFailResponse('Failed, Organizations Data Not Found');
    }
  };


  // Get Organization By The Id
  @ApiTags('Organization')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get Organization By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      let orgData = this.organizationService.findOne(id)
      return orgData

    } catch (error) {
      console.log(error)
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
      return Util?.handleFailResponse('Failed, Organization Data Not Found');
    }
  };


  // Update Organization By The Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Organization By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {

    try {
      const orgUpdate = await this.organizationService.update(id, updateOrganizationDto)
      return orgUpdate

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Failed to update Organization Data');
    }

  }

  // Update Organization  Profile Photo
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Organization Profile Photo By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id/profilePhoto')
  async updateImg(@Param('id') id: string, @Body() createOrganizationImgDto: CreateOrganizationImgDto) {

    try {
      const orgUpdate = await this.organizationService.updateImg(id, createOrganizationImgDto)
      return orgUpdate

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Failed to update Organization Profile Photo');
    }
  }

  // Delete Organization
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete Organization By Id' })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Organization')
  @Delete(':id')
  async remove(@Param('id') id: string) {

    try {

      let orgDelete = await this.organizationService.remove(id)
      return orgDelete

    } catch (error) {
      console.log(error)
      return Util.handleForbiddenExceptionResponses('Organization does not exist');

    }
  }


  // Restore Deleted Data
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Restore Organization By Id' })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Organization')
  @Post(':id/restore')
  async restoreUser(@Param('id') id: string) {
    return this.organizationService.restoreUser(id)
  }

}