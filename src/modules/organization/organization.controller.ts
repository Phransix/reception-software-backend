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
    private readonly organizationService: OrganizationService, // private readonly userService: UsersService
  ) {}

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
      console.log(error);
      return Util?.getTryCatchMsg(error);
      // return Util?.handleFailResponse('Registration Failed');
    }
  }

  // Verify Organization Account
  @ApiOperation({ summary: 'Verify Organization Email ' })
  @Public()
  @Post('verifyEmail')
  async verifyEmail(@Body() token: VerifyEmailDto) {
    try {
      console.log(token);

      const emailVerify = await this.organizationService.verifyEmail(token);
      return emailVerify;
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
      // return Util?.handleFailResponse('Accounts verification failed');
    }
  }

  // Login Organization
  @ApiOperation({ summary: 'Organization Login' })
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    try {
      const org = await this.organizationService.login(loginDto);
      if (!org) {
        throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
      } else {
        return org;
      }
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
    }
  }

  // Get All Organization In the System
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get All Organization' })
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
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Organizations current page cannot be negative',
        );
      }

      const { limit, offset } = Util.getPagination(page, size);

      const allQueries = await Organization?.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Organizations Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
      // return Util?.handleFailResponse('Failed, Organizations Data Not Found');
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
    try {
      let orgData = this.organizationService.findOne(organizationId);
      return orgData;
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
      // return Util?.handleFailResponse('Failed, Organization Data Not Found');
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
    try {
      const orgUpdate = await this.organizationService.update(
        organizationId,
        updateOrganizationDto,
      );
      return orgUpdate;
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
      // return Util?.handleFailResponse('Failed to update Organization Data');
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
    try {
      const orgUpdate = await this.organizationService.updateImg(
        organizationId,
        createOrganizationImgDto,
      );
      return orgUpdate;
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
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
    try {
      let orgDelete = await this.organizationService.remove(organizationId);
      return orgDelete;
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
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
    try {
      return this.organizationService.restoreUser(organizationId);
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
    }
  }
}
