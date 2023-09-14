import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Guest } from './entities/guest.entity';
import { Purpose } from '../purpose/entities/purpose.entity';

@Module({
  imports: [SequelizeModule.forFeature([Guest,Purpose])],
  controllers: [GuestController],
  providers: [GuestService]
})
export class GuestModule {}
