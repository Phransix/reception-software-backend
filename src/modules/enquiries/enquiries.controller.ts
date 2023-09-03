import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import * as Util from '../../utils/index'
import { Enquiry } from './entities/enquiry.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';


@ApiTags('Enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Create New Enquiry'})
  @Public()
  @UseGuards(AtGuard)
  @Post('creatEnquiry')
  async create(@Body() createEnquiryDto: CreateEnquiryDto) {
    try {
      let new_Enquiry = this.enquiriesService.create(createEnquiryDto);
      return new_Enquiry;
      
    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get All Enquiries By Pagination'})
  @Public()
  @UseGuards(AtGuard)
  @Get('getAllEnquiries')
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('length') length: number,
  ) {
    try {

      let currentPage = Util.Checknegative(page);
      if (currentPage){
        return Util?.handleErrorRespone("Guest current page cannot be negative");
      }

      const { limit, offset } = Util.getPagination(page, size)

      const allQueries = await Enquiry?.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      })

      let result = Util?.getPagingData(allQueries,page,limit,length)
      console.log(result)

      const dataResult = {...allQueries}
      return Util?.handleSuccessRespone( dataResult,'Enquiries Data retrieved successfully.')

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get Enquiry By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number){
    try {
      let enquiryData = await this.enquiriesService.findOne(id)
      return enquiryData

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
    
  };


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Enquiry By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateEnquiryDto: UpdateEnquiryDto) {
    try {
      const enquiryUpdate = await this.enquiriesService.update(id, updateEnquiryDto)
      return enquiryUpdate

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Delete Enquiry By Id'})
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Enquiries')
  @Delete(':id')
  async remove(@Param('id') id: number) {
     try {

      const enquiry = await Enquiry.findOne({where:{id}});
      if(!enquiry) {
        // throw new Error('Enquiry not Found')
        return Util?.handleFailResponse('Enquiry not found')
      }
      
      let enquiryDelete = await this.enquiriesService.remove(id)
      return enquiryDelete

     }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
     }
  }

  // Filter By Custom Range
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Filter Enquiry Data by Custom Date Range'})
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Enquiries')
  @Get('filterByCustomRange')
  async findEnquiryByDateRange(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,

  ){
    try {
      const enquiryData = await this.enquiriesService.filterByCustomRange(startDate,endDate)
      return enquiryData
      
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Enquiry data not found')
    }

  }

}
