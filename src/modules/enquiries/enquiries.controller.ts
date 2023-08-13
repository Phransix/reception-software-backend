import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import * as Util from '../../utils/index'



@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

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

    @Get('getAllEnquireies')
    async findAll() {
      try {
        const allQueries = this.enquiriesService.findAll()
        return allQueries;

      }catch(error){
        console.log(error)
        return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
      }
    }

  @Get(':id')
  async findOne(@Param('id') id: number){
    try {
      let enquiryData = this.enquiriesService.findOne(id)
      return enquiryData

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }
    
  };


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

  @Delete(':id')
  async remove(@Param('id') id: number) {
     try {
      
      let enquiryDelete = await this.enquiriesService.remove(id)
      return enquiryDelete

     }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
     }

  }
}
