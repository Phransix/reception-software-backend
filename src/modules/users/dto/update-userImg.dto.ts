import { PartialType } from "@nestjs/swagger";
import { CreateUserImgDto } from "./create-userImg.dto";




export class UpdateUserImgDto extends PartialType(CreateUserImgDto){}