import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/common/guards';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateStaffImgDto } from './dto/create-staffImg.dto';


@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}


// Create New Staff
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
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
  @UseGuards(AtGuard)
  @Get('getAllStaffs')
  findAll() {
    return this.staffService.findAll();
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
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Staff By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }


  // Update Staff Profile Photo
  // @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('defaultBearerAuth')
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
}
