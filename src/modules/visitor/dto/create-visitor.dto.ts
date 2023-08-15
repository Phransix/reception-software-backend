import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

enum visit_Status {
    PERSONAL = 'personal',
    UNOFFICIAL = 'unofficial'
}
export class CreateVisitorDto {

    @ApiProperty({
        description: 'The Id of the Visitor',
        example: '1'
    })
    @IsNotEmpty()
    readonly organization_Id: string;

    @ApiProperty({
        description: 'The name of the Visitor',
        example: 'Kingsley'
    })
    @IsString()
    @IsNotEmpty()
    readonly visitor: string;

    @ApiProperty({
        description: 'The phonenumber of the Visitor',
        example: '0254698745'
    })
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phonenumber: string;

    @ApiProperty({
        description: "The purpose of the visit",
        example: 'Any important detail about the visit'
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(visit_Status, {
        message: 'The purpose of visit must be either personal or unofficial',
    })
    readonly purpose: string;

    @ApiProperty({
        description: "The name of the host",
        example: 'Kwame Atoapoma'
    })
    @IsString()
    @IsNotEmpty()
    readonly host: string;
        
    @ApiProperty({
        description: "The status of the visit",
        example: 'active'
    })
    @IsNotEmpty()
    @IsEnum(Status, {
        message: 'The visitor status must be either active or inactive',
    })
    readonly visit_Status: string;

    @ApiProperty({
        description: "The date and time of delivery",
        example: '2023-08-20'
    })
    @IsNotEmpty()
    @IsDateString()
    readonly date: string;

}
