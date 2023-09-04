
import { Injectable,CanActivate,ExecutionContext, ForbiddenException  } from '@nestjs/common'


import { Observable } from 'rxjs'
import { OrganizationService } from 'src/modules/organization/organization.service';


@Injectable()
export class DoesOrgExist implements CanActivate {
    constructor(private readonly organizationService: OrganizationService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const { organizationName, email, phoneNumber } = request.body;


         const existingOrganizationname = await this.organizationService.findOneByorganizationName(organizationName);
            if (existingOrganizationname) {
            throw new ForbiddenException ('This organization name already exists');
            
            };

          

            const existingOrganizationEmail = await this.organizationService.findOneByEmail(email);
            if (existingOrganizationEmail) {
                throw new ForbiddenException('This Email already exists');
                
            }

            const existingOrganizationPhoneNumber = await this.organizationService.findOneByPhoneNumber(phoneNumber);
            if (existingOrganizationPhoneNumber) {
                throw new ForbiddenException('This PhoneNumber already exists');
                
            }

       return true;
    }
}



        






