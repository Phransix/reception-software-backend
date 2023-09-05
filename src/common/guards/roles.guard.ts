
// import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException, forwardRef } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { Observable, map} from "rxjs";
// import { User } from "src/modules/users/entities/user.entity";

// import { UsersService } from "src/modules/users/users.service";



// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(
//         private reflector: Reflector,

//         @Inject(forwardRef(() => UsersService))
//         private userService: UsersService
//     ) { }


//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//           const roles = this.reflector.get<string[]>('roles', context.getHandler());
//           if (!roles) {
//             return true; // No roles are defined, allow access
//           }
      
//           const request = context.switchToHttp().getRequest();
//           const user = request.user; // Make sure user object is correctly set
      
//           if (!user || !user.role) {
//             throw new UnauthorizedException('User role is missing');
//           }
      
//           // Check if the user's role matches one of the allowed roles
//           const hasRole = roles.some((role) => role === user.roles);
//           if (!hasRole) {
//             throw new ForbiddenException('Access denied');
//           }
      
//           return true;
//         }

// }



// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { Observable } from "rxjs";



// @Injectable()
// export class RolesGuard implements CanActivate{
//   constructor (private reflector: Reflector){}

//   matchRoles(roles: string[], userRole: string){
//     return roles.some((role) => role = userRole);
//   }

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const roles = this?.reflector.get<string[]>('rols',context.getHandler())
//     if(!roles){
//       return true
//     }
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     return this?.matchRoles(roles,user.role)
//   }

// }



import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/role/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}