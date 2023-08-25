import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/interface';
import fs = require('fs');
import path = require('path');

// const JWT_PUBLIC_KEY = join(__dirname + '../../../../jwtRS256.key.pub')
// const JWT_PRIVATE_KEY = join(__dirname + '../../../../jwtRS256.key')




@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
       secretOrKey: config.get<string>('AT_SECRET'),
     // secretOrKey:JWT_PUBLIC_KEY,
      algorithms: ['HS256'],
    });
  }

  // async validate(payload: any) {
  //   const { sub: userId, email, scopes: roles } = payload;
  //   return {
  //     id: userId,
  //     email,
  //     roles,
  //   };
  // }
  
  validate(payload: JwtPayload) {
    // const { sub: userId, email, scopes: roles } = payload;
    return payload;
  }
}