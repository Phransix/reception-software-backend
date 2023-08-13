import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

enum Gender {
    OFFICAIL = 'Official',
    PERSONAL = 'personal'
};


export class CreateEnquiryDto {
    @ApiProperty({
        description: 'The Name of the Person',
        example: 'Nana Kwame'
    })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

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
    @IsEnum(Gender, {
        message: 'Purpose must be an official or personal '
     })
    readonly purpose: string;

    @ApiProperty({
        description: ' What is the enquiry about',
        example: 'Job availabilty'
    })
    @IsNotEmpty()
    readonly  enquiry_Description: string

}


