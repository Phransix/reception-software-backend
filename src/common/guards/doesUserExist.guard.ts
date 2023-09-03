import { Injectable,CanActivate, ExecutionContext, ForbiddenException, } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/modules/users/users.service";





@Injectable()
export class DoesUserExist implements CanActivate{
    constructor (private readonly usersService: UsersService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }


    async validateRequest(request){
        const {email,phoneNumber} = request.body


        const existingUserEmail = await this.usersService.findOneByEmail(email);
        if (existingUserEmail) {
            throw new ForbiddenException('This Email already exists');
            
        }

        const existingUserPhoneNumber = await this.usersService.findOneByPhoneNumber(phoneNumber);
        if (existingUserPhoneNumber) {
            throw new ForbiddenException('This PhoneNumber already exists');
            
        }



        return true
    }


}