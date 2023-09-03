import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,MaxLength, MinLength } from "class-validator";

export class guestOpDTO {

    @ApiProperty({
        description: "The country code of the phone number",
        example: '+233'
    })
    @IsNotEmpty()
    @MaxLength(4)
    @MinLength(4)
    readonly countryCode: string

    @ApiProperty({
        description: "The phone number of the guest",
        example: '546987415'
    })
    @IsNotEmpty()
    @MaxLength(9)
    @MinLength(9)
    readonly phoneNumber: string
}