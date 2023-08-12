import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'


export class  CreateOrganizationDto {
 @ApiProperty({
    description:'The Name of the Organization',
    example: 'Kofi'
 })

    @IsString()
   @IsNotEmpty() 
  readonly organization_Name: string;

 @ApiProperty({
    description:'The email of the Organization',
    example: 'kemi@gmail.com'
 })
@IsNotEmpty()
@IsEmail()
@Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/,{
    message: 'Invalid Format, must be a valid email with the .com',
})
 email: string;


 @ApiProperty({
    description:'The phoneNumber of the Organization',
    example: '0244454587'
 })
@IsNotEmpty()
@MaxLength(10)
@MinLength(10)
readonly phoneNumber: string

}

