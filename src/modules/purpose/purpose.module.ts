import { Module } from '@nestjs/common';
import { PurposeService } from './purpose.service';
import { PurposeController } from './purpose.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Purpose } from './entities/purpose.entity';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { Guest } from '../guest/entities/guest.entity';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Notification } from '../notification/entities/notification.entity';

@Module({
  imports: [SequelizeModule.forFeature([Purpose,User,Organization,Guest,Notification])],
  controllers: [PurposeController],
  providers: [PurposeService,ChatGateway]
})
export class PurposeModule {}
