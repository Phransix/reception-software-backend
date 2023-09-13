import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto, Gender, status } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import * as Util from '../../utils/index'
import { guestOpDTO } from 'src/guard/auth/guestOpDTO';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { Guest } from './entities/guest.entity';
import { DoesGuestExist } from '../../common/guards/doesGuestExist.guard'


@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) { }

  @ApiTags('Guest')
  @Public()
  @UseGuards(DoesGuestExist)
  @ApiOperation({ summary: 'Create New Guest' })
  @Post('createGuest')
  async create(@Body() createGuestDto: CreateGuestDto) {
    let ErrorCode: number
    try {
      let guest = await this.guestService.create(createGuestDto);
      if (guest?.status_code != HttpStatus.CREATED) {
        ErrorCode = guest?.status_code;
        throw new Error(guest?.message)
      }
      return guest;
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }


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
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Get Guest By Pagination' })
  @Get('getAllGuest')
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage)
        return Util?.handleErrorRespone("Guest current page cannot be negative");

      const { limit, offset } = Util.getPagination(page, size)

      const guest = await Guest.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      });

      if (!guest || guest.count === 0) {
        return Util?.handleFailResponse('No matching data found.');
      }

      const response = Util.getPagingData(guest, page, limit)
      console.log(response)
      let newOne = { ...response }
      return Util?.handleSuccessRespone(newOne, "Guest Data retrieved succesfully")


    } catch (error) {
      console.log(error)
      return Util?.getTryCatchMsg(error)
    }

  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Get Guest By guestId' })
  @Get(':guestId')
  async findOne(@Param('guestId') guestId: string) {
    let ErrorCode: number
    try {
      let guest = await this.guestService.findOne(guestId);
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Update Guest By guestId' })
  @Patch(':guestId')
  async update(@Param('guestId') guestId: string, @Body() updateGuestDto: UpdateGuestDto) {
    let ErrorCode: number
    try {
      const guest = await this.guestService.update(guestId, updateGuestDto)
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Remove Guest By guestId' })
  @Delete(':guestId')
  async remove(@Param('guestId') guestId: string) {
    let ErrorCode: number
    try {

      const guest = await this.guestService.remove(guestId)
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


  @Public()
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Guest Sign In' })
  @Post('guestSignIn')
  async signIn(@Body() guestOpDTO: guestOpDTO) {
    let ErrorCode: number
    try {
      const guest = await this.guestService.guestSignIn(guestOpDTO)
      if (guest?.status_code != HttpStatus.OK) {
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


  @Public()
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Guest Sign Out' })
  @Post('guestSignOut')
  async signOut(@Body() guestOpDTO: guestOpDTO) {
    let ErrorCode: number
    try {
      const guest = await this.guestService.guestSignOut(guestOpDTO)
      if (guest?.status_code != HttpStatus.OK) {
        ErrorCode = guest?.status_code;
        throw new Error(guest?.message)
      }
      if (!guest) {
        throw new HttpException('Guest does not exist', HttpStatus.NOT_FOUND)
      } else {
        return guest
      }
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }

  }

  // Search Guest by Firstnames
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    name: 'keyword',
    type: String,
    required: false
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Get Guest Name By Firstname Search' })
  @Get('guest/search')
  async searchGuest(@Query('keyword') keyword: string) {
    let ErrorCode: number
    try {
      const guest = await this.guestService.searchGuest(keyword.charAt(0).toUpperCase());
      // if (guest?.status_code != HttpStatus.OK) {
      //   ErrorCode = guest?.status_code;
      //   throw new Error(guest?.message)
      // }
      return guest
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
    @Query('endDate') endDate: Date
  ) {
    let ErrorCode: number
    try {
      const guestSearch = await this.guestService.customGuestSearch(startDate, endDate)
      // if (guestSearch?.status_code != HttpStatus.OK) {
      //   ErrorCode = guestSearch?.status_code;
      //   throw new Error(guestSearch?.message)
      // }
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
    @Query('keyword') keyword: string
  ) {
    let ErrorCode: number
    try {
      return this.guestService.genderFilter(keyword)
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }


  // Filter Guest by organization
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Filter Guest by OrganizationId' })
  @Get('guest/filterOrgGuest')
  async orgGuest(
    @Query('keyword') keyword: string,
  ) {
    let ErrorCode: number
    try {

      return this.guestService.orgGuestFilter(keyword)
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
  @ApiTags('Guest')
  @ApiOperation({ summary: 'Filter Guest By Status' })
  @Get('guest/filterStatus')
  async filterGuestStatus(
    @Query('keyword') keyword: string
  ) {
    let ErrorCode: number
    try {
      return this.guestService.guestVisitStatus(keyword)
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }


}
