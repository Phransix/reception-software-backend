import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Organization } from '../organization/entities/organization.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from 'src/stratagies';



@Module({
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([User,Role,Organization])
  ],
  controllers: [UsersController],
  providers: [UsersService,JwtService,AtStrategy,RtStrategy]
})
export class UsersModule {}
