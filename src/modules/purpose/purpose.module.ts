import { Module } from '@nestjs/common';
import { PurposeService } from './purpose.service';
import { PurposeController } from './purpose.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Purpose } from './entities/purpose.entity';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { Guest } from '../guest/entities/guest.entity';

@Module({
  imports: [SequelizeModule.forFeature([Purpose,User,Organization,Guest])],
  controllers: [PurposeController],
  providers: [PurposeService]
})
export class PurposeModule {}
