import { Module } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { Guest } from '../guest/entities/guest.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { Enquiry } from '../enquiries/entities/enquiry.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Guest,Delivery,Enquiry])],
  controllers: [OverviewController],
  providers: [OverviewService]
})
export class OverviewModule {}
