import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,MaxLength, MinLength } from "class-validator";

export class guestOpDTO {
    @ApiProperty({
        description: "The phone number of the guest",
        example: '0546987415'
    })
    @IsNotEmpty()
    @MaxLength(10)
    @MinLength(10)
    readonly phoneNumber: string
}