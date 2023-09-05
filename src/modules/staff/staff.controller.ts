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
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
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
  @ApiQuery({
    name:'length',
    type:'number',
    required:false
  })
  @UseGuards(AtGuard)
  @Get('getAllStaffs')
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('length') length: number,
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

      let result = Util?.getPagingData(allQueries,page,limit,length)
      console.log(result)

      const dataResult = {...allQueries}
      return Util?.handleSuccessRespone( dataResult,'Staffs Data retrieved successfully.')

    }catch(error){
      console.log(error)
      return Util?.handleFailResponse('Failed, Staffs Data Not Found');
    }
  }


  // Get Staff By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get Staff By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }


  // Update Staff By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Staff By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }


  // Update Staff Profile Photo
  @UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('defaultBearerAuth')
@ApiOperation({summary:'Update Staff Image By Id'})
@Public()
@UseGuards(AtGuard)
@Patch(':id/profilePhoto')
updateImg(@Param('id') id: string, @Body()createStaffImgDto: CreateStaffImgDto) {
  return this.staffService.updateImg(id, createStaffImgDto);
}


// Delete Staff By The Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Delete Staff By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
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
