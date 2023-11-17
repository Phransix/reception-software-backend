import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateDesignationDto {

    @ApiProperty({
        description: 'The Id of the Organization',
        example: 'a036ad92-bccf-405a-8876-6fd7f6bd1514'
    })
    @IsNotEmpty()
    readonly organizationId: string;

    @ApiProperty({
        description: 'The Id of the Department',
        example: 'a036ad92-bccf-405a-8876-6fd7f6bd1514'
    })
    @IsNotEmpty()
    readonly departmentId: string;

    @ApiProperty({
        description: 'The name of the designation',
        example: 'Developers'
    })
    @IsNotEmpty()
    readonly designation_name: string;

}
