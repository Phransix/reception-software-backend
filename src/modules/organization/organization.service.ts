import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import * as Util from '../../utils/index'
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';
// import {  }





@Injectable()
export class OrganizationService {
  constructor (
    @InjectModel(Organization) private organizationModel: typeof Organization,
    @InjectModel(User) private user: typeof User,
    private sequelize : Sequelize,
    // private emailService:EmailService
    ){}



async create(createOrganizationDto: CreateOrganizationDto) {
  let t = await this.sequelize?.transaction();
  try {
    console.log(createOrganizationDto)
    const organization = await this.organizationModel?.create({...createOrganizationDto},{transaction:t})

    // let data={
    //     org_id : organization?.id,
    //     email: organization?.email,
    //     org_name : createOrganizationDto?.organization_Name
    //    }

       let cus_data = {
        organization_Id : organization?.id,
        fullname : createOrganizationDto?.fullname,
        email: organization?.email,
        phoneNumber : createOrganizationDto?.phoneNumber
       }
       await this.user?.create({...cus_data},{transaction:t})
       t.commit()
       

       return Util?.handleSuccessRespone(Util?.SuccessRespone,"Organization created successfully.")

      }catch(error){
        t.rollback()
      console.log(error)
       throw new Error(error);
      
 
}
};



  async findAll(){

   try {
    const orgs = await Organization.findAll()
    return Util?.handleSuccessRespone(orgs,"Organizations Data retrieved successfully.")

   }catch(error){
    console.log(error)
    return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
  }

  }

 async findOne(id: number) {

  try{
    const org = await Organization.findOne({where:{id}});
    if (!org) {
      throw new Error('Organization not found.'); 
    }

    return Util?.handleSuccessRespone(org,"Organization retrieve successfully.")

  }catch(error){
    console.log(error)
    return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
  }

  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {

    try {
    
      const org = await Organization.findOne({where:{id}});
      if (!org) {
        throw new Error('Enquiry not found.'); 
      }

      Object.assign(org, updateOrganizationDto)
      await org.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Organization updated successfully.")

  }catch(error){
    console.log(error)
    return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
  }

    
  }

  async remove(id: number) {

    try{
      const org = await Organization.findOne({where:{id}});
      if (!org) {
        throw new Error('Organization not found.'); 
      }

      Object.assign(org)
      
      // await org.remove()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Organization deleted successfully.")

    }catch(error){
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

  }

  async findOneByorganizationName(organization_Name: string): Promise<Organization>{
    return await this.organizationModel.findOne<Organization>({where: {organization_Name}})
  }


  async findOneByEmail(email: string): Promise<Organization>{
    return await this.organizationModel.findOne<Organization>({where: {email}})
  }

     async findOneByPhoneNumber(phoneNumber: string): Promise<Organization> {
    return await this.organizationModel.findOne<Organization>({where: {phoneNumber}})
  }


  

}
