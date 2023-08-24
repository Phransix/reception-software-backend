import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { result } from 'lodash';
import { LoginDTO } from 'src/guard/auth/loginDTO';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor (private usersService: UsersService){}

    // async validateUser(email: string, pass: string): Promise<any>{
    //     const user = await this.usersService.findOneByuserEmail(email);
    //     if (user && user.password === pass) {
    //         const { password, ... result } = user;
    //         return result;
    //     }
    //     return null

    // }

    async validateUser(email: string, password: string): Promise<any>{
        const user = await this.usersService.findOneByuserEmail(email);
        if(!user){
            return ('User with this email does not exist')
          }

          const IsPasswordSame = await bcrypt.compare(password,user.password)
          if(!IsPasswordSame){
            throw new UnauthorizedException('Invalid Credentials')
          }

    }


    






//     async validateUser(loginDto: LoginDTO): Promise<any>{
//           const {email,password} = loginDto
        
//           const user = await this.usersService.findOneByuserEmail(email)
//           if(!user){
//             throw new BadRequestException('User with this email does not exist')
//           }
//           const IsPasswordSame = await bcrypt.compare(password,user.password)
//           if(!IsPasswordSame){
//             throw new UnauthorizedException('Invalidsds Credentials')
//           }


// }
}
