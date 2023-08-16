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
        description: 'The firstname of the User/Customer',
        example: 'Kingsley'
    })
    @IsNotEmpty()
    readonly fullName: string;

    @ApiProperty({
        description: 'The lastname of the User/Customer',
        example: 'Ampong'
    })
   
    @ApiProperty({
        description: 'The email of the User/Customer',
        example: 'ampong@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        description: 'The phonenumber of the User/Customer',
        example: '0254698745'
    })
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phoneNumber: string;

    @ApiProperty({
        description: 'The password of the User/Customer',
        example: '*****'
    })
    readonly password: string
    
}
