import { Module } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { EnquiriesController } from './enquiries.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Enquiry } from './entities/enquiry.entity';

@Module({
  imports : [SequelizeModule.forFeature([Enquiry])],
  controllers: [EnquiriesController],
  providers: [EnquiriesService]
})
export class EnquiriesModule {}
