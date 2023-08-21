import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordService } from '../passwordhash.service';


@Injectable()
export class AuthService {
  
  constructor (private readonly passwordService: PasswordService){}


 async verifypassword(plainPassword: string, hashedPassword: string): Promise<boolean>{
  return this.passwordService.comparePasswords(plainPassword,hashedPassword)
 }

}