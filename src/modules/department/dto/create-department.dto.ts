
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";



export class CreateDepartmentDto {

    @ApiProperty({
        description: 'The Id of the Organization',
        example: 'a036ad92-bccf-405a-8876-6fd7f6bd1514'
    })
    @IsNotEmpty()
    readonly organizationId: string;

    @ApiProperty({
        description: 'The Name of the department',
        example: 'Accounting Department'
    })
    @IsString()
    @IsNotEmpty()
    readonly departmentName: string;

    @ApiProperty({
        description: 'The Room Number of the Department',
        example: '12'
    })
    @IsString()
    @IsNotEmpty()
    readonly departmentRoomNum: string;


    @ApiProperty({
        description: 'The profile photo of the Staff',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    })
    readonly profilePhoto: string;

 

 
  


}



