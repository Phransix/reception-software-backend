import { BadRequestException, Injectable, Param, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import * as Util from '../../utils/index'
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';
import { EmailService } from 'src/helper/EmailHelper';
import {  createAccessToken, generateRefreshToken, verifyEmailToken } from '../../utils/index';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/guard/auth/loginDTO';
import { Role } from '../role/entities/role.entity';
// import { ChangePassDTO } from 'src/guard/auth/changePassDTO';

@Injectable()
export class OrganizationService {
  
  constructor(
    @InjectModel(Organization) private organizationModel: typeof Organization,
    @InjectModel(User) private user: typeof User,
    @InjectModel(Role) private role: typeof Role,
    private sequelize : Sequelize,
    private emailService:EmailService
    ){}

  async create(createOrganizationDto: CreateOrganizationDto) {
    let t = await this.sequelize?.transaction();
    try {

      const defaultPassword = 'admin12345';
       const saltRounds = 10;

      // Hash the defualt password
      const hashedDefaultPassword = await bcrypt.hash(defaultPassword,saltRounds);

      console.log(createOrganizationDto)
      const organization = await this.organizationModel?.create({ ...createOrganizationDto}, { transaction: t })
      let role = await this?.role?.findOne({where:{name:'admin'}});

      if(!role)
      return false
   
      
      let org_data = {
        
        organizationId: organization?.organizationId,
        roleId: role?.roleId,
        fullName: createOrganizationDto?.fullName,
        email: organization?.email,
        phoneNumber: createOrganizationDto?.phoneNumber,
        password: hashedDefaultPassword
        
      }
      const user = await this.user?.create({ ...org_data }, { transaction: t })
      let send_Token = await this.emailService.sendMailNotification({...org_data})
      console.log(send_Token)

      t.commit()
      console.log(user)
      return Util?.handleCreateSuccessRespone("Organization created successfully.")

    } catch (error) {
      t.rollback()
      console.log(error)
      throw new Error(error);

    }
  };


  async verifyEmail( token: string) {
    try{
      const decodeToken = verifyEmailToken(token);
      console.log(decodeToken);
      // return;
       
      if(!decodeToken){
        return Util?.handleFailResponse('Organization not verified')
      }

      // const orgToken = await this.organizationModel.findByPk(decodeToken.organizationId);
      const orgToken = await Organization.findOne({where: { id: decodeToken?.organization_id ,email: decodeToken?.email}});
      

      if(!orgToken){
        return Util?.handleFailResponse('Organization not verified')
      }

      await Organization.update({isVerified: true},{where: {id: decodeToken?.id, email: decodeToken?.email}} )
      return Util?.SuccessRespone('Your account has been successfully verified')

    }catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };
    
  async validateUser(loginDto: LoginDTO){
    const {email,password} = loginDto

    const user = await User.findOne({where:{email}})
    if(!user){
      throw new BadRequestException('User with this email does not exist')
    }
    const IsPasswordValid = await bcrypt.compare(password,user.password)
    if(!IsPasswordValid){
      throw new UnauthorizedException('Invalid Credentials')
    }
    let accessToken = await createAccessToken(user?.id);
    let refreshToken = await generateRefreshToken(user?.id);
    let tokens = {
      accessToken,
      refreshToken
    }
    // console.log(tokens)

       let org_data ={
      id: user.id,
      organizationName: user.organization,
      email: user.email,
      IsPhoneNumber: user.phoneNumber
    }

    let userDetails = {
      org_data,tokens
    }

        //  Send user data and tokens
        return Util?.handleSuccessRespone( userDetails,'Login successfully.')
       
   
  }
  


  async findAll() {

    try {
      const orgs = await Organization.findAll()
      return Util?.handleSuccessRespone(orgs, "Organizations Data retrieved successfully.")

      // Object.assign(org, updateOrganizationDto)
      // await org.save()
      // return Util?.handleSuccessRespone(Util?.SuccessRespone,"Organization updated successfully.")

  }catch(error){
    console.log(error)
    return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
  }

    
  }



  async findOne(id: number) {

    try {
      const org = await Organization.findOne({ where: { id } });
      if (!org) {
        throw new Error('Organization not found.');
      }

      return Util?.handleSuccessRespone(org, "Organization retrieve successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {

    try {

      const org = await Organization.findOne({ where: { id } });
      if (!org) {
        throw new Error('Enquiry not found.');
      }

      Object.assign(org, updateOrganizationDto)
      await org.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Organization updated successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }


  }

  async remove(id: number) {

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
      // return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
      return Util?.checkIfRecordNotFound("Organization not found.")
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




}
