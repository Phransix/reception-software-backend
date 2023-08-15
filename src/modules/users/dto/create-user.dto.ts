import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'


export class CreateUserDto {
    
    @IsNotEmpty()
    readonly organization_Id: string;
 
    @IsNotEmpty()
    readonly fullname: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phoneNumber: string;

    readonly password: string
    
}
