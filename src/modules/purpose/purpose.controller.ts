import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { PurposeService } from './purpose.service';
import { CreatePurposeDto, visitPurpose } from './dto/create-purpose.dto';
import { UpdatePurposeDto } from './dto/update-purpose.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import * as Util from '../../utils/index'
import { AuthGuard } from '@nestjs/passport';
import { Purpose } from './entities/purpose.entity';
import { AtGuard } from 'src/common/guards/at.guard';
import { ENUM } from 'sequelize';

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
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage)
        return Util?.handleErrorRespone("Purpose current page cannot be negative");

      const { limit, offset } = Util.getPagination(page, size)

      const purpose = await Purpose.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      });
      const response = Util.getPagingData(purpose, page, limit)
      console.log(response)
      let newOne = { ...response }
      return Util?.handleSuccessRespone(newOne, "Purpose retrieved succesfully")


    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Purpose retrieval failed")
    }

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
    try {
      return this.purposeService.guestPurpose(keyword);
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Purpose Filter should not be null')
    }
  }
}
