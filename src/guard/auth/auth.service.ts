import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
// import { UsersModule } from 'src/modules/users/users.module'
// import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  // constructor(private userModule: UsersModule) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await User.findOne({where:{email}});
    if (user && await bcrypt.compare(password, user?.password)) {
      return user;
    }
    return null;
  }
}