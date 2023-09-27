import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'
import { Role } from 'src/modules/role/role.enum';


export class CreateUserDto {
    
    @ApiProperty({
        description: 'The Id of the Organization',
        example: 'a036ad92-bccf-405a-8876-6fd7f6bd1514'
    })
    @IsNotEmpty()
    readonly organizationId: string;

    @ApiProperty({
        description: 'The Name of the role',
        example: 'Receptionist'
    })
    // @IsNotEmpty()
    readonly roleName: Role
 
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
    @Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/, {
        message: 'Invalid Format, must be a valid email with the .com',
     })
    readonly email: string;

    @ApiProperty({
        description: 'The phonenumber of the User/Customer',
        example: '************'
    })
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    readonly phoneNumber: string;

  
    @ApiProperty({
        description: 'The profile imgae of the User/Receptionist',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    })
    readonly profilePhoto: string;
     

    @ApiProperty({
        description: 'The password of the User/Customer',
        example: '*****'
    })
    // @IsNotEmpty()
    @MinLength(8)
    readonly password: string
    
}
