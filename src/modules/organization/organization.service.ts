
import { BadRequestException, ForbiddenException, Injectable, Param, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateOrganizationDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/create-organization.dto';
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
import { AuthService } from 'src/guard/auth/auth.service';




@Injectable()
export class OrganizationService {
  
  constructor(
    @InjectModel(Organization) private organizationModel: typeof Organization,
    @InjectModel(User) private user: typeof User,
    @InjectModel(Role) private role: typeof Role,
    private sequelize : Sequelize,
    private emailService:EmailService,
    private readonly authService: AuthService
  
    ){}

    // Create An Organization
  async create(createOrganizationDto: CreateOrganizationDto) {
    let t = await this.sequelize?.transaction();
    try {

      const defaultPassword = 'admin12345';
       const saltRounds = 10;

      // Hash the defualt password
      const hashedDefaultPassword = await bcrypt.hash(defaultPassword,saltRounds);

      // console.log(createOrganizationDto)
      // return;
      const organization = await this.organizationModel?.create({ ...createOrganizationDto}, { transaction: t })
      let role = await this?.role?.findOne({where:{name:'admin'}});

      if(!role)
      throw new ForbiddenException('Role Not Found');

      
      let org_data = {
        
        organizationId: organization?.organizationId,
        roleId: role?.roleId,
        fullName: createOrganizationDto?.fullName,
        email: organization?.email,
        phoneNumber: createOrganizationDto?.phoneNumber,
        password:hashedDefaultPassword
        
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
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };
    
  // Login
  async validateUser(loginDto: LoginDTO){
    const {email,password} = loginDto

    const user = await User.findOne({where:{email}})
    const organization = await this.organizationModel.findOne({where:{email}})
    if(!user && !organization){
      throw new BadRequestException('Organization with this email does not exist')
    }

    const passwordMatch = await this.authService.verifypassword(password, user.password)
    if (!passwordMatch){
      throw new UnauthorizedException('Invalid Credentials')
    }
 
    // Check if the oraganiazation is verified
    if(organization?.isVerified != true)
    return Util?.handleFailResponse('Organization account not verified')

 
    let accessToken = await createAccessToken(user?.id);
    let refreshToken = await generateRefreshToken(user?.id);
    let tokens = {
      accessToken,
      refreshToken
    }
    // console.log(tokens)

       let org_data ={
      id: organization.organizationId,
      organizationName: organization.organizationName,
      email: organization.email,
      IsPhoneNumber: organization.phoneNumber
    }

    let userDetails = {
      org_data,tokens
    }

        //  Send user data and tokens
        return Util?.handleSuccessRespone( userDetails,'Login successfully.')
  }
  

  //  Get All
  async findAll() {

    try {
      const orgs = await Organization.findAll()
      return Util?.handleSuccessRespone(orgs, "Organizations Data retrieved successfully.")
  }catch(error){
    console.log(error)
    return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
  }
  }



  // Get By Id
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

  // Update By Id
  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {

    try {

      const org = await Organization.findOne({ where: { id } });
      if (!org) {
        throw new Error('Organization not found.');
      }

      Object.assign(org, updateOrganizationDto)
      await org.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, "Organization updated successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }


  }

  // Delete By Id
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

  // Forgot password
  async forgetPassword(email: ForgotPasswordDto) {
    try {
      let user = await this.user.findOne({ where: { ...email } });

      if (!user) return Util.handleForbiddenExceptionResponses('Invaild Email');
      // await this.helperService.sendResetVerificationEmail(
      //   user?.fname,
      //   user?.user_id,
      //   user?.email,
      // );
      return Util.handleCreateSuccessRespone(
        `Reset password link sent to ${user?.email}`,
      );
    } catch (error) {
      return Util?.checkIfRecordNotFound(error)
      // return Util.handleGrpcTryCatchError(Util.getTryCatchMsg(error));
    }
  }


  // Change password
  async resetPassword(token: any, data: ResetPasswordDto) {
    const t = await this.sequelize.transaction();

    try {

      const defaultPassword = data?.password;
      const saltRounds = 10;

     // Hash the defualt password
     const hashedDefaultPassword = await bcrypt.hash(defaultPassword,saltRounds);

      let decode = Util.verifyToken(token);
      const user = await this?.user.findOne({
        where: {
          userId: decode.user_id,
        },
      });

      if (!user) return Util.handleForbiddenExceptionResponses('Invaid email');

      let UpdateData = {
        password: hashedDefaultPassword,
      };
      await this?.user.update(UpdateData, {
        where: { id: user?.id },
        transaction: t,
      });
      t.commit();
      return Util.handleCreateSuccessRespone('Password Reset Successful');
    } catch (error) {
      t.rollback();
      return Util?.checkIfRecordNotFound(error)
    }
  }


}