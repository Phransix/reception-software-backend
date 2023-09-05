import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import * as Util from '../../utils/index'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Delivery } from './entities/delivery.entity';
import { deliveryConfirmDTO } from 'src/guard/auth/deliveryConfirmDTO';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';


@Controller('delivery')
export class DeliveryController {
  userService: any;
  constructor(private readonly deliveryService: DeliveryService) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Create New Delivery' })
  @Post('createDelivery')
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    try {
      let new_Delivery = await Delivery.create(createDeliveryDto);
      return new_Delivery;
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Delivery registration failed")
    }
  }


  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('defaultBearerAuth')
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
  // @ApiQuery({
  //   name: "length",
  //   type: Number,
  //   required: false
  // })
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Get Delivery By Pagination' })
  @Get('getAllDeliveries')
  async findAll(
    @Query('page') page?: number,
    @Query('size') size?: number,
    // @Query('length') length?: number
  ) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage)
        return Util?.handleErrorRespone("Delivery current page cannot be negative");

      const { limit, offset } = Util.getPagination(page, size)

      const delivery = await Delivery.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      });
      const response = Util.getPagingData(delivery, page, limit)
      console.log(response)
      // return this.deliveryService.findAll();
      let newOne = { ...delivery }
      return Util?.handleSuccessRespone(newOne, "Delivery retrieved succesfully")


    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Delivery retrieval failed")
    }

  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Get All Delivery By Id' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      let delivery = await this.deliveryService.findOne(id);
      return delivery;

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse("Delivery retrieval failed")
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Update Delivery By Id' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    try {
      const delivery_Update = this.deliveryService.update(id, updateDeliveryDto)
      return delivery_Update
    } catch (error) {
      console.log(error);
      return Util?.handleFailResponse("Delivery update failed")
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Remove Delivery By Id' })
  @Delete(':id')
  async remove(@Param('id') id: number) {

    try {

      const delivery = await Delivery.findOne({ where: { id } })
      if (!delivery) {
        return Util?.handleFailResponse("Delivery data not found")
      }

      Object.assign(delivery)
      await delivery.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Delivery data deleted successfully.")


    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError("Delivery data not deleted")

    }

  }

// Delivery Confirmation
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('defaultBearerAuth')
@Public()
@UseGuards(AtGuard)
@ApiTags('Delivery')
@ApiOperation({ summary: 'Confirm Delivery By Receptionist' })
@Post('deliveryConfirmation')
async staffConfirm(@Body() deliveryConfirmDTO: deliveryConfirmDTO) {
  const deliveryTo = this.deliveryService.deliveryConfirm(deliveryConfirmDTO)
  if (!deliveryTo) {
    throw new HttpException('Staff does not exist', HttpStatus.NOT_FOUND)
  }
  else {
    return deliveryTo
    // throw new HttpException('Item Delivered to staff successfully',HttpStatus.ACCEPTED)
  }
}

// Filter by Date Range
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('defaultBearerAuth')
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
@ApiTags('Delivery')
@ApiOperation({ summary: 'Filter Delivery by Custom Date Range' })
@Get('delivery/filterDelivery')
async findDeliveryByDateRange(
  @Query('startDate') startDate: Date,
  @Query('endDate') endDate: Date,
) {
  try {
    const deliver = await this.deliveryService.findByDateRange(startDate, endDate)
    return deliver
  } catch (error) {
    console.log(error)
    return Util?.handleFailResponse("Delivery data not found")
  }
}


}
