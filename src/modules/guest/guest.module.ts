import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Guest } from './entities/guest.entity';
import { Purpose } from '../purpose/entities/purpose.entity';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([Guest,Purpose,Organization,User])],
  controllers: [GuestController],
  providers: [GuestService]
})
export class GuestModule {}
