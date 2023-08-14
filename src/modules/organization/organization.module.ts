import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import { BullModule } from '@nestjs/bull';
// import { EmailService } from 'src/helper/EmailHelper';
// import { EmailProcessor } from 'src/Processor/email.processor';
import { User } from '../users/entities/user.entity';


@Module({
  imports: [
    SequelizeModule.forFeature([Organization,User]),
    BullModule.registerQueue({name:'emailVerification'})
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService]
})
export class OrganizationModule {}
