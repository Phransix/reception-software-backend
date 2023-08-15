import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';

@Module({
  imports: [SequelizeModule.forFeature([Delivery])],
  controllers: [DeliveryController],
  providers: [DeliveryService]
})
export class DeliveryModule {}
