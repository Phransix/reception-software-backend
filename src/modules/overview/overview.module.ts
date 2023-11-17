import { Module } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { Guest } from '../guest/entities/guest.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { Enquiry } from '../enquiries/entities/enquiry.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { Purpose } from '../purpose/entities/purpose.entity';

@Module({
  imports: [SequelizeModule.forFeature([Guest,Delivery,Enquiry,Purpose,User,Organization])],
  controllers: [OverviewController],
  providers: [OverviewService]
})
export class OverviewModule {}
