import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateDeliveryStatus {
    @IsNotEmpty()
    @ApiProperty({
        description: 'The name of the receipient',
        example: 'Kofi Amponsah'
    })
    readonly receipientName: string

    @ApiProperty({
        description: 'The name of the picker',
        example: 'Kofi Amponsah'
    })
    readonly deliveryPicker: string
}