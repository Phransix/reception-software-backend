import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

enum Status {
    ACTIVE = 'signedIn',
    INACTIVE = 'signedOut',
}

enum purposeStatus {
    PERSONAL = 'personal',
    UNOFFICIAL = 'unofficial',
}

export class CreateVisitorDto {

    @ApiProperty({
        description: 'The Id of the Organization',
        example: 'a036ad92-bccf-405a-8876-6fd7f6bd1514'
    })
    @IsNotEmpty()
    readonly organizationId: string;

    @ApiProperty({
        description: 'The name of the Visitor',
        example: 'Kingsley'
    })
    @IsString()
    @IsNotEmpty()
    readonly visitorFullname: string;

    @ApiProperty({
        description: 'The phonenumber of the Visitor',
        example: '0254698745'
    })
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phoneNumber: string;

    @ApiProperty({
        description: "The purpose of the visit",
        example: 'personal'
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(purposeStatus,{
        message: 'state the purpose'
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
        example: 'signedIn'
    })
    @IsNotEmpty()
    @IsEnum(Status, {
        message: 'The visitor status must be either signedIn or signedOut',
    })
    readonly visitStatus: string;

    @ApiProperty({
        description: "The date and time of delivery",
        example: '2023-08-20'
    })
    @IsNotEmpty()
    @IsDateString()
    readonly date: string;

}
