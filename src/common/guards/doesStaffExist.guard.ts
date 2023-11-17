import { Injectable,CanActivate, ExecutionContext, ForbiddenException, } from "@nestjs/common";
import { Observable } from "rxjs";
import { StaffService } from "src/modules/staff/staff.service";





@Injectable()
export class DoesStaffExist implements CanActivate{
    constructor (private readonly staffService: StaffService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }


    async validateRequest(request){
        const {email,phoneNumber} = request.body


        const existingStaffEmail = await this.staffService.findOneByEmail(email);
        if (existingStaffEmail) {
            throw new ForbiddenException('This email already exists');
            
        }

        const existingStaffPhoneNumber = await this.staffService.findOneByPhoneNumber(phoneNumber);
        if (existingStaffPhoneNumber) {
            throw new ForbiddenException('This phone number already exists');
            
        }



        return true
    }


}