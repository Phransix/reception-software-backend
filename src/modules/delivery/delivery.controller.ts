import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import * as Util from '../../utils/index'

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('createDelivery')
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    try {
      let new_Delivery = this.deliveryService.create(createDeliveryDto);
      return new_Delivery;
    } catch (error) {
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @Get()
  async findAll() {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    // return this.deliveryService.findOne(+id);
    try {
      const delivery = await this.deliveryService.findOne(id);
      return delivery;
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    // return this.deliveryService.update(+id, updateDeliveryDto);
    try {
      const delivery_Update = this.deliveryService.update(id,updateDeliveryDto)
      return delivery_Update
    } catch (error) {
      console.log(error);
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(+id);
  }
}
