
// import { SetMetadata } from "@nestjs/common";
// import { Role } from "../../modules/role/role.enum";


// export const ROLES_KEY = 'roles';
// export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)



import { SetMetadata } from "@nestjs/common";
// import { UserRole } from "src/modules/role/role.enum";

export const Roles = (...args: string[]) => SetMetadata('roles', args);