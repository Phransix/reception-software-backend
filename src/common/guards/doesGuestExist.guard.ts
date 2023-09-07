import { Injectable,CanActivate, ExecutionContext, ForbiddenException, } from "@nestjs/common";
import { Observable } from "rxjs";
import { GuestService } from "src/modules/guest/guest.service";





@Injectable()
export class DoesGuestExist implements CanActivate{
    constructor (private readonly guestService: GuestService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }


    async validateRequest(request){
        const {phoneNumber} = request.body

        const existingUserPhoneNumber = await this.guestService.findOneByPhoneNumber(phoneNumber);
        if (existingUserPhoneNumber) {
            throw new ForbiddenException('This PhoneNumber already exists');
            
        }

        return true
    }


}