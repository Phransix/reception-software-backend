import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto, Gender } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import * as Util from '../../utils/index'
import { guestOpDTO} from 'src/guard/auth/guestOpDTO';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';
import { Guest } from './entities/guest.entity';


@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @ApiTags('Guest')
  @Public()
  @ApiOperation({summary:'Create New Guest'})
  @Post('createGuest')
  async create(@Body() createGuestDto: CreateGuestDto) {
    try {
      let guest = await this.guestService.create(createGuestDto);
      return guest;
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Guest registration failed")
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
      const response = Util.getPagingData(guest, page, limit)
      console.log(response)
      // return this.deliveryService.findAll();
      let newOne = { ...response }
      return Util?.handleSuccessRespone(newOne, "Guest Data retrieved succesfully")


    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Guest retrieval failed")
    }

  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({summary:'Get Guest By Id'})
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      let guest = await this.guestService.findOne(id);
      return guest;

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Guest retrieval failed")
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({summary:'Update Guest By Id'})
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateGuestDto: UpdateGuestDto) {
    try {
      const guest = this.guestService.update(id,updateGuestDto)
      return guest
    } catch (error) {
      console.log(error);
      return Util?.handleFailResponse("Guest update failed")
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({summary:'Remove Guest By Id'})
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {

      const guest = this.guestService.findOne(id)
      if(!guest){
        return Util?.handleFailResponse("Guest data not found")
      }

      Object.assign(guest)
      (await guest).destroy
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError("Guest data not deleted")
      
    }
  }


  @Public()
  @ApiTags('Guest')
  @ApiOperation({summary:'Guest Sign In'})
  @Post('guestSignIn')
  async signIn (@Body() guestOpDTO: guestOpDTO){
    const guest = this.guestService.guestSignIn(guestOpDTO)
    if (!guest) {
      throw new HttpException('Guest does not exist',HttpStatus.NOT_FOUND)
    } else {
      return guest
    }
  }

  @Public()
  @ApiTags('Guest')
  @ApiOperation({summary:'Guest Sign Out'})
  @Post('guestSignOut')
  async signOut (@Body() guestOpDTO:guestOpDTO){
    const guest = this.guestService.guestSignOut(guestOpDTO)
    if (!guest) {
      throw new HttpException('Guest does not exist',HttpStatus.NOT_FOUND)
    } else {
      return guest
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
  @ApiOperation({summary:'Get Guest Name By Firstname Search'})
  @Get('guest/search')
  async searchGuest (@Query('keyword') keyword: string){
    try {
      return this.guestService.searchGuest(keyword.charAt(0).toUpperCase());
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Search should not be null")
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
@ApiOperation({ summary: 'Filter Guest by Custom Date Range' })
@Get('guest/filterGuest')
async findGuestByDateRange (
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date
  ){
try {
  const guestSearch = await this.guestService.customGuestSearch(startDate,endDate)
  return guestSearch
} catch (error) {
  console.log(error)
  return Util?.handleFailResponse("Guest Not found")
}
  }

  // Filter Guest by Gender
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Get('guest/filterGender')
  @ApiQuery({ 
    name: 'keyword',
    enum: Gender,
    required: false
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({summary:'Filter Guest Gender'})
  async guestGender (
    @Query('keyword') keyword: string
  ) {
    try {
      return this.guestService.genderFilter(keyword)
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Gender Filter should not be null")
    }
  }


}
