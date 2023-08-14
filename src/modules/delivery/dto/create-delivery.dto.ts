import { IsEnum, IsNotEmpty, IsString, Matches, IsEmail} from "class-validator";

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

    @IsNotEmpty()
    readonly organization_Id: string;

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
    @IsEmail()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9._%+-]+@.+\.com$/, {
        message: 'Invalid Format, must be a valid email with the .com',
     })
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
