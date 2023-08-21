import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import * as Util from '../../utils/index'
import { ApiTags } from '@nestjs/swagger';
import { Delivery } from './entities/delivery.entity';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @ApiTags('Delivery')
  @Post('createDelivery')
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    try {
      let new_Delivery = this.deliveryService.create(createDeliveryDto);
      return new_Delivery;
    } catch (error) {
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @ApiTags('Delivery')
  @Get('getAllDeliveries')
  async findAll() {
    try {
      const allDeliveries = await this.deliveryService.findAll()
      return allDeliveries
      
    } catch (error) {
      console.log(error)
      return Util.handleTryCatchError(Util?.handleTryCatchError(error))
    }
   
  }

  @ApiTags('Delivery')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    // return this.deliveryService.findOne(+id);
    try {
      let delivery = await this.deliveryService.findOne(id);
      return delivery;

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  @ApiTags('Delivery')
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

  @ApiTags('Delivery')
  @Delete(':id')
  async remove(@Param('id') id: number) {

    try {

      const delivery = await Delivery.findOne({where:{id}})
      if(!delivery){
        return Util?.handleFailResponse("Delivery data not found")
      }

      Object.assign(delivery)
      await delivery.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Delivery data deleted successfully.")

      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError("Delivery data not deleted")
      
    }

  }
}
