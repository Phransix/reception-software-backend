import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateVisitlogDto {


    @ApiProperty({
        description: 'The Id of the visitlog',
        example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    })
    @IsNotEmpty()
    readonly visitlogId: string

    @ApiProperty({
        description: 'The Id of the organization',
        example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    })
    @IsNotEmpty()
    readonly organizationId: string

    @ApiProperty({
        description: 'The Id of the purpose',
        example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    })
    @IsNotEmpty()
    readonly purposeId: string
    
}