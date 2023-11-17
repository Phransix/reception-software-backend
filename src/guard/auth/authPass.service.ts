import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordService } from '../passwordhash.service';


@Injectable()
export class AuthPassService {
  
  constructor (private readonly passwordService: PasswordService){}

 async verifypassword(password: string, hashedPassword: string): Promise<boolean>{
  return this.passwordService.comparePasswords(password,hashedPassword)
 }


}