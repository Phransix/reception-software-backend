import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMobilePhone, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, isNotEmpty } from "class-validator";

export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

export enum status {
    SIGNIN = 'Signed In',
    SIGNOUT = 'Signed Out'
}

export enum GuestState {
    REGISTERED = 'registered',
    PURPOSECREATED = 'purposeCreated'
}



export class CreateGuestDto {
    static createdAt(createdAt: any) {
      throw new Error('Method not implemented.');
    }

    @ApiProperty({
        description: 'The Id of the Organization',
        example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    })
    @IsNotEmpty()
    readonly organizationId: string

    @ApiProperty({
        description: 'The firstname of the guest',
        example: 'Francis'
    })
    @IsNotEmpty()
    @IsString()
    readonly firstName: string

    @ApiProperty({
        description: 'The lastname of the guest',
        example: 'Ansah'
    })
    @IsNotEmpty()
    @IsString()
    readonly lastName: string


    @ApiProperty({
        description: 'The gender of the guest',
        example: 'male'
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(Gender,{
        message: 'Choose only one, male or female'
    })
    readonly gender : string

    @ApiProperty({
        description: "The country code of the phone number",
        example: '+233'
    })
    @IsNotEmpty()
    readonly countryCode: string

    @ApiProperty({
        description: "The phone number of the guest",
        example: '546987415'
    })
    
    @IsNotEmpty()
    @IsMobilePhone()
    readonly phoneNumber: string

}
