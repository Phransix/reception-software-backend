import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import { createEmailToken } from 'src/utils';



@Injectable()
export class OrganizationService {
  constructor (
    @InjectModel(Organization) private organizationModel: typeof Organization,
    
    ){}

  async signUp(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
   const organization = await this.organizationModel.create(createOrganizationDto)
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
