import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import * as Util from '../../utils/index'
import { ApiTags } from '@nestjs/swagger';
import { PaginateQuery, PaginateQueryInterface } from 'nestjs-sequelize-paginate';

@Controller('delivery')
export class DeliveryController {
  userService: any;
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
    return this.deliveryService.findAll();
  }

  // @ApiTags('Delivery')
  // @Get()
  // async getUsers(@Res() res: Response, @PaginateQuery('all') paginateQuery: PaginateQueryInterface){
  //   const data = await this.userService.findAll(paginateQuery)
  //   res.status(HttpStatus.OK).send(data)
  // }

  @ApiTags('Delivery')
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
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(+id);
  }
}
