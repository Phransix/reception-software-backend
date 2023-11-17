import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { DepartmentService } from 'src/modules/department/department.service';
import { DesignationService } from 'src/modules/designation/designation.service';
  
  @Injectable()
  export class DoesDesigtExist implements CanActivate {
    constructor(private readonly desigService: DesignationService) {}
  
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      return this.validateRequest(request);
    }
  
    async validateRequest(request) {
      const { designation_name, e } = request.body;
  
      const existingDepartmentName =
        await this.desigService.findOneByDesignationName(designation_name);
      if (existingDepartmentName) {
        throw new ForbiddenException('This designation name already exists');
      }
  
      return true;
    }
  }
  