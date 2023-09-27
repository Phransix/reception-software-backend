import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty ,Matches, MinLength} from "class-validator";


export class LoginDTO {

    @ApiProperty({
        description: 'The email of the User/Customer',
        example: 'ampong@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    // @Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/, {
    //    message: 'Invalid Format, must be a valid email with the .com',
    // })
    email: string;


    @ApiProperty({
        description: 'The password of the User/Customer',
        example: '*****'
    })
    @IsNotEmpty()
    @MinLength(8)
    password:string;
}