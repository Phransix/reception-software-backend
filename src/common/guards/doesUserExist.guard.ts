
import { Injectable,CanActivate,ExecutionContext, ForbiddenException  } from '@nestjs/common'
// import * as Util from '../../utils/index'

import { Observable } from 'rxjs'
// import { UsersService } from 'src/modules/users/users.service';
import { OrganizationService } from 'src/modules/organization/organization.service';


@Injectable()
export class DoesUserExist implements CanActivate {
    constructor(private readonly organizationService: OrganizationService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const { organizationName,fullname, email, phoneNumber } = request.body;


         const existingOrganizationname = await this.organizationService.findOneByorganizationName(organizationName);
            if (existingOrganizationname) {
            throw new Error ('This organization name already exists');
            // return Util.handleForbiddenExceptionResponses('Invaid email');
            };

            // const existingUsername = await this.organizationService.findOneByorganizationName(fullname);
            // if (existingUsername) {
            // throw new ForbiddenException('This User name already exists');
            // };

            const existingUserEmail = await this.organizationService.findOneByEmail(email);
            if (existingUserEmail) {
                throw new ForbiddenException('This Email already exists');
                // return Util.handleForbiddenExceptionResponses('Invaid email');
            }

            const existingUserPhoneNumber = await this.organizationService.findOneByPhoneNumber(phoneNumber);
            if (existingUserPhoneNumber) {
                throw new ForbiddenException('This PhoneNumber already exists');
                // return Util.handleForbiddenExceptionResponses('Invaid email');
            }

       return true;
    }
}



        






