import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

enum Purpose {
    OFFICAIL = 'Official',
    PERSONAL = 'Personal',
    PARTNERSHIP= 'Partnership',
    LEGAL = 'Legal',
    CAREER = 'Career',
    SALES = 'Sales',
    COMPLAINTS = 'Complaints',
    PAYMENTS = 'Payments',
    INVESTMENTS = 'Investments',
    EVENTS = 'Events'
};


export class CreateEnquiryDto {

    @ApiProperty({
        description: 'The Id of the Organization',
        example: 'a036ad92-bccf-405a-8876-6fd7f6bd1514'
    })
    @IsNotEmpty()
    readonly organizationId: string;

    @ApiProperty({
        description: 'The Name of the Person',
        example: 'Nana Kwame'
    })
    @IsString()
    @IsNotEmpty()
    readonly enquirerFullName: string;

    @ApiProperty({
        description: 'The email of the Person ',
        example: 'kemi@gmail.com'
    })
    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/, {
        message: 'Invalid Format, must be a valid email with the @ and .com',
    })
    readonly email: string;

    @ApiProperty({
        description: 'The phoneNumber of the Person',
        example: '0244454587'
    })
    @IsNotEmpty()
    @MaxLength(10)
    @MinLength(10)
    readonly phoneNumber: string;

    @ApiProperty({
        description: 'Purpose of the enquiry',
        example: 'Official'
    })
    @IsNotEmpty()
    @IsEnum(Purpose, {
        message: 'Purpose must be an Official, Personal,Partnership,Legal,Career,Sales,Complaints,Payments,Investments,Events '
     })
    readonly purpose: string;


}


