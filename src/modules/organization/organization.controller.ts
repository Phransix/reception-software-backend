import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDto,
  VerifyEmailDto,
} from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DoesOrgExist } from 'src/common/guards/doesOrgExist.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as Util from '../../utils/index';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { CreateOrganizationImgDto } from './dto/create-organizationImg.dto';
import { Organization } from './entities/organization.entity';
import { LoginDTO } from 'src/guard/auth/loginDTO';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService) {}
  

  // Create New Organization
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiOperation({ summary: 'create New Organization' })
  @Public()
  @UseGuards(DoesOrgExist)
  @Post('signUp')
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    let ErrorCode: number;
    try {
      let new_org = await this.organizationService.create(
        createOrganizationDto,
      );
      if (new_org?.status_code != HttpStatus.CREATED) {
        ErrorCode = new_org?.status_code;
        throw new Error(new_org?.message);
      }
      return new_org;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Verify Organization Account
  @ApiOperation({ summary: 'Verify Organization Email ' })
  @Public()
  @Post('verifyEmail')
  async verifyEmail(@Body() token: VerifyEmailDto) {
    let ErrorCode: number;
    try {
      console.log(token);

      const emailVerify = await this.organizationService.verifyEmail(token);
      if (emailVerify?.status_code != HttpStatus.CREATED) {
        ErrorCode = emailVerify?.status_code;
        throw new Error(emailVerify?.message);
      }
      return emailVerify;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Login Organization
  @ApiOperation({ summary: 'Organization Login' })
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    let ErrorCode: number;
    try {
      const org = await this.organizationService.login(loginDto);
      if (org?.status_code != HttpStatus.CREATED) {
        ErrorCode = org?.status_code;
        throw new Error(org?.message);
      }
      return org
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Get All Organization In the System
  @ApiResponse({
    status: 200,
    description: 'The record has been retrieve successfully.',
  })
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get All Organizations' })
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
  @Get('getAllOrganizations')
  async findAll(@Query('page') page: number, @Query('size') size: number) {
    let ErrorCode: number;
    try {
      let staffData = await this.organizationService?.findAll(page, size);

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

  // Get Organization By The Id
  @ApiTags('Organization')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get Organization By organizationId' })
  @Public()
  @UseGuards(AtGuard)
  @Get(':organizationId')
  async findOne(@Param('organizationId') organizationId: string) {
    let ErrorCode: number;
    try {
      let orgData = await this.organizationService.findOne(organizationId);
      if (orgData?.status_code != HttpStatus.OK) {
        ErrorCode = orgData?.status_code;
        throw new Error(orgData?.message);
      }
      return orgData;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Update Organization By The Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Organization By organizationId' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':organizationId')
  async update(
    @Param('organizationId') organizationId: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    let ErrorCode: number;
    try {
      const orgUpdate = await this.organizationService.update(
        organizationId,
        updateOrganizationDto,
      );
      if (orgUpdate?.status_code != HttpStatus.OK) {
        ErrorCode = orgUpdate?.status_code;
        throw new Error(orgUpdate?.message);
      }
      return orgUpdate;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Update Organization  Profile Photo
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({
    summary: 'Update Organization Profile Photo By organizationId',
  })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':organizationId/profilePhoto')
  async updateImg(
    @Param('organizationId') organizationId: string,
    @Body() createOrganizationImgDto: CreateOrganizationImgDto,
  ) {
    let ErrorCode: number;
    try {
      const orgUpdate = await this.organizationService?.updateImg(
        organizationId,
        createOrganizationImgDto,
      );
      if (orgUpdate?.status_code != HttpStatus.OK) {
        ErrorCode = orgUpdate?.status_code;
        throw new Error(orgUpdate?.message);
      }
      return orgUpdate;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Delete Organization
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete Organization By organizationId' })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Organization')
  @Delete(':organizationId')
  async remove(@Param('organizationId') organizationId: string) {
    let ErrorCode: number;
    try {
      let data = await this?.organizationService?.remove(organizationId);

      if ( data && 'status_code' in data && data.status_code !== HttpStatus.OK) {
        ErrorCode = data?.status_code;
        throw new Error(data?.message);
      }
    
      return data;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Restore Deleted Data
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Restore Organization By organizationId' })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Organization')
  @Post(':organizationId/restore')
  async restoreUser(@Param('organizationId') organizationId: string) {
    let ErrorCode: number;
    try {
      let orgRestore = await this.organizationService.restoreUser(
        organizationId,
      );
      if (orgRestore?.status_code != HttpStatus.CREATED) {
        ErrorCode = orgRestore?.status_code;
        throw new Error(orgRestore?.message);
      }
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }
}
