import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';



@Module({
 
  imports : [ 
    SequelizeModule.forFeature([User,Role,Organization]),
    UsersModule,PassportModule
],
  providers: [AuthService,UsersService,LocalStrategy]
})
export class AuthModule {}
