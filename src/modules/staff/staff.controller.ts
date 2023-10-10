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
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AtGuard } from 'src/common/guards';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateStaffImgDto } from './dto/create-staffImg.dto';
import { Staff } from './entities/staff.entity';
import * as Util from '../../utils/index';
import { DoesStaffExist } from 'src/common/guards/doesStaffExist.guard';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // Create New Staff
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Create New Staff' })
  @Public()
  @UseGuards(AtGuard)
  @UseGuards(DoesStaffExist)
  @Post('registerNewStaff')
  async create(
    @GetCurrentUserId() userId: string,
    @Body() createStaffDto: CreateStaffDto,
  ) {
    let ErrorCode: number;
    try {
      let new_data = await this.staffService.create(createStaffDto, userId);
      if (new_data?.status_code != HttpStatus.CREATED) {
        ErrorCode = new_data?.status_code;
        throw new Error(new_data?.message);
      }
      return new_data;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Get All Staff
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get All Staffs' })
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
  @Get('getAllStaffs')
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @GetCurrentUserId() userId: string,
  ) {
    let ErrorCode: number;
    try {
      let staffData = await this.staffService?.findAll(page, size, userId);

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

  // Get Staff By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get Staff By staffId' })
  @Public()
  @UseGuards(AtGuard)
  @Get(':staffId')
  async findOne(
    @GetCurrentUserId() userId: string,
    @Param('staffId') staffId: string,
  ) {
    let ErrorCode: number;
    try {
      let staff_data = await this.staffService?.findOne(staffId, userId);
      if (staff_data?.status_code != HttpStatus.OK) {
        ErrorCode = staff_data?.status_code;
        throw new Error(staff_data?.message);
      }
      return staff_data;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Update Staff By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Staff By staffId' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':staffId')
  async update(
    @GetCurrentUserId() userId: string,
    @Param('staffId') staffId: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    let ErrorCode: number;
    try {
      let staff_update = await this.staffService.update(
        staffId,
        updateStaffDto,
        userId,
      );
      if (staff_update?.status_code != HttpStatus.OK) {
        ErrorCode = staff_update?.status_code;
        throw new Error(staff_update?.message);
      }
      return staff_update;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Update Staff Profile Photo
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Staff Image By staffId' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':staffId/profilePhoto')
  async updateImg(
    @GetCurrentUserId() userId: string,
    @Param('staffId') staffId: string,
    @Body() createStaffImgDto: CreateStaffImgDto,
  ) {
    let ErrorCode: number;
    try {
      let staff_update = await this.staffService.updateImg(
        staffId,
        createStaffImgDto,
        userId,
      );
      if (staff_update?.status_code != HttpStatus.OK) {
        ErrorCode = staff_update?.status_code;
        throw new Error(staff_update?.message);
      }
      return staff_update;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Delete Staff By The Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete Staff By staffId' })
  @Public()
  @UseGuards(AtGuard)
  @Delete(':staffId')
  async remove(
    @GetCurrentUserId() userId: string,
    @Param('staffId') staffId: string,
  ) {
    let ErrorCode: number;
    try {
      let staff_delete = await this.staffService.remove(staffId, userId);
      if (staff_delete?.status_code != HttpStatus.OK) {
        ErrorCode = staff_delete?.status_code;
        throw new Error(staff_delete?.message);
      }
      return staff_delete;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Search Staff
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Search Saff Data From The System' })
  @Public()
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: false,
  })
  @UseGuards(AtGuard)
  @Get('staff/search')
  async searchStaff(
    @Query('keyword') keyword: string,
    @GetCurrentUserId() userId: string,
  ) {
    let ErrorCode: number;
    try {
      let staff_search = await this?.staffService?.searchStaff(
        keyword.charAt(0).toUpperCase(),
        userId,
      );
      if (staff_search?.status_code != HttpStatus.OK) {
        ErrorCode = staff_search?.status_code;
        throw new Error(staff_search?.message);
      }
      return staff_search;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  
  // Bulk Create
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Create Multiple Staffs' })
  @Public()
  @Post('bulkCreateStaff/create')
  async bulkCreateStaff(
    @Body() createStaffDto: CreateStaffDto[],
    @GetCurrentUserId() userId: string,
  ) {
    let ErrorCode: number;
    try {
      const staff_data = await this.staffService?.bulkCreateStaff(
        createStaffDto,
        userId,
      );
      if (staff_data?.status_code != HttpStatus.CREATED) {
        ErrorCode = staff_data?.status_code;
        throw new Error(staff_data?.message);
      }
      return staff_data;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }
}
