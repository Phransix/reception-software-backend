import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Matches, IsEmail} from "class-validator";

enum Status_type {
    FOOD = 'food',
    DOCUMENT = 'document',
    OTHER = 'other'
}

enum Status {
    DELIVERED = 'delivered',
    NOT_DELIVERED = 'received'
}

export class CreateDeliveryDto {

    @ApiProperty({
        description: 'The Id of the Organization',
        example: '0ebf89e0-1606-4f8a-ad7c-39f4a3424028'
    })
    @IsNotEmpty()
    readonly organizationId: string;

    @ApiProperty({
        description: 'The sender of the Delivery',
        example: 'Akoto'
    })
    @IsString()
    @IsNotEmpty()
    readonly from: string;

    @ApiProperty({
        description: 'The receipient the Delivery',
        example: 'Ansah'
    })
    @IsString()
    @IsNotEmpty()
    readonly to: string;

    @ApiProperty({
        description: "The sender/'s phone  number",
        example: '0546987415'
    })
    @IsString()
    @IsNotEmpty()
    readonly phoneNumber: string;

    @ApiProperty({
        description: "The senders'/s email address",
        example: 'ansah@gmail.com'
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/, {
        message: 'Invalid Format, must be a valid email with the .com',
     })
    readonly email: string;

    
    @ApiProperty({
        description: "The date and time of delivery",
        example: '20-08-2023-12-24-01'
    })
    @IsString()
    @IsNotEmpty()
    readonly date_and_time: string;

    @ApiProperty({
        description: "The status of delivery",
        example: 'Delivered or Not Delivered'
    })
    @IsString()
    @IsEnum(Status, {
        message: 'Choose the type of status: delivered or received'
    })
    readonly status: string;

    @ApiProperty({
        description: "The type of delivery",
        example: 'Food, Documents,Other'
    })
    @IsString()
    @IsEnum(Status_type, {
        message: 'Choose the type of delivery: food,document,other'
    })
    readonly type: string;

    @ApiProperty({
        description: "The Description of the delivery",
        example: 'Any important detail of the delivery'
    })
    @IsString()
    readonly deliveryDescription: string;
}
