import { IsEnum, IsNotEmpty, IsString } from "class-validator";

enum Status_type {
    FOOD = 'food',
    DOCUMENT = 'document',
    OTHER = 'other'
}

enum Status {
    DELIVERED = 'delivered',
    NOT_DELIVERED = 'not delivered'
}


export class CreateDeliveryDto {

    @IsString()
    @IsNotEmpty()
    readonly from: string;

    @IsString()
    @IsNotEmpty()
    readonly to: string;

    @IsString()
    @IsNotEmpty()
    readonly phonenumber: string;

    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly data_and_time: string;

    @IsString()
    @IsEnum(Status, {
        message: 'Choose the type of status: delivered not delivered'
    })
    readonly status: string;

    @IsString()
    @IsEnum(Status_type, {
        message: 'Choose the type of delivery: food,document,other'
    })
    readonly type: string;

    @IsString()
    readonly Delivery_Description: string;
}
