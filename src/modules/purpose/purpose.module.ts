import { Module } from '@nestjs/common';
import { PurposeService } from './purpose.service';
import { PurposeController } from './purpose.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Purpose } from './entities/purpose.entity';

@Module({
  imports: [SequelizeModule.forFeature([Purpose])],
  controllers: [PurposeController],
  providers: [PurposeService]
})
export class PurposeModule {}
