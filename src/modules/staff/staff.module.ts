import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Staff } from './entities/staff.entity';
import { staffImageUploadProfile } from 'src/helper/staffProfiles';

@Module({
  imports : [SequelizeModule.forFeature([Staff])],
  controllers: [StaffController],
  providers: [StaffService,staffImageUploadProfile]
})
export class StaffModule {}
