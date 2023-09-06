import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/common/guards';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateStaffImgDto } from './dto/create-staffImg.dto';
import { Staff } from './entities/staff.entity';
import * as Util from '../../utils/index'


@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}


// Create New Staff
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Create New Staff'})
  @Public()
  @UseGuards(AtGuard)
  @Post('registerNewStaff')
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }


// Get All Staffs
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get All Staff'})
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
  @UseGuards(AtGuard)
  @Get('getAllStaffs')
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {

      let currentPage = Util.Checknegative(page);
      if (currentPage){
        return Util?.handleErrorRespone("Staffs current page cannot be negative");
      }

      const { limit, offset } = Util.getPagination(page, size)

      const allQueries = await Staff?.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      })

      let result = Util?.getPagingData(allQueries,page,limit)
      console.log(result)

      const dataResult = {...result}
      return Util?.handleSuccessRespone( dataResult,'Staffs Data retrieved successfully.')

    }catch(error){
      console.log(error)
      return Util?.handleFailResponse('Failed, Staffs Data Not Found');
    }
  }


  // Get Staff By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get Staff By staffId'})
  @Public()
  @UseGuards(AtGuard)
  @Get(':staffId')
  findOne(@Param('staffId') staffId: string) {
    return this.staffService.findOne(staffId);
  }


  // Update Staff By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Staff By staffId'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':staffId')
  update(@Param('staffId') staffId: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(staffId, updateStaffDto);
  }


  // Update Staff Profile Photo
  @UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('defaultBearerAuth')
@ApiOperation({summary:'Update Staff Image By staffId'})
@Public()
@UseGuards(AtGuard)
@Patch(':staffId/profilePhoto')
updateImg(@Param('staffId') staffId: string, @Body()createStaffImgDto: CreateStaffImgDto) {
  return this.staffService.updateImg(staffId, createStaffImgDto);
}


// Delete Staff By The Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Delete Staff By staffId'})
  @Public()
  @UseGuards(AtGuard)
  @Delete(':staffId')
  remove(@Param('staffId') staffId: string) {
    return this.staffService.remove(staffId);
  }

   // Search Staff
   @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Search Saff Data From The System'})
  @Public()
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: false
  })
  @UseGuards(AtGuard)
  @Get('staff/search')
  async searchStaff (@Query('keyword') keyword: string){

    try {

    return  this?.staffService?.searchStaff(keyword.charAt(0).toUpperCase())

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('No matching Staff data found.')
    }

  }
  
}
