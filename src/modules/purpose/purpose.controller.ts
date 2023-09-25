import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus } from '@nestjs/common';
import { PurposeService } from './purpose.service';
import { CreatePurposeDto, visitPurpose } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import * as Util from '../../utils/index'
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards/at.guard';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { guestOpDTO } from 'src/guard/auth/guestOpDTO';
import { status } from '../guest/dto/create-guest.dto';


@Controller('purpose')
export class PurposeController {
  constructor(private readonly purposeService: PurposeService) { }

  // Creating Purpose
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(AtGuard)
  @Public()
  @ApiTags('Purpose')
  @Public()
  @ApiOperation({ summary: 'Create New Purpose' })
  @Post('createPurpose')
  async create(
    @Body() createPurposeDto: CreatePurposeDto,
    @GetCurrentUserId() userId: string,
  ) {
    let ErrorCode: number
    try {
      let purpose = await this.purposeService.createPurpose(createPurposeDto, userId);
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.CREATED) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
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
    @GetCurrentUserId() userId?: string
  ) {
    let ErrorCode: number;
    try {
      let purposeData = await this.purposeService?.findAll(page, size, userId);

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
  @UseGuards(AtGuard)
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Get Purpose By purposeId' })
  @Get(':purposeId')
  async findOne(
    @Param('purposeId') purposeId: string,
    @GetCurrentUserId() userId?: string
  ) {
    let ErrorCode: number
    try {
      const purpose = await this.purposeService.findOne(purposeId, userId);
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.OK) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose;
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }


  // Update Purpose By purposeId
  @Public()
  @ApiTags('Purpose')
  @Public()
  @UseGuards(AtGuard)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Update Purpose By purposeId' })
  @Patch(':purposeId')
  async update(
    @Param('purposeId') purposeId: string,
    @Body() updatePurposeDto: UpdatePurposeDto,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const purpose = await this.purposeService.update(purposeId, updatePurposeDto, userId)
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.OK) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }


  // Remove Purpose By purposeId
  @Public()
  @ApiTags('Purpose')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AtGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({ summary: 'Remove Purpose By purposeId' })
  @Delete(':purposeId')
  async remove(
    @Param('purposeId') purposeId: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const purpose = await this.purposeService.findOne(purposeId, userId);
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.OK) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
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
  @ApiOperation({ summary: 'Filter Purpose' })
  @Get('purpose/purposeFilter')
  async purposeFilter(
    @Query('keyword') keyword: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const purpose = await this.purposeService.guestPurpose(keyword, userId);
      if (purpose && 'status_code' in purpose && purpose.status_code !== HttpStatus.OK) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Search guest by custom range
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    name: 'startDate',
    type: Date,
    required: true
  })

  @ApiQuery({
    name: 'endDate',
    type: Date,
    required: true
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Purpose')
  @ApiOperation({ summary: 'Search Guest by Custom Date Range' })
  @Get('guest/filterGuest')
  async findGuestByDateRange(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const guestSearch = await this.purposeService.findByDateRange(startDate, endDate, userId)
      if (guestSearch?.status_code != HttpStatus.OK) {
        ErrorCode = guestSearch?.status_code;
        throw new Error(guestSearch?.message)
      }
      return guestSearch
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Search guest by firstname or lastname
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    name: 'keyword',
    type: String,
    required: false
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Purpose')
  @ApiOperation({ summary: 'Get Guest Name By Firstname or Lastname' })
  @Get('guest/search')
  async searchGuest(
    @Query('keyword') keyword: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const guest = await this.purposeService.searchGuest(keyword.charAt(0).toUpperCase(), userId);
      if (guest?.status_code != HttpStatus.OK) {
        ErrorCode = guest?.status_code;
        throw new Error(guest?.message)
      }
      return guest
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }

  }

  // Guest SignOut
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(AtGuard)
  @Public()
  @ApiTags('Purpose')
  @ApiOperation({ summary: 'Guest Sign Out' })
  @Post('guestSignOut')
  async signOut(
    @Body() guestOpDTO: guestOpDTO,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const purpose = await this.purposeService.guestSignOut(guestOpDTO, userId)
      if (purpose?.status_code != HttpStatus.CREATED) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }

  }

  // Guest ConfirmSignOut
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @UseGuards(AtGuard)
  @Public()
  @ApiTags('Purpose')
  @ApiOperation({ summary: 'Confirm Guest Sign Out' })
  @Post('guestConfirmSignOut')
  async signOutConfirm(
    @Body() guestOpDTO: guestOpDTO,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const purpose = await this.purposeService.guestConfirmSignOut(guestOpDTO, userId)
      if (purpose?.status_code != HttpStatus.CREATED) {
        ErrorCode = purpose?.status_code;
        throw new Error(purpose?.message)
      }
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }

  }

  // Filter by Guest Visit Status
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    name: 'keyword',
    enum: status,
    required: false
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Purpose')
  @ApiOperation({ summary: 'Filter Guest By Status' })
  @Get('guest/filterStatus')
  async filterGuestStatus(
    @Query('keyword') keyword: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const guest = await this.purposeService.genderFilter(keyword, userId)
      if (guest?.status_code != HttpStatus.OK) {
        ErrorCode = guest?.status_code;
        throw new Error(guest?.message)
      }
      return guest
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }


}
