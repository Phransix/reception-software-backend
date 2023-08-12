import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
export class CreateVisitorDto {
        
    @IsString()
    @IsNotEmpty()
    readonly name: string

    @IsString()
    @IsNotEmpty()
    readonly purpose: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string


    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phonenumber: string

    @IsNotEmpty()
    @IsDateString()
    readonly date: string

    
    @IsNotEmpty()
    readonly status: string

}
