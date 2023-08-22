import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'


export class CreateOrganizationDto {


   @ApiProperty({
      description: 'The Name of the User',
      example: 'Kofi'
   })

   @IsString()
   @IsNotEmpty()
   readonly fullName: string;

  

   @ApiProperty({
      description: 'The Name of the Organization',
      example: 'TechO'
   })

   @IsString()
   @IsNotEmpty()
    organizationName: string;

   @ApiProperty({
      description: 'The email of the Organization',
      example: 'kemi@gmail.com'
   })
   @IsNotEmpty()
   @IsEmail()
   @Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/, {
      message: 'Invalid Format, must be a valid email with the .com',
   })
   email: string;


   @ApiProperty({
      description: 'The phoneNumber of the Organization',
      example: '0244454587'
   })
   @IsNotEmpty()
   @MaxLength(10)
   @MinLength(10)
   readonly phoneNumber: string;

//    @ApiProperty({
//       description: 'The profilePhoto of the User/Customer',
//       example: '"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="'
//   })
  
  readonly profilePhoto: string;

   readonly isVerified: boolean

   readonly deletedAt: Date

}

export class VerifyEmailDto {    
   @IsNotEmpty()
   @ApiProperty()
   token: string;

 }


 export class ForgotPasswordDto {
   @IsNotEmpty()
   @ApiProperty()
   @IsEmail()
   email: string;
 }
 
 export class ResetPasswordDto {
   @IsNotEmpty()
   @ApiProperty()
   password: string;
 }
 