import { Module } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { DesignationController } from './designation.controller';
import { User } from '../users/entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Designation } from './entities/designation.entity';
import { Organization } from '../organization/entities/organization.entity';


@Module({
  imports: [ SequelizeModule.forFeature([Designation,Organization ,User])],
  controllers: [DesignationController],
  providers: [DesignationService]
})
export class DesignationModule {}
