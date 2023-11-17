import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class deliveryConfirmDTO {
    @ApiProperty({
        description: 'The name of the receipient',
        example: 'Kingsley'
    })
    // @IsString()
    @IsNotEmpty()
    receipientName: string
}