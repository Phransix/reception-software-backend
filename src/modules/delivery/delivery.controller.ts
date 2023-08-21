import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Req, HttpException } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import * as Util from '../../utils/index'
import { ApiTags } from '@nestjs/swagger';
import { Delivery } from './entities/delivery.entity';

@Controller('delivery')
export class DeliveryController {
  userService: any;
  constructor(private readonly deliveryService: DeliveryService) {}

  @ApiTags('Delivery')
  @Post('createDelivery')
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    try {
      let new_Delivery = await Delivery.create(createDeliveryDto);
      return new_Delivery;
    } catch (error) {
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @ApiTags('Delivery')
  @Get('getAllDeliveries')
  async findAll() {
    return this.deliveryService.findAll();
  }


  // @ApiTags('Delivery')
  // @Get('getAllDeliveries')
  // async findAll(
  //   @Query('page') page: number,
  //   @Query('size') size: number,
  //   @Query('length') length: number,
  //   @Req() req: Request
  //   ) {
  //   try {
  //     let currentPage = Util.Checknegative(page);
  //   if (currentPage)
  //     return Util?.handleErrorRespone("Delivery current page cannot be negative");

  //   const {limit, offset } = Util.getPagination(page, size)

  //   const delivery = await Delivery.findAndCountAll({
  //     limit,
  //     offset,
  //     // attributes: {exclude:['createdAt','updatedAt']}
  //   });
  //   const response = Util.getPagingData(delivery,page,limit,length)
  //   console.log(response)
  //   // return this.deliveryService.findAll();
  //   return Util?.handleSuccessRespone(delivery,"Delivery retrieved succesfully")

  //   } catch (error) {
  //     console.log(error)
  //     return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
  //   }
    
  // }

  @ApiTags('Delivery')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const delivery = await this.deliveryService.findOne(id);
      return delivery;
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @ApiTags('Delivery')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    try {
      const delivery_Update = this.deliveryService.update(id,updateDeliveryDto)
      return delivery_Update
    } catch (error) {
      console.log(error);
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @ApiTags('Delivery')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(+id);
  }
}
