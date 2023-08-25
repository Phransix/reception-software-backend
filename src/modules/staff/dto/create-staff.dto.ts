

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'


export class CreateStaffDto {

  
    @ApiProperty({
        description: 'The Id of the Organization',
        example: '1'
    })
    @IsNotEmpty()
    readonly organizationId: string;

    @ApiProperty({
        description: 'The Id of the Department',
        example: '1'
    })
    @IsNotEmpty()
    readonly departmentId: string;
 
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
    readonly email: string;

    @ApiProperty({
        description: 'The phonenumber of the Staff',
        example: '************'
    })
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phoneNumber: string;


    @ApiProperty({
        description: 'The role of the Staff',
        example: '************'
    })
    @IsNotEmpty()
    readonly role: string;

  
    
    readonly profilePhoto: string;
     

  
    
}
