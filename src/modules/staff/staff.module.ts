import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Staff } from './entities/staff.entity';
import { staffImageUploadProfile } from 'src/helper/staffProfiles';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports : [SequelizeModule.forFeature([Staff,Organization,User])],
  controllers: [StaffController],
  providers: [StaffService,staffImageUploadProfile]
})
export class StaffModule {}
