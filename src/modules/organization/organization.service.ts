import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import { createEmailToken } from 'src/utils';
import { InjectQueue } from '@nestjs/bull';
import { EmailService } from 'src/helper/EmailHelper';
import { or } from 'sequelize';





@Injectable()
export class OrganizationService {
  constructor (
    @InjectModel(Organization) private organizationModel: typeof Organization,
    private emailService:EmailService
    
  
    
    ){}

  async signUp(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
   const organization = await this.organizationModel.create(createOrganizationDto)

   let data={
    org_id : organization?.id,
    email: organization?.email,
    org_name : createOrganizationDto?.organization_Name
   }

  let result = await this?.emailService?.sendMailNotification({...data})
  console.log(result)
      return organization;

  }



  findAll() {
    return `This action returns all organization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
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
