import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty ,Matches, MinLength} from "class-validator";


export class LogOutDTO {

    
    @ApiProperty({
        description: 'The password of the User/Customer',
        example: '*****'
    })
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}