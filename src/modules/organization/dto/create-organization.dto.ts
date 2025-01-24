import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'


export class CreateOrganizationDto {


   @ApiPropertyOptional()
   readonly organizationName: string;

   @ApiPropertyOptional()
   category: string;

   @ApiPropertyOptional()
   number_of_branches: number;

   @ApiPropertyOptional()
   location: string;

   @ApiPropertyOptional()
   readonly organization_phonenumber: string;

   @ApiPropertyOptional()
   readonly fullName: string;

   @ApiPropertyOptional()
  readonly email: string;

   @ApiPropertyOptional()
   readonly phoneNumber: string;

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
 