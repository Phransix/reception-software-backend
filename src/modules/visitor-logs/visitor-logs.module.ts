import { Module } from '@nestjs/common';
import { VisitorLogsService } from './visitor-logs.service';
import { VisitorLogsController } from './visitor-logs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Purpose } from '../purpose/entities/purpose.entity';
import { Guest } from '../guest/entities/guest.entity';
import { VisitorLog } from './entities/visitor-log.entity';

@Module({
  imports: [SequelizeModule.forFeature([Organization,User,Purpose,Guest,VisitorLog])],
  controllers: [VisitorLogsController],
  providers: [VisitorLogsService]
})
export class VisitorLogsModule {}
