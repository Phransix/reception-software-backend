import { IsNotEmpty } from "class-validator";


export class ChangePassDTO {

    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    newPassword: string
    
    @IsNotEmpty()
    confirmNewPassword: string


}