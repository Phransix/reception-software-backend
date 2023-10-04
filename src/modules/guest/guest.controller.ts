import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto, Gender } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import * as Util from '../../utils/index'
import { guestOpDTO } from 'src/guard/auth/guestOpDTO';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { DoesGuestExist } from '../../common/guards/doesGuestExist.guard'
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';


@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) { }

  // Create Guest
  @ApiTags('Guest')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @UseGuards(DoesGuestExist)
  @ApiOperation({ summary: 'Create New Guest' })
  @Post('createGuest')
  async create(
    @Body() createGuestDto: CreateGuestDto,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      let guest = await this.guestService.create(createGuestDto, userId);
      if (guest && 'status_code' in guest && guest.status_code != HttpStatus.CREATED) {
        ErrorCode = guest?.status_code;
        throw new Error(guest?.message)
      }
      return guest;
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }


  // Get all Guests
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
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
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Get Guest By Pagination' })
  @Get('getAllGuest')
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number;
    try {
      let guesData = await this.guestService?.findAll(page, size, userId);

      if (guesData?.status_code != HttpStatus.OK) {
        ErrorCode = guesData?.status_code;
        throw new Error(guesData?.message);
      }
      return guesData;
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }

  }

    // Get all Guests for Tablet
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('defaultBearerAuth')
    @Public()
    @UseGuards(AtGuard)
    @ApiTags('Guest')
    @ApiOperation({ summary: 'Get Guest for tablet' })
    @Get('getAllGuestTablet')
    async getAllGuestData(
      @GetCurrentUserId() userId: string
    ) {
      let ErrorCode: number;
      try {
        let guesData = await this.guestService.findAllGuest(userId);
  
        if (guesData?.status_code != HttpStatus.OK) {
          ErrorCode = guesData?.status_code;
          throw new Error(guesData?.message);
        }
        return guesData;
      } catch (error) {
        console.log(error)
        return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
      }
  
    }

// Get Guest by GuestId
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('defaultBearerAuth')
@Public()
@UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Get Guest By guestId' })
  @Get(':guestId')
  async findOne(
    @Param('guestId') guestId: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      let guest = await this.guestService.findOne(guestId, userId);
      if (guest?.status_code != HttpStatus.OK) {
        ErrorCode = guest?.status_code;
        throw new Error(guest?.message)
      }
      return guest;

    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Update Guest By GuestId
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Update Guest By guestId' })
  @Patch(':guestId')
  async update(
    @Param('guestId') guestId: string,
    @Body() updateGuestDto: UpdateGuestDto,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const guest = await this.guestService.update(guestId, updateGuestDto, userId)
      if (guest?.status_code != HttpStatus.OK) {
        ErrorCode = guest?.status_code;
        throw new Error(guest?.message)
      }
      return guest
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Delete Guest By GuestId
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Remove Guest By guestId' })
  @Delete(':guestId')
  async remove(
    @Param('guestId') guestId: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {

      const guest = await this.guestService.remove(guestId, userId)
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

  // Guest sign In
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Guest Sign In' })
  @Post('guestSignIn')
  async signIn(
    @Body() guestOpDTO: guestOpDTO,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const guest = await this.guestService.guestSignIn(guestOpDTO, userId)
      if (guest?.status_code != HttpStatus.CREATED) {
        ErrorCode = guest?.status_code;
        throw new Error(guest?.message)
      }
      if (!guest) {
        return Util?.handleFailResponse('Guest does not exist')
      } else {
        return guest
      }
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
    required: false
  })

  @ApiQuery({
    name: 'endDate',
    type: Date,
    required: false
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Search Guest by Custom Date Range' })
  @Get('guest/filterGuest')
  async findGuestByDateRange(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const guestSearch = await this.guestService.customGuestSearch(startDate, endDate,userId)
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

      // Filter Guest by Gender
      @UseGuards(AuthGuard('jwt'))
      @ApiBearerAuth('defaultBearerAuth')
      @ApiQuery({
        name: 'keyword',
        enum: Gender,
        required: false
      })
      @Public()
      @UseGuards(AtGuard)
      @ApiTags('Guest')
      @ApiOperation({ summary: 'Filter Guest Gender' })
      @Get('guest/filterGender')
      async guestGender(
        @Query('keyword') keyword: string,
        @GetCurrentUserId() userId: string
      ) {
        let ErrorCode: number
        try {
          const guest = await this.guestService.genderFilter(keyword,userId)
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
    

  // Bulk guest create
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Create Multiple Guests' })
  @Public()
  @ApiTags('Guest')
  @Post('bulkGuestCreate/create')
  async buklCreateGuest(
    @Body() data: any[],
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const modelName = 'Guest'
      const guestResults = await this.guestService.bulkGuest(modelName, data, userId)
      if (guestResults?.status_code != HttpStatus.CREATED) {
        ErrorCode = guestResults?.status_code;
        throw new Error(guestResults?.message)
      }
      return guestResults
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Bulk guest delete
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Delete Multiple Guests' })
  @Delete('bulkGuestDelete/delete')
  async bulkGuestDelete(
    whereClause: any = {},
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const modelName = 'Guest'
      const guestResults = await this.guestService.bulkGuestDelete(modelName, whereClause, userId);
      if (guestResults?.status_code != HttpStatus.CREATED) {
        ErrorCode = guestResults?.status_code;
        throw new Error(guestResults?.message)
      }
      return guestResults
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

}
