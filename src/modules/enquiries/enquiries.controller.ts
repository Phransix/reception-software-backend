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
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto, Purpose } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import * as Util from '../../utils/index';
import { Enquiry } from './entities/enquiry.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';
import { size } from 'lodash';
import { where } from 'sequelize';
import { type } from 'os';

@ApiTags('Enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  // Create New Enquiry
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Create New Enquiry' })
  @Public()
  @UseGuards(AtGuard)
  @Post('creatEnquiry')
  async create(@Body() createEnquiryDto: CreateEnquiryDto) {
    let ErrorCode: number
    try {
      let new_Enquiry = await this.enquiriesService.create(createEnquiryDto);
      if (new_Enquiry?.status_code != HttpStatus.CREATED) {
        ErrorCode = new_Enquiry?.status_code;
        throw new Error(new_Enquiry?.message)
    } 
      return new_Enquiry;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
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
    required: false,
  })
  @ApiQuery({
    name: 'size',
    type: 'number',
    required: false,
  })
  @UseGuards(AtGuard)
  @Get('getAllEnquiries')
  async findAll(@Query('page') page: number, @Query('size') size: number) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Enquiry current page cannot be negative',
        );
      }

      const { limit, offset } = Util.getPagination(page, size);

      const allQueries = await Enquiry?.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Enquiries Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.getTryCatchMsg(error)
    }
  }

  // Get One Enquiry By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get Enquiry By enquiryId' })
  @Public()
  @UseGuards(AtGuard)
  @Get(':enquiryId')
  async findOne(@Param('enquiryId') enquiryId: string) {
    let ErrorCode: number
    try {
      let enquiryData = await this.enquiriesService.findOne(enquiryId);
      if (enquiryData?.status_code != HttpStatus.OK) {
        ErrorCode = enquiryData?.status_code;
        throw new Error(enquiryData?.message)
    } 
      return enquiryData;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Update Enquiry
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Enquiry By enquiryId' })
  @Public()
  @UseGuards(AtGuard)
  @Patch(':enquiryId')
  async update(
    @Param('enquiryId') enquiryId: string,
    @Body() updateEnquiryDto: UpdateEnquiryDto,
  ) {
    let ErrorCode: number
    try {
      const enquiryUpdate = await this.enquiriesService.update(
        enquiryId,
        updateEnquiryDto,
      );
      if (enquiryUpdate?.status_code != HttpStatus.OK) {
        ErrorCode = enquiryUpdate?.status_code;
        throw new Error(enquiryUpdate?.message)
    } 
      return enquiryUpdate;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // DElete Enquiry
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Delete Enquiry By enquiryId' })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Enquiries')
  @Delete(':enquiryId')
  async remove(@Param('enquiryId') enquiryId: string) {
    let ErrorCode: number
    try {
      const enquiry = await Enquiry.findOne({ where: { enquiryId } });
      if (!enquiry) {
        // throw new Error('Enquiry not Found')
        return Util?.handleFailResponse('Enquiry not found');
      }

      let enquiryDelete = await this.enquiriesService.remove(enquiryId);
      if (enquiryDelete?.status_code != HttpStatus.OK) {
        ErrorCode = enquiryDelete?.status_code;
        throw new Error(enquiryDelete?.message)
    } 
      return enquiryDelete;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }

  // Filter By Custom Range
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Filter Enquiry Data by Custom Date Range' })
  @Public()
  @ApiQuery({
    name: 'startDate',
    type: 'Date',
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    type: 'Date',
    required: false,
  })
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
  @ApiTags('Enquiries')
  @Get('enquiry/filterEnquiry')
  async findEnquiryByDateRange(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {
      let enquiryData = { startDate, endDate };

      let currentPage = Util?.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Enquiry current page cannot be negative',
        );
      }
      const { limit, offset } = Util?.getPagination(page, size);

      const allQueries = await Enquiry.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      });

      const result = Util?.getPagingData(allQueries, page, limit);

      const dataResult = {
        ...enquiryData,
        where: {
          pagination:result
        },
        
      };

      return Util?.handleSuccessRespone(
        dataResult,
        'Enquiries data retrieve successfully',
      );
    } catch (error) {
      console.log(error);
      // return Util?.handleFailResponse('Enquiry data not found');
      return Util?.getTryCatchMsg(error)
    }
  }

  // // Filter and Paginate Enquiries By Purpose
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Filter Enquiry By The Purpose' })
  @ApiQuery({
    name: 'keyword',
    enum: Purpose,
    required: false,
  })
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
  @Get('enquiry/filterPuropse')
  async purposefilter(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {
      let currentPage = Util?.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Enquiry current Page cannot be negative',
        );
      }

      // return await this?.enquiriesService?.purposefilter(keyword);

      const { limit, offset } = Util?.getPagination(page, size);

      let queryOption: any = {
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      };

      if (keyword) {
        queryOption = {
          ...queryOption,
          where: {
            purpose: keyword,
          },
        };
      }

      const allQueries = await Enquiry?.findAndCountAll(queryOption);

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Enquiries Purpose Data Filtered Successfully.',
      );
    } catch (error) {
      console.log(error);
      // return Util?.handleFailResponse('Filtering By Purpose failed');
      return Util?.getTryCatchMsg(error)
    }
  }

  // Search Enquiry
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Search Enquirer Name  From The System' })
  @Public()
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: false,
  })
  @UseGuards(AtGuard)
  @Get('enquiry/search')
  async searchEnquiry(
    @Query('keyword') keyword: string,
  ) {
    let ErrorCode: number
    try {

      let enquirySearch = await this?.enquiriesService?.searchEnquiry(
        keyword.charAt(0).toUpperCase(),
      );

      if (enquirySearch?.status_code != HttpStatus.OK) {
        ErrorCode = enquirySearch?.status_code;
        throw new Error(enquirySearch?.message)
    } 

      return enquirySearch
      
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }
}

