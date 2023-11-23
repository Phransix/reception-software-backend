import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Matches, IsEmail, MinLength, MaxLength, IsMobilePhone, IsOptional} from "class-validator";

export enum Delivery_type {
    FOOD = 'food',
    DOCUMENT = 'document',
    OTHER = 'other'
}

export enum Status {
    DELIVERED = 'delivered',
    NOT_DELIVERED = 'awaiting_pickup'
}

enum itemUnit {
    PIECE = 'pc(s)',
    PACKS = 'pk(s)',
    BOX = 'bx(s)'
}

export class CreateDeliveryDto {
    static createdAt(createdAt: any, arg1: string) {
      throw new Error('Method not implemented.');
    }

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
        description: 'The receipient of the Delivery',
        example: 'Ansah'
    })
    readonly receipientName: string;

    @ApiProperty({
        description: "The sender/'s phone  number",
        example: '0546987415'
    })
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    @IsMobilePhone()
    readonly receipientPhoneNumber: string;

    @ApiProperty({
        description: "The senders'/s email address",
        example: 'ansah@gmail.com'
    })
    @IsString()
    @IsEmail()
    // @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/, {
        message: 'Invalid Format, must be a valid email with the .com',
     })
    readonly email: string;

    @ApiProperty({
        description: "The type of delivery",
        example: 'other'
    })
    @IsString()
    @IsEnum(Delivery_type, {
        message: 'Choose the type of delivery: food,document,other'
    })
    readonly type: string;

    @ApiProperty({
        description: "The quantity of delivery",
        example: '2'
    })
    readonly itemQuantity: string

    @ApiProperty({
        description: "The status of delivery",
        example: 'pc(s)'
    })
    @IsOptional()
    @IsEnum(itemUnit, {
        message: 'Choose the unit of the item'
    })
    readonly unit: string;

    @ApiProperty({
        description: "The Description of the delivery",
        example: 'Any important detail of the delivery'
    })
    @IsString()
    readonly itemDescription: string;

    @ApiProperty({
        description: 'The picker of the Delivery',
        example: 'Ansah'
    })
    readonly deliveryPicker: string;

}