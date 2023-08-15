// import { Strategy } from "passport-local";
// import { PassportStrategy } from "@nestjs/passport";
// import { Injectable,UnauthorizedException } from "@nestjs/common";
// import { OrganizationService } from "src/modules/organization/organization.service";
// import { UsersService } from "src/modules/users/users.service";
// // import { OrganizationService } from "src/modules/organization/organization.service";



// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy){
//     constructor(private readonly userservice: UsersService){
//         super();
//     }

//     async validate( email: string, password: string){
//         const user = await this.userservice.validateUser(email,password)

//         if(!user) throw new UnauthorizedException('Invalid User email or password')
//         return user
//     }

// }