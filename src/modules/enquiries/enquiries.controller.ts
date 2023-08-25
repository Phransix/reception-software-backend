import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import * as Util from '../../utils/index'
import { Enquiry } from './entities/enquiry.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { AtGuard } from 'src/common/guards';


@ApiTags('Enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Create New Enquiry'})
  @Public()
  @UseGuards(AtGuard)
  @Post('creatEnquiry')
  async create(@Body() createEnquiryDto: CreateEnquiryDto) {
    try {
      let new_Enquiry = this.enquiriesService.create(createEnquiryDto);
      return new_Enquiry;
      
    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get All Enquiries'})
  @Public()
  @UseGuards(AtGuard)
  @Get('getAllEnquiries')
  async findAll() {
    try {
      const allQueries = this.enquiriesService.findAll()
      return allQueries;

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Get Enquiry By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number){
    try {
      let enquiryData = await this.enquiriesService.findOne(id)
      return enquiryData

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
    
  };


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Update Enquiry By Id'})
  @Public()
  @UseGuards(AtGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateEnquiryDto: UpdateEnquiryDto) {
    try {
      const enquiryUpdate = await this.enquiriesService.update(id, updateEnquiryDto)
      return enquiryUpdate

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOperation({summary:'Delete Enquiry By Id'})
  @Public()
  @UseGuards(AtGuard)
  @ApiTags('Enquiries')
  @Delete(':id')
  async remove(@Param('id') id: number) {
     try {

      const enquiry = await Enquiry.findOne({where:{id}});
      if(!enquiry) {
        // throw new Error('Enquiry not Found')
        return Util?.handleFailResponse('Enquiry not found')
      }
      
      let enquiryDelete = await this.enquiriesService.remove(id)
      return enquiryDelete

     }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
     }

  }
}
