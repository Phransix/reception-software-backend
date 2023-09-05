import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum visitPurpose {
    PERSONAL = 'personal',
    OFFICIAL = 'official',
}

export class CreatePurposeDto {

    @ApiProperty({
        description: 'The Id of the guest',
        example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    })
    @IsNotEmpty()
    readonly guestId: string

    @ApiProperty({
        description: 'The Id of the Organization',
        example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    })
    @IsNotEmpty()
    readonly organizationId: string

    @ApiProperty({
        description: "The purpose of the visit",
        example: 'personal'
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(visitPurpose,{
        message: 'state the purpose'
    })
    readonly purpose: string;

    @ApiProperty({
        description: 'The Id of the department',
        example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    })
    @IsNotEmpty()
    readonly departmentId: string

    @ApiProperty({
        description: 'The Id of the staff',
        example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    })
    @IsNotEmpty()
    readonly staffId: string
}
