import { Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { Enquiry } from './entities/enquiry.entity';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import * as Util from '../../utils/index'
import * as Abstract from '../../utils/abstract'

@Injectable()
export class EnquiriesService {

  constructor (
    private sequelize: Sequelize,
    @InjectModel(Enquiry) private readonly EnquiryModel: typeof Enquiry
  ){}



 async create(createEnquiryDto: CreateEnquiryDto) {
    try {
      console.log(createEnquiryDto)
      await Abstract?.createData(Enquiry,createEnquiryDto);
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Enquiry created successfully.")
      
    }catch(error){
      console.log(error)
      // return Util
      return Util?.handleFailResponse('Enquiry registration failed')
    }
  };

  

  async findAll(){
    try {
      const enquiries = await Enquiry.findAll()
      return Util?.handleSuccessRespone(enquiries,"Enquiries Data retrieved successfully.")

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };

  async findOne(id: number) {
    try{
      const enquiry = await Enquiry.findOne({where:{id}});
      if (!enquiry) {
        throw new Error('Enquiry not found.'); 
      }
  
      return Util?.handleSuccessRespone(enquiry,"Enquiry retrieve successfully.")

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  async update(id: number, updateEnquiryDto: UpdateEnquiryDto)  {
    try {
    
      const enquiry = await Enquiry.findOne({where:{id}});
      if (!enquiry) {
        throw new Error('Enquiry not found.'); 
      }

      Object.assign(enquiry,updateEnquiryDto)
      await enquiry.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Enquiry updated successfully.")

  }catch(error){
    console.log(error)
    return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
  }
    
  };



  async remove(id: number) {
    try{
      const enquiry = await Enquiry.findOne({where:{id}});
      if (!enquiry) {
        throw new Error('Enquiry not found.'); 
      }

      Object.assign(enquiry)
     
      // await enquiry.remove()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Enquiry deleted successfully.")

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
   
  }
}

