import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

enum msgStatus {
    READ = 'read',
    UNREAD = 'unread'
}

export class CreateNotificationDto {
    // @ApiProperty({
    //     description: 'The Id of the Organization',
    //     example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    // })
    // readonly organizationId: string

    // @ApiProperty({
    //     description: 'The Id of the Organization',
    //     example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    // })
    // readonly purposeId: string

    // @ApiProperty({
    //     description: 'The message of the guest',
    //     example: 'sign out'
    // })
    // readonly type: string

    // @ApiProperty({
    //     description: 'The message of the guest',
    //     example: 'Ansah'
    // })
    // readonly message: string

    @IsEnum(msgStatus)
    @ApiProperty({
        description: 'The message of the guest',
        example: 'read'
    })
    readonly status: string
}
