import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateDeliveryStatus {
    @IsNotEmpty()
    @ApiProperty({
        description: 'The name of the receipient',
        example: 'Kofi Amponsah'
    })
    readonly status: string
}