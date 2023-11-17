import { PartialType } from "@nestjs/swagger";
import { CreateStaffImgDto } from "./create-staffImg.dto";


export class updateStaffImgDto extends PartialType(CreateStaffImgDto){}