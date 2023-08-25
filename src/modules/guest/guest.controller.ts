import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as Util from '../../utils/index'
import { guestLoginDTO } from 'src/guard/auth/guestLoginDTO';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard } from 'src/common/guards';

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
  @UseGuards(AtGuard)
  @ApiTags('Guest')
  @ApiOperation({summary:'Get All Guest'})
  @Get('getAllGuest')
  async findAll() {
    return this.guestService.findAll();
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
  async signIn (@Body() guestloginDTO: guestLoginDTO){
    const guest = this.guestService.guestSignIn(guestloginDTO)
    if (!guest) {
      throw new HttpException('Guest does not exist',HttpStatus.NOT_FOUND)
    } else {
      return guest
    }
  }
}
