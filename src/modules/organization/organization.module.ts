import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import { BullModule } from '@nestjs/bull';
import { EmailService } from 'src/helper/EmailHelper';
import { EmailProcessor } from 'src/Processor/email.processor';
import { User } from '../users/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { AuthService } from 'src/guard/auth/auth.service';
import { PasswordService } from 'src/guard/passwordhash.service';


@Module({
  imports: [
    SequelizeModule.forFeature([Organization,User,Role,]),
    BullModule.registerQueue({name:'emailVerification'})
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService,EmailService,EmailProcessor,PasswordService,AuthService]
})
export class OrganizationModule {}
