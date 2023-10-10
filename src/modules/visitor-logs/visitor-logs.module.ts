import { Module } from '@nestjs/common';
import { VisitorLogsService } from './visitor-logs.service';
import { VisitorLogsController } from './visitor-logs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Organization,User])],
  controllers: [VisitorLogsController],
  providers: [VisitorLogsService]
})
export class VisitorLogsModule {}
