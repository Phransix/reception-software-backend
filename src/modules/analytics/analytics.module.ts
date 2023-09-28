import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Delivery } from '../delivery/entities/delivery.entity';
import { Guest } from '../guest/entities/guest.entity';
import { Enquiry } from '../enquiries/entities/enquiry.entity';
import { Purpose } from '../purpose/entities/purpose.entity';
import { GuestService } from '../guest/guest.service';
import { PurposeService } from '../purpose/purpose.service';
import { DeliveryService } from '../delivery/delivery.service';
import { EnquiriesService } from '../enquiries/enquiries.service';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports:[SequelizeModule.forFeature([Delivery,Guest,Enquiry,Purpose,Organization,User])],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    GuestService,
    PurposeService,
    DeliveryService,
    EnquiriesService
  ]
})
export class AnalyticsModule {}
