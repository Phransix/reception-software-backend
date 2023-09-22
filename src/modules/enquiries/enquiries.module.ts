import { Module } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { EnquiriesController } from './enquiries.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Enquiry } from './entities/enquiry.entity';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports : [SequelizeModule.forFeature([Enquiry,Organization,User])],
  controllers: [EnquiriesController],
  providers: [EnquiriesService]
})
export class EnquiriesModule {}
