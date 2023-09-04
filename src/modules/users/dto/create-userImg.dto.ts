import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";



export class CreateUserImgDto {


    @ApiProperty({
        description: 'The profile photo of the User/Customer',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    })
    @IsNotEmpty()
    @Matches(  /^data:([A-Za-z-+\/]+);base64,(.+)$/, {
        message: 'Invalid Format, must be in base64 image',
     })
    readonly profilePhoto: string;
     


}