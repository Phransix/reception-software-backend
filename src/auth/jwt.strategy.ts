import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.jWT_ACCESS_SECRET,
        })
    }

    async validate(payload){
        return {
            userId: payload?.userId,
            fullName: payload?.fullName,
            email: payload?.email
        }
    }

}