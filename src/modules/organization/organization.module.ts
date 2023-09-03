import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import { BullModule } from '@nestjs/bull';
import { EmailService } from 'src/helper/EmailHelper';
import { EmailProcessor } from 'src/Processor/email.processor';
import { ResetPasswordService } from 'src/helper/ResetPassHelper';
import { ResetPasswordProcessor } from 'src/Processor/resetPasswordProcessor';
import { User } from '../users/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { PasswordService } from 'src/guard/passwordhash.service';
import { UsersService } from '../users/users.service';
import { AuthPassService } from 'src/guard/auth/authPass.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from 'src/stratagies';
import { defaultPaswordProcessor } from 'src/Processor/defaultPassword.processor';
import { Delivery } from '../delivery/entities/delivery.entity';
import { imageUploadProfile } from 'src/helper/usersProfile';
import { orgImageUploadProfile } from 'src/helper/organizationsProfile';


@Module({
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([Organization,User,Role]),
    BullModule.registerQueue({name:'emailVerification'},{name:'defaultPassword'},{name:'resetPassword'}),
    
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService,
    EmailService,
    EmailProcessor,
    PasswordService,
    AuthPassService,
    ResetPasswordProcessor,
    defaultPaswordProcessor,
    ResetPasswordService,
    UsersService,
    JwtService,
    AtStrategy,
    RtStrategy,
    orgImageUploadProfile,
    imageUploadProfile
   
  ]


})
export class OrganizationModule {}
