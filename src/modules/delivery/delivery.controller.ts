import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, Delivery_type, Status } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import * as Util from '../../utils/index'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Delivery } from './entities/delivery.entity';
import { deliveryConfirmDTO } from 'src/guard/auth/deliveryConfirmDTO';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';

@Controller('delivery')
export class DeliveryController {
  userService: any;
  constructor(
    private readonly deliveryService: DeliveryService
    // @InjectModel(User) private readonly UserModel: typeof User,
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
    @Body() createDeliveryDto: CreateDeliveryDto
    ) {
    let ErrorCode: number
    try {
      let new_Delivery = await this.deliveryService.create(createDeliveryDto);
      if (new_Delivery?.status_code != HttpStatus.CREATED) {
        ErrorCode = new_Delivery?.status_code;
        throw new Error(new_Delivery?.message)
    } 
      return Util?.handleCreateSuccessRespone("Delivery created successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
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
    @GetCurrentUserId() userId : string
    ) {
    let ErrorCode: number
    try {
      let delivery = await this.deliveryService.findOne(deliveryId,userId);
      if (delivery?.status_code != HttpStatus.OK) {
        ErrorCode = delivery?.status_code;
        throw new Error(delivery?.message)
    } 
      return delivery;

    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
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
    @GetCurrentUserId() userId : string
    ) {
    let ErrorCode: number
    try {
      const delivery_Update = await this.deliveryService.update(deliveryId, updateDeliveryDto,userId)
      if (delivery_Update?.status_code != HttpStatus.OK) {
        ErrorCode = delivery_Update?.status_code;
        throw new Error(delivery_Update?.message)
    } 
      return delivery_Update
    } catch (error) {
      console.log(error);
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
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
    @GetCurrentUserId() userId : string
    ) {
  let ErrorCode: number
    try {

      const delivery = await this.deliveryService.remove(deliveryId,userId)
      if (delivery?.status_code != HttpStatus.OK) {
        ErrorCode = delivery?.status_code;
        throw new Error(delivery?.message)
    } 
    return delivery
    } catch (error) {
      console.log(error)
      return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)

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
async staffConfirm(
  @Body() deliveryConfirmDTO: deliveryConfirmDTO,
  @GetCurrentUserId() userId : string
  ) {
  let ErrorCode: number
  try {
    const deliveryTo = await this.deliveryService.deliveryConfirm(deliveryConfirmDTO,userId)
    if (deliveryTo?.status_code != HttpStatus.CREATED) {
      ErrorCode = deliveryTo?.status_code;
      throw new Error(deliveryTo?.message)
  } 
    if (!deliveryTo) {
      return Util?.handleFailResponse('Delivery does not exist')
    }

      return deliveryTo
  } catch (error) {
    console.log(error)
    return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
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
  @GetCurrentUserId() userId : string
) {
  let ErrorCode: number
  try {
    const deliver = await this.deliveryService.findByDateRange(startDate, endDate,userId)
    if (deliver?.status_code != HttpStatus.OK) {
      ErrorCode = deliver?.status_code;
      throw new Error(deliver?.message)
  } 
    return deliver
  } catch (error) {
    console.log(error)
    return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
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
@ApiOperation({summary: 'Filter Delivery By Type'})
@Get('delivery/filterType')
async deliveryTypeFilter (
  @Query('keyword') keyword: string,
  @GetCurrentUserId() userId : string
) {
  let ErrorCode: number
  try {
    const delivery = await this.deliveryService.deliveryType(keyword,userId)
    if (delivery?.status_code != HttpStatus.OK) {
      ErrorCode = delivery?.status_code;
      throw new Error(delivery?.message)
  } 
  return delivery
  } catch (error) {
    console.log(error)
    return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
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
@ApiOperation({summary: 'Filter Delivery By Status'})
@Get('delivery/filterStatus')
async deliveryStatusFilter (
  @Query('keyword') keyword: string,
  @GetCurrentUserId() userId : string
) {
  let ErrorCode: number
  try {
    const delivery = await this.deliveryService.deliveryStatus(keyword,userId)
    if (delivery?.status_code != HttpStatus.OK) {
      ErrorCode = delivery?.status_code;
      throw new Error(delivery?.message)
  } 
  return delivery
  } catch (error) {
    console.log(error)
    return Util?.handleRequestError(Util?.getTryCatchMsg(error),ErrorCode)
  }

}


}
