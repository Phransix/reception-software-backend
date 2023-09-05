import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Organization } from '../organization/entities/organization.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from 'src/stratagies';
import { AuthPassService } from 'src/guard/auth/authPass.service';
import { PasswordService } from 'src/guard/passwordhash.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { imageUploadProfile } from 'src/helper/usersProfile';
import { ResetPasswordService } from 'src/helper/ResetPassHelper';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from 'src/common/guards/roles.guard';



@Module({
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([User,Role,Organization]),
    BullModule.registerQueue({name:'resetPassword'}),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    AtStrategy,
    RtStrategy,
    AuthPassService,
    PasswordService,
    RolesGuard,
    imageUploadProfile,
    ResetPasswordService, 
     {
    provide: APP_GUARD,
    useClass: RolesGuard
   },
  ]
})
export class UsersModule {}
