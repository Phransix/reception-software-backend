import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, Delivery_type, Status } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import * as Util from '../../utils/index'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { UpdateDeliveryStatus } from './dto/updateDeliveryStatus';
import { AtGuard } from 'src/common/guards';

@Controller('delivery')
export class DeliveryController {
  userService: any;
  constructor(
    private readonly deliveryService: DeliveryService
  ) { }

  // Create Delivery
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Create New Delivery' })
  @Post('createDelivery')
  async createDelivery(
    @Body() createDeliveryDto: CreateDeliveryDto,
    @GetCurrentUserId() userId: string,
  ) {
    let ErrorCode: number
    try {
      let new_Delivery = await this.deliveryService.create(createDeliveryDto, userId);
      if (new_Delivery && 'status_code' in new_Delivery && new_Delivery.status_code != HttpStatus.CREATED) {
        ErrorCode = new_Delivery?.status_code;
        throw new Error(new_Delivery?.message)
      }
      return new_Delivery
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Get All Delivery
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
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Get Delivery By Pagination' })
  @Get('getAllDeliveries')
  async findAll(
    @Query('page') page?: number,
    @Query('size') size?: number,
    @GetCurrentUserId() userId?: string
  ) {
    let ErrorCode: number;
    try {
      let deliveryData = await this.deliveryService?.findAll(page, size, userId);

      if (deliveryData?.status_code != HttpStatus.OK) {
        ErrorCode = deliveryData?.status_code;
        throw new Error(deliveryData?.message);
      }
      return deliveryData;
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode);
    }
  }

  // Get Delivery by deliveryId
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Get All Delivery By deliveryId' })
  @Get(':deliveryId')
  async findOne(
    @Param('deliveryId') deliveryId: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      let delivery = await this.deliveryService.findOne(deliveryId, userId);
      if (delivery?.status_code != HttpStatus.OK) {
        ErrorCode = delivery?.status_code;
        throw new Error(delivery?.message)
      }
      return delivery;

    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Update Delivery By Id
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Update Delivery By deliveryId' })
  @Patch(':deliveryId')
  async update(
    @Param('deliveryId') deliveryId: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const delivery_Update = await this.deliveryService.update(deliveryId, updateDeliveryDto, userId)
      if (delivery_Update?.status_code != HttpStatus.OK) {
        ErrorCode = delivery_Update?.status_code;
        throw new Error(delivery_Update?.message)
      }
      return delivery_Update
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }



  // Delete Delivery By deliveryId
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Remove Delivery By deliveryId' })
  @Delete(':deliveryId')
  async remove(
    @Param('deliveryId') deliveryId: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {

      const delivery = await this.deliveryService.remove(deliveryId, userId)
      if (delivery?.status_code != HttpStatus.OK) {
        ErrorCode = delivery?.status_code;
        throw new Error(delivery?.message)
      }
      return delivery
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)

    }

  }


  // Confirm Delivery
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Confirm Delivery By Receptionist'})
  @Patch(':deliveryId/DeliveryConfirm')
  async updateStats (
    @GetCurrentUserId() userId : string,
    @Param('deliveryId') deliveryId: string,
    @Body() updateDeliveryStatus: UpdateDeliveryStatus
  ){
    let ErrorCode: number;
    try {
      const deliveryConf = await this.deliveryService.confirmDelivery(
        deliveryId,
        userId,
        updateDeliveryStatus
      );

      if (deliveryConf?.status_code != HttpStatus.OK) {
        ErrorCode = deliveryConf?.status_code;
        throw new Error(deliveryConf?.message);
      }
      return deliveryConf
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)  
    }
  }



  // Filter by Date Range
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
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Search Delivery by Custom Date Range' })
  @Get('delivery/filterDelivery')
  async findDeliveryByDateRange(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const deliver = await this.deliveryService.findByDateRange(startDate, endDate, userId)
      if (deliver?.status_code != HttpStatus.OK) {
        ErrorCode = deliver?.status_code;
        throw new Error(deliver?.message)
      }
      return deliver
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }
  }

  // Filter delivery by type
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    name: 'keyword',
    enum: Delivery_type,
    required: false
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Filter Delivery By Type' })
  @Get('delivery/filterType')
  async deliveryTypeFilter(
    @Query('keyword') keyword: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const delivery = await this.deliveryService.deliveryType(keyword, userId)
      if (delivery?.status_code != HttpStatus.OK) {
        ErrorCode = delivery?.status_code;
        throw new Error(delivery?.message)
      }
      return delivery
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }

  }

    // Filter delivery by type Count
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('defaultBearerAuth')
    @ApiQuery({
      name: 'keyword',
      enum: Delivery_type,
      required: false
    })
    @Public()
    @UseGuards(AtGuard)
    @ApiTags('Delivery')
    @ApiOperation({ summary: 'Filter Delivery By Type Count' })
    @Get('delivery/filterTypeCount')
    async deliveryTypeFilterCount(
      @Query('keyword') keyword: string,
      @GetCurrentUserId() userId: string
    ) {
      let ErrorCode: number
      try {
        const delivery = await this.deliveryService.deliveryTypeCount(keyword, userId)
        if (delivery?.status_code != HttpStatus.OK) {
          ErrorCode = delivery?.status_code;
          throw new Error(delivery?.message)
        }
        return delivery
      } catch (error) {
        console.log(error)
        return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
      }
  
    }

  // Filter delivery by status
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiQuery({
    name: 'keyword',
    enum: Status,
    required: false
  })
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Delivery')
  @ApiOperation({ summary: 'Filter Delivery By Status' })
  @Get('delivery/filterStatus')
  async deliveryStatusFilter(
    @Query('keyword') keyword: string,
    @GetCurrentUserId() userId: string
  ) {
    let ErrorCode: number
    try {
      const delivery = await this.deliveryService.deliveryStatus(keyword, userId)
      if (delivery?.status_code != HttpStatus.OK) {
        ErrorCode = delivery?.status_code;
        throw new Error(delivery?.message)
      }
      return delivery
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
    }

  }

    // Filter delivery by status Count
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('defaultBearerAuth')
    @ApiQuery({
      name: 'keyword',
      enum: Status,
      required: false
    })
    @Public()
    @UseGuards(AtGuard)
    @ApiTags('Delivery')
    @ApiOperation({ summary: 'Filter Delivery By Status Count' })
    @Get('delivery/filterStatusCount')
    async deliveryStatusFilterCount(
      @Query('keyword') keyword: string,
      @GetCurrentUserId() userId: string
    ) {
      let ErrorCode: number
      try {
        const delivery = await this.deliveryService.deliveryStatusCount(keyword, userId)
        if (delivery?.status_code != HttpStatus.OK) {
          ErrorCode = delivery?.status_code;
          throw new Error(delivery?.message)
        }
        return delivery
      } catch (error) {
        console.log(error)
        return Util?.handleRequestError(Util?.getTryCatchMsg(error), ErrorCode)
      }
  
    }

}
