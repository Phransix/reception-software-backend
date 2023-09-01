import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
// import { Food } from '../food/entities/food.entity';
// import { Unit } from '../unit/entities/unit.entity';

@Module({
  imports: [SequelizeModule.forFeature([Delivery])],
  controllers: [DeliveryController],
  providers: [DeliveryService]
})
export class DeliveryModule {}
