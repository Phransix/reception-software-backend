import { IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}
export class CreateVisitorDto {


    @IsNotEmpty()
    readonly organization_Id: string;

    @IsString()
    @IsNotEmpty()
    readonly visitor: string;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phonenumber: string;

    @IsString()
    @IsNotEmpty()
    readonly purpose: string;

    @IsString()
    @IsNotEmpty()
    readonly host: string;
        
    @IsNotEmpty()
    @IsEnum(Status, {
        message: 'The visitor status must be either active or inactive',
    })
    readonly visit_Status: string;

    @IsNotEmpty()
    @IsDateString()
    readonly date: string;

}
