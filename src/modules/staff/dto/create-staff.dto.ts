

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'

enum Title {
    MR = 'Mr',
    MRS = 'Mrs',
    DR = 'Dr',
    PROF = 'Prof'
}

export class CreateStaffDto {

  
    @ApiProperty({
        description: 'The Id of the Organization',
        example: 'a036ad92-bccf-405a-8876-6fd7f6bd1514'
    })
    @IsNotEmpty()
    readonly organizationId: string;

    @ApiProperty({
        description: 'The organizationName of the Staff',
        example: 'Kemiqals And Sons '
    })
    @IsNotEmpty()
    readonly organizationName: string;

    @ApiProperty({
        description: 'The Id of the Department',
        example: 'a036ad92-bccf-405a-8876-6fd7f6bd1514'
    })
    @IsNotEmpty()
    readonly departmentId: string;


    @ApiProperty({
        description: 'The departmentName of the Staff',
        example: 'IT Department'
    })
    @IsNotEmpty()
    readonly departmentName: string;


    @ApiProperty({
        description: 'The Title of the Staff',
        example: 'Mr'
    })
    @IsEnum(Title,{
        message: 'Title must be Mr, Mrs, Dr, Prof '
    })
    readonly title: string;
 
    @ApiProperty({
        description: 'The Fullname of the Staff',
        example: 'Kingsley Amoah'
    })
    @IsNotEmpty()
    readonly fullName: string;

   
    @ApiProperty({
        description: 'The email of the Staff',
        example: 'ampong@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/, {
        message: 'Invalid Format, must be a valid email with the .com',
     })
    readonly email: string;

    @ApiProperty({
        description: 'The phonenumber of the Staff',
        example: '************'
    })
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phoneNumber: string;

    // @ApiProperty({
    //     description: 'The gender type of the Staff',
    //     example: 'male'
    // })
    // @IsNotEmpty()
    // readonly gender: string;


    @ApiProperty({
        description: 'The role of the Staff',
        example: 'Manager'
    })
    @IsNotEmpty()
    readonly role: string;

  
    @ApiProperty({
        description: 'The profile photo of the Staff',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    })
    readonly profilePhoto: string;
     

  
    
}
