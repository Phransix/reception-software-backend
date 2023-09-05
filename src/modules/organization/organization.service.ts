import { ForbiddenException, Injectable, Param, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateOrganizationDto, VerifyEmailDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import * as Util from '../../utils/index'
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';
import { EmailService } from 'src/helper/EmailHelper';
import { verifyEmailToken } from '../../utils/index';
import { Role } from '../role/entities/role.entity';
import { AuthPassService } from 'src/guard/auth/authPass.service';
import * as argon from 'argon2';
import { orgImageUploadProfile } from 'src/helper/organizationsProfile';
import { CreateOrganizationImgDto } from './dto/create-organizationImg.dto';
const fs = require('fs')


@Injectable()
export class OrganizationService {
  
  constructor(
    @InjectModel(Organization) private organizationModel: typeof Organization,
    @InjectModel(User) private user: typeof User,
    @InjectModel(Role) private role: typeof Role,
    private sequelize : Sequelize,
    private emailService:EmailService,
    private readonly authPassService: AuthPassService,
    private imgHelper: orgImageUploadProfile
   
  
    ){}

    // Create An Organization
  async create(createOrganizationDto: CreateOrganizationDto) {
    let t = await this.sequelize?.transaction();
    try {
      let insertQry = {
        organizationName: createOrganizationDto?.organizationName,
        email: createOrganizationDto?.email,
        phoneNumber: createOrganizationDto?.phoneNumber,
      }
      console.log(insertQry)

      // return false
      let ran_password = await this.makeid(8)
      const hash = await argon.hash(ran_password);
     
      const organization = await this.organizationModel?.create({ ...createOrganizationDto}, { transaction: t })
      let role = await this?.role?.findOne({where:{name:'Admin'}});

      if(!role)
      throw new ForbiddenException('Role Not Found');

      let org_data = {
        organizationId: organization?.organizationId,
        name: role?.name,
        fullName: createOrganizationDto?.fullName,
        email: organization?.email,
        phoneNumber: createOrganizationDto?.phoneNumber,
        password:hash
      }
      // console.log(org_data)
      // return false

      let mail_data = {
        
        organizationId: organization?.organizationId,
        roleId: role?.roleId,
        fullName: createOrganizationDto?.fullName,
        email: organization?.email,
        phoneNumber: createOrganizationDto?.phoneNumber,
        password:ran_password
        
      }
      const user = await this.user?.create({ ...org_data }, { transaction: t })
     let verifyToken = await this.emailService.sendMailNotification({...mail_data})
     console.log(verifyToken)

       await this.emailService?.sendDeaultPassword({...mail_data})
      

      t.commit()
      console.log(user)
      return Util?.handleCreateSuccessRespone("Organization created successfully.")

    } catch (error ) {
      t.rollback()
      console.log(error)
      throw new Error("Registration failed");

    }
  };


  // Verify Email Account
  async verifyEmail(verifyEmailDto:VerifyEmailDto) {
    try{

      const decodeToken = verifyEmailToken(verifyEmailDto?.token);
      // console.log(decodeToken);
     
      if(!decodeToken){
        return Util?.handleFailResponse('Organization not verified')
      }

   
      const orgToken = await this.organizationModel.findOne({where:{email:decodeToken?.email}})
      
      // console.log(decodeToken?.email);
      // return;

      if(!orgToken){
        return Util?.handleFailResponse('Organization not found')
      }

      if(orgToken?.isVerified === true)
      return Util?.handleFailResponse('Organization account already verified')

      await Organization.update({isVerified: true},{where: {id: orgToken?.id, email: orgToken?.email}} )
      return Util?.SuccessRespone('Your account has been successfully verified')

    }catch (error) {
      console.log(error)
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
      return Util?.handleFailResponse('Accounts verification failed');
    }
  };
    

  // Get All
  
  async findAll() {

    try {
      const orgs = await Organization.findAll({
    
        attributes:{
          exclude:['password','createdAt','updatedAt','deletedAt']
        }
      })

      return Util?.handleSuccessRespone(orgs, "Organizations Data retrieved successfully.")
  }catch(error){
    console.log(error)
    // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    return Util?.handleFailResponse('Failed, Organizations Data Not Found');
  }
  }



  // Get By Id
  async findOne(id: string) {

    try {
      const org = await Organization.findOne(
        {
          attributes:{
            exclude:['password','createdAt','updatedAt','deletedAt']
          },
          
          where: { id } });
      if (!org) {
        throw new Error('Organization not found.');
      }

      return Util?.handleSuccessRespone(org, "Organization retrieve successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Failed, Organization Data Not Found');
      // return Util?.checkIfRecordNotFound
    }

  }

  // Update By Id
  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    let rollImage = '';
    try {

      const org = await Organization.findOne({ where: { id } });
      if (!org) {
        return Util?.handleFailResponse(`Organization with this #${id} not found`)
      }

      var image_matches = updateOrganizationDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      )
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file')
      }

      let orgProfile = await this?.imgHelper?.uploadOrganizationImage(updateOrganizationDto?.profilePhoto)
      rollImage = orgProfile

          // Delete the old profile photo if it exists in the directorate
          let front_path = org?.profilePhoto
          if (front_path != null){
            fs.access(front_path, fs.F_OK, async (err) => {
              if (err) {
                console.error(err)
                return
              }
              await this.imgHelper.unlinkFile(front_path); 
            })
          }

      let insertQry = {
        organizationName: updateOrganizationDto?.organizationName,
        email: updateOrganizationDto?.email,
        phoneNumber: updateOrganizationDto?.phoneNumber,
        profilePhoto: orgProfile,
        
      }
      // console.log(insertQry)

      // return false
      await this?.organizationModel?.update(insertQry,
        {
          where:{id:org?.id}
        })
          return Util?.handleCreateSuccessRespone(`Organization with this #${id} updated successfully`)

    } catch (error) {
      if(rollImage){
        await this?.imgHelper?.unlinkFile(rollImage)
      }
      return Util?.handleFailResponse(`Organization with this #${id} not Updated `);
    }


  }


   // Update Organization Profile Photo
   async updateImg(id: string, createOrganizationImgDto: CreateOrganizationImgDto){

    let rollImage = '';

    try {
      const org_data  = await this.organizationModel.findOne({where:{id}})
      if(!org_data){
        return Util?.handleFailResponse(`Organization with this #${id} not found`)
      }

      if (
        createOrganizationImgDto?.profilePhoto == null ||
        createOrganizationImgDto?.profilePhoto == undefined ||
        createOrganizationImgDto?.profilePhoto == ""
      ){
        return Util?.handleFailResponse('File Can not be empty')
      }

      var image_matches = createOrganizationImgDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      )
      if(!image_matches){
        return Util?.handleFailResponse('Invalid Input file')
      }

      let org_image = await this?.imgHelper?.uploadOrganizationImage(createOrganizationImgDto?.profilePhoto)
      
      rollImage = org_image

         // Delete the old profile photo if it exists in the directorate
         let front_path = org_data?.profilePhoto
         if (front_path != null){
           fs.access(front_path, fs.F_OK, async (err) => {
             if (err) {
               console.error(err)
               return
             }
             await this.imgHelper.unlinkFile(front_path); 
           })
         }

      let insertQry = {
        profilePhoto: org_image  
      }
      // console.log(insertQry)
      await this?.organizationModel?.update(insertQry,
        {
          where:{id:org_data?.id}
        })

      return Util?.handleCreateSuccessRespone(`Organization with this #${id} and Image updated successfully`)
 
    } catch (error) {
      if(rollImage){
        await this?.imgHelper?.unlinkFile(rollImage)
      }
      return Util?.handleFailResponse(`Organization with this #${id} and Image not Updated`)
    }

  }


  // Delete By Id
  async remove(id: string) {

    try {
      const org = await Organization.findOne({ where: { id } });
      if (!org) 
        // throw new Error('Organization not found.');
        return Util?.checkIfRecordNotFound("Organization not found.")
      

      Object.assign(org)
      await org.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Organization deleted successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Failed, Organizations Data Not Deleted');
    }

  }


  // Restore Deleted Data
  async restoreUser(id:string){

    try {

      const organization = await this.organizationModel.restore({where:{id}})
      console.log(organization)
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Organization restored successfully.")
      
    } catch (error) {
      return Util.handleForbiddenExceptionResponses('Data Not Restored');
    }
 
  }
  


  async findOneByorganizationName(organizationName: string): Promise<Organization> {
    return await this.organizationModel.findOne<Organization>({ where: { organizationName } })
  }

  // async findOneByuseFullname(fullname: string): Promise<Organization>{
  //   return await this.organizationModel.findOne<Organization>({where: {fullname}})
  // }


  async findOneByEmail(email: string): Promise<Organization> {
    return await this.organizationModel.findOne<Organization>({ where: { email } })
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<Organization> {
    return await this.organizationModel.findOne<Organization>({ where: { phoneNumber } })
  }





  async makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;

  }


}