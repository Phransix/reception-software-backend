import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PurposeService } from './purpose.service';
import { CreatePurposeDto } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import * as Util from '../../utils/index'
import { AuthGuard } from '@nestjs/passport';

@Controller('purpose')
export class PurposeController {
  constructor(private readonly purposeService: PurposeService) {}

  @Public()
  @ApiTags('Purpose')
  @Public()
  @ApiOperation({summary:'Create New Purpose'})
  @Post('createPurpose')
  async create(@Body() createPurposeDto: CreatePurposeDto) {
    // return this.purposeService.create(createPurposeDto);
    try {
      const purpose = await this.purposeService.create(createPurposeDto);
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Purpose registration failed")
    }
  }

  @Public()
  @ApiTags('Purpose')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get All Purposes'})
  @Get('getAllPurpose')
  async findAll() {
    return this.purposeService.findAll();
  }

  @Public()
  @ApiTags('Purpose')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get Purpose By Id'})
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const purpose = await this.purposeService.findOne(id);
      return purpose;
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Purpose retrieval failed')
    }
  }

 @Public()
  @ApiTags('Purpose')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Purpose By Id'})
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePurposeDto: UpdatePurposeDto) {
    try {
      const purpose = this.purposeService.update(id,updatePurposeDto)
      return purpose
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Purpose data update failed")
    }
  }

  @Public()
  @ApiTags('Purpose')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Remove Purpose By Id'})
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const purpose = await this.purposeService.findOne(id);
      if (!purpose) {
        return Util?.handleFailResponse("Purpose data not found")
      }
      Object.assign(purpose)
      (await purpose).destroy()
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError("Purpose data not removed")
    }
  }
}
