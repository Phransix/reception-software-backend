import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DepartmentService } from 'src/modules/department/department.service';

@Injectable()
export class DoesDeptExist implements CanActivate {
  constructor(private readonly deptService: DepartmentService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request) {
    const { departmentName, e } = request.body;

    const existingDepartmentName =
      await this.deptService.findOneByDepartmentName(departmentName);
    if (existingDepartmentName) {
      throw new ForbiddenException('This department name already exists');
    }

    return true;
  }
}
