import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'


export class CreateUserDto {

    @ApiProperty({
        description: 'The Id of the Role',
        example: '1'
    })
    @IsNotEmpty()
    readonly roleId: string
    
    @ApiProperty({
        description: 'The Id of the Organization',
        example: '1'
    })
    @IsNotEmpty()
    readonly organizationId: string;
 
    @ApiProperty({
        description: 'The fullName of the User/Customer',
        example: 'Kingsley'
    })
    @IsNotEmpty()
    readonly fullName: string;

   
    @ApiProperty({
        description: 'The email of the User/Customer',
        example: 'ampong@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        description: 'The phonenumber of the User/Customer',
        example: '************'
    })
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phoneNumber: string;

  
    
    readonly profilePhoto: string;
     

    @ApiProperty({
        description: 'The password of the User/Customer',
        example: '*****'
    })
    @IsNotEmpty()
    @MinLength(8)
    readonly password: string
    
}
