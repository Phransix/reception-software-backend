import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus } from '@nestjs/common';
import { PurposeService } from './purpose.service';
import { CreatePurposeDto, visitPurpose } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import * as Util from '../../utils/index'
import { AuthGuard } from '@nestjs/passport';
import { Purpose } from './entities/purpose.entity';
import { AtGuard } from 'src/common/guards/at.guard';


@Controller('purpose')
export class PurposeController {
  constructor(private readonly purposeService: PurposeService) { }

  // Creating Purpose
  @Public()
  @ApiTags('Purpose')
  @Public()
  @ApiOperation({summary:'Create New Purpose'})
  @Post('createPurpose')
  async create(@Body() createPurposeDto: CreatePurposeDto) {
    let ErrorCode: number
    try {
      let purpose =  await this.purposeService.create(createPurposeDto);
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.CREATED) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }


  // Get All Purposes
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @ApiQuery({
    name: "page",
    type: Number,
    required: false
  })
  @ApiQuery({
    name: "size",
    type: Number,
    required: false
  })
  @UseGuards(AtGuard)
  @ApiTags('Purpose')
  @ApiOperation({ summary: 'Get Purpose By Pagination' })
  @Get('getAllPurposes')
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    let ErrorCode: number;
    try {
      let purposeData = await this.purposeService?.findAll(page, size);

      if (purposeData?.status_code != HttpStatus.OK) {
        ErrorCode = purposeData?.status_code;
        throw new Error(purposeData?.message);
      }
      return purposeData;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }

  }


  // Get Purpose By purposeId
  @Public()
  @ApiTags('Purpose')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get Purpose By purposeId'})
  @Get(':purposeId')
  async findOne(@Param('purposeId') purposeId: string) {
    let ErrorCode: number
    try {
      const purpose = await this.purposeService.findOne(purposeId);
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.OK) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose;
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
    }
  }


    // Update Purpose By purposeId
 @Public()
  @ApiTags('Purpose')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Purpose By purposeId'})
  @Patch(':purposeId')
  async update(@Param('purposeId') purposeId: string, @Body() updatePurposeDto: UpdatePurposeDto) {
    let ErrorCode: number
    try {
      const purpose = await this.purposeService.update(purposeId,updatePurposeDto)
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.OK) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
        }
  }


    // Remove Purpose By purposeId
  @Public()
  @ApiTags('Purpose')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Remove Purpose By purposeId'})
  @Delete(':purposeId')
  async remove(@Param('purposeId') purposeId: string) {
    let ErrorCode: number
    try {
      const purpose = await this.purposeService.findOne(purposeId);
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.OK) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
        }
  }

  // Search and filter by purpose
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({ 
    name: 'keyword',
    enum: visitPurpose,
    required: false
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Purpose')
  @ApiOperation({summary:'Filter Purpose'})
  @Get('purpose/purposeFilter')
  async purposeFilter(
    @Query('keyword') keyword: string
    ){
      let ErrorCode: number
    try {
      const purpose = await this.purposeService.guestPurpose(keyword);
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.OK) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
     }
  }

  
}
