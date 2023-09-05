import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import * as Util from '../../utils/index'
import { Enquiry } from './entities/enquiry.entity';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';


@ApiTags('Enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) { }


  // Create New Enquiry
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Create New Enquiry' })
  @Public()
  @UseGuards(AtGuard)
  @Post('creatEnquiry')
  async create(@Body() createEnquiryDto: CreateEnquiryDto) {
    try {
      let new_Enquiry = this.enquiriesService.create(createEnquiryDto);
      return new_Enquiry;

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }


  // Get All Enquiries
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get All Enquiries By Pagination' })
  @Public()
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    required: false
  })
  @UseGuards(AtGuard)
  @Get('getAllEnquiries')
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {

      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone("Enquiry current page cannot be negative");
      }

      const { limit, offset } = Util.getPagination(page, size)

      const allQueries = await Enquiry?.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      })


      let result = Util?.getPagingData(allQueries, page, limit)
      console.log(result)

      const dataResult = { ...result }
      return Util?.handleSuccessRespone(dataResult, 'Enquiries Data retrieved successfully.')

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  // Get One Enquiry By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get Enquiry By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      let enquiryData = await this.enquiriesService.findOne(id)
      return enquiryData

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }

  };

  // Update Enquiry
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Enquiry By Id' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateEnquiryDto: UpdateEnquiryDto) {
    try {
      const enquiryUpdate = await this.enquiriesService.update(id, updateEnquiryDto)
      return enquiryUpdate

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  // DElete Enquiry
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete Enquiry By Id' })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Enquiries')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {

      const enquiry = await Enquiry.findOne({ where: { id } });
      if (!enquiry) {
        // throw new Error('Enquiry not Found')
        return Util?.handleFailResponse('Enquiry not found')
      }

      let enquiryDelete = await this.enquiriesService.remove(id)
      return enquiryDelete

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  // Filter By Custom Range
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Filter Enquiry Data by Custom Date Range'})
  @Public()
  @ApiQuery({
    name: 'startDate',
    type: 'Date',
    required: false
  })
  @ApiQuery({
    name: 'endDate',
    type:'Date',
    required: false
  })
  @UseGuards(AtGuard)
  @ApiTags('Enquiries')
  @Get('enquiry/filterEnquiry')
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


  // Search Enquiry
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Search Enquiry Data From The System' })
  @Public()
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: false
  })
  @UseGuards(AtGuard)
  @Get('enquiry/search')
  async searchEnquiry(@Query('keyword') keyword: string) {
    try {

      return this?.enquiriesService?.searchEnquiry(keyword.charAt(0).toUpperCase())

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('No matching Enquiry data found.');
    }

  }

}
