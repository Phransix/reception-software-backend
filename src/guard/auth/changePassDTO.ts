import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";


export class ChangePassDTO {

    @ApiProperty({
        description: 'The old password of the User/Customer',
        example: '*****'
    })
    @MinLength(8)
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty({
        description: 'The new password of the User/Customer',
        example: '*****'
    })
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string
    
    @ApiProperty({
        description: 'The confirm new password of the User/Customer',
        example: '*****'
    })
    @IsNotEmpty()
    @MinLength(8)
    confirmNewPassword: string


}