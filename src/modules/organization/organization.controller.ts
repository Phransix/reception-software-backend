import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DoesUserExist } from 'src/common/guards/doesUserExist.guard';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import * as Util from '../../utils/index'


 
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    // private readonly mailerSevice: MailerService
  ) {}

//  @ApiTags('Organization')
//   @ApiOkResponse({
//     description:'Registration Successfully',
//     type: Organization
//   })
//   @ApiBadRequestResponse({
//     description: 'Registration Failed',
//     type: Organization
//   })


@UseGuards(DoesUserExist)
  @Post('signUp')
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    try {

      let new_Enquiry = this.organizationService.create(createOrganizationDto);
      return new_Enquiry;

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }



  @Get('getAllOrganizations')
 async findAll() {

  try {
    const allQueries = this.organizationService.findAll()
    return allQueries;

  }catch(error){
    console.log(error)
    return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
  }

  };

  @Get(':id')
  async findOne(@Param('id') id: number) {

    try {
      let orgData = this.organizationService.findOne(id)
      return orgData

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }


  };

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateOrganizationDto: UpdateOrganizationDto) {

    try {
      const orgUpdate = await this.organizationService.update(id, updateOrganizationDto)
      return orgUpdate

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }

  }

  @Delete(':id')
 async remove(@Param('id') id: number) {

    try {
      
      let orgDelete = await this.organizationService.remove(id)
      return orgDelete

     }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
     }

  }
}
