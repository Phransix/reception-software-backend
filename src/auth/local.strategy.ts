import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import * as bcrypt from 'bcrypt';




@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor (private authService: AuthService){
        super()
    }


    async validate(email: string, password: string): Promise<any>{
        const user = await this.authService.validateUser(email,password);
        if (!user) {
            // throw new UnauthorizedException()
            throw new BadRequestException('User with this email does not exist')
        }
        return user
    }

}
