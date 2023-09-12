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
  create(@Body() createStaffDto: CreateStaffDto) {
    try {
      return this.staffService.create(createStaffDto);
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
    }
  }

  // Get All Staffs
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get All Staff' })
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
  async findAll(@Query('page') page: number, @Query('size') size: number) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Staffs current page cannot be negative',
        );
      }

      const { limit, offset } = Util.getPagination(page, size);

      const allQueries = await Staff?.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Staffs Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
    }
  }

  // Get Staff By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get Staff By staffId' })
  @Public()
  @UseGuards(AtGuard)
  @Get(':staffId')
  async findOne(@Param('staffId') staffId: string) {
    try {
      return this.staffService.findOne(staffId);
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
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
    @Param('staffId') staffId: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    try {
      return this.staffService.update(staffId, updateStaffDto);
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
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
    @Param('staffId') staffId: string,
    @Body() createStaffImgDto: CreateStaffImgDto,
  ) {
    try {
      return this.staffService.updateImg(staffId, createStaffImgDto);
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
    }
  }

  // Delete Staff By The Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete Staff By staffId' })
  @Public()
  @UseGuards(AtGuard)
  @Delete(':staffId')
 async remove(@Param('staffId') staffId: string) {
    try {
      return this.staffService.remove(staffId);
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
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
  async searchStaff(@Query('keyword') keyword: string) {
    try {
      return this?.staffService?.searchStaff(keyword.charAt(0).toUpperCase());
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error);
    }
  }
}
