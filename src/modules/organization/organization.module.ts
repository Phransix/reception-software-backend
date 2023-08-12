import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import { BullModule } from '@nestjs/bull';
import { EmailService } from 'src/helper/EmailHelper';
import { EmailProcessor } from 'src/Processor/email.processor';


@Module({
  imports: [
    SequelizeModule.forFeature([Organization]),
    BullModule.registerQueue({name:'emailVerification'})
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService,EmailProcessor,EmailService]
})
export class OrganizationModule {}
