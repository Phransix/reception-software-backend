import { IsEmail, IsNotEmpty ,Matches} from "class-validator";


export class LoginDTO {
    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/, {
       message: 'Invalid Format, must be a valid email with the .com',
    })
    email: string;

    @IsNotEmpty()
    password:string;
}