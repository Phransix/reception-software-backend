

// import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
// import { CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// import { Observable } from 'rxjs';

// import { ROLES_KEY } from '../decorators/roles.decorator';
// import { Role } from 'src/modules/role/role.enum';
// import { User } from 'src/modules/users/entities/user.entity';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!requiredRoles) {
//       return true; 
//     }

//     const { user }: { user: User } = context.switchToHttp().getRequest();

//     if (!user || !user?.roleName) {
//       throw new UnauthorizedException('User role is missing');
//     }

//     const hasRequiredRole = requiredRoles.some((role) => user?.roleName?.includes(role));
    
//     if (!hasRequiredRole) {
//       throw new ForbiddenException('Access denied');
//     }

//     return true;
//   }
// }



import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { log } from 'console';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {

    // console.log(roles);
    
    return roles.some((roleName) => roleName === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
  
    
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
  

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request?.user;
    
 //   console.log(request);
   return this.matchRoles(roles, 'Admin');
  }
}