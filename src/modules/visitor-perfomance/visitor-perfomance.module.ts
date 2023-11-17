import { Module } from '@nestjs/common';
import { VisitorPerfomanceService } from './visitor-perfomance.service';
import { VisitorPerfomanceController } from './visitor-perfomance.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Guest } from '../guest/entities/guest.entity';
import { Purpose } from '../purpose/entities/purpose.entity';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';

@Module({
  imports: [SequelizeModule.forFeature([User,Organization,Guest,Purpose])],
  controllers: [VisitorPerfomanceController],
  providers: [VisitorPerfomanceService]
})
export class VisitorPerfomanceModule {}
