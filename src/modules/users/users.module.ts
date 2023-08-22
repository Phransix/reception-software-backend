import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Organization } from '../organization/entities/organization.entity';

@Module({
  imports: [SequelizeModule.forFeature([User,Role,Organization])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
