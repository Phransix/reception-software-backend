
import { SetMetadata } from "@nestjs/common";
import { Role } from "../../modules/role/role.enum";


export const ROLES_KEY = 'roles';
export const Roles = (...roleName: Role[]) => SetMetadata(ROLES_KEY, roleName)





// import { SetMetadata } from '@nestjs/common';

// export const Roles = (...args: string[]) => SetMetadata('roles', args);