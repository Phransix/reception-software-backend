import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateOrganizationDto,
  VerifyEmailDto,
} from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from './entities/organization.entity';
import * as Util from '../../utils/index';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/modules/users/entities/user.entity';
import { EmailService } from 'src/helper/EmailHelper';
import { verifyEmailToken } from '../../utils/index';
import { Role } from '../role/entities/role.entity';
import { AuthPassService } from 'src/guard/auth/authPass.service';
import * as argon from 'argon2';
import { orgImageUploadProfile } from 'src/helper/organizationsProfile';
import { CreateOrganizationImgDto } from './dto/create-organizationImg.dto';
import { LoginDTO } from 'src/guard/auth/loginDTO';
const fs = require('fs');
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LogOutDTO } from 'src/guard/auth/logoutDto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization) private organizationModel: typeof Organization,
    @InjectModel(User) private user: typeof User,
    @InjectModel(Role) private role: typeof Role,
    private sequelize: Sequelize,
    private emailService: EmailService,
    private readonly authPassService: AuthPassService,
    private imgHelper: orgImageUploadProfile,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // Create An Organization
  async create(createOrganizationDto: CreateOrganizationDto) {
    let t = await this.sequelize?.transaction();
    try {
      let insertQry = {
        organizationName: createOrganizationDto?.organizationName,
        email: createOrganizationDto?.email,
        phoneNumber: createOrganizationDto?.phoneNumber,
      };
      console.log(insertQry);

      // return false
      let ran_password = await this.makeid(8);
      const hash = await argon.hash(ran_password);

      const organization = await this.organizationModel?.create(
        { ...createOrganizationDto },
        { transaction: t },
      );
      let role = await this?.role?.findOne({ where: { name: 'Admin' } });

      if (!role) throw new ForbiddenException('Role Not Found');

      let org_data = {
        organizationId: organization?.organizationId,
        name: role?.name,
        fullName: createOrganizationDto?.fullName,
        email: organization?.email,
        phoneNumber: createOrganizationDto?.phoneNumber,
        password: hash,
      };
      // console.log(org_data)
      // return false

      let mail_data = {
        organizationId: organization?.organizationId,
        roleId: role?.roleId,
        fullName: createOrganizationDto?.fullName,
        email: organization?.email,
        phoneNumber: createOrganizationDto?.phoneNumber,
        password: ran_password,
      };
      const user = await this.user?.create({ ...org_data }, { transaction: t });
      let verifyToken = await this.emailService.sendMailNotification({
        ...mail_data,
      });
      console.log(verifyToken);

      await this.emailService?.sendDeaultPassword({ ...mail_data });

      t.commit();
      console.log(user);
      return Util?.handleCreateSuccessRespone(
        'Organization created successfully.',
      );
    } catch (error) {
      t.rollback();
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Verify Email Account
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      const decodeToken = verifyEmailToken(verifyEmailDto?.token);
      // console.log(decodeToken);

      if (!decodeToken) {
        return Util?.handleFailResponse('Organization not verified');
      }

      const orgToken = await this.organizationModel.findOne({
        where: { email: decodeToken?.email },
      });

      // console.log(decodeToken?.email);
      // return;

      if (!orgToken) {
        return Util?.handleFailResponse('Organization not found');
      }

      if (orgToken?.isVerified === true)
        return Util?.handleFailResponse(
          'Organization account already verified',
        );

      await Organization.update(
        { isVerified: true },
        { where: { id: orgToken?.id, email: orgToken?.email } },
      );
      return Util?.handleCreateSuccessRespone(
        'Your account has been successfully verified',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Login Organization Tablet
  async login(loginDto: LoginDTO) {
    const { email, password } = loginDto;

    try {
      const user = await User.findOne({ where: { email } });
      const org = await Organization.findOne({ where: { email } });
      if (!user) {
        // return Util.handleForbiddenExceptionResponses('Invaid email or password');
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.FORBIDDEN,
        );
      }

      // Check if the password of the Matches
      const passwordMatches = await argon.verify(
        user.password,
        loginDto.password,
      );
      if (!passwordMatches) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.FORBIDDEN,
        );
      }
      // Check if the oraganiazation is verified
      if (org?.isVerified != true)
        return Util?.handleFailResponse('Oraganiazation account not verified');
      console.log(org?.isVerified);

      let tokens = await this?.getTokens(
        org?.organizationId,
        org?.email,
        org?.organizationName,
      );

      //  console.log(tokens)
      //return;
      let org_data = {
        organizationId: org?.organizationId,
        organizationName: org?.organizationName,
        fullname: user.fullName,
        email: org?.email,
        IsPhoneNumber: org?.phoneNumber,
      };

      let orgDetails = {
        ...org_data,
        tokens,
      };

      //  Send user data and tokens
      return Util?.handleCustonCreateResponse(orgDetails, 'Login successfully.');
    } catch (error) {
      console.error(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get All
  async findAll(page: number, size: number) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Organizations current page cannot be negative',
        );
      }
      const { limit, offset } = Util.getPagination(page, size);

      const allQueries = await Organization.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        order: [
          ['createdAt', 'ASC']
        ]
      });
      

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Organizations Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get By Id
  async findOne(organizationId: string) {
    try {
      const org = await Organization.findOne({
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },

        where: { organizationId },
      });
      if (!org) {
        throw new Error('Organization not found.');
      }

      return Util?.handleSuccessRespone(
        org,
        'Organization retrieve successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update By Id
  async update(
    organizationId: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    let rollImage = '';
    try {
      const org = await Organization.findOne({ where: { organizationId } });
      if (!org) {
        return Util?.handleFailResponse(
          `Organization with this #${organizationId} not found`,
        );
      }

      var image_matches = updateOrganizationDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file');
      }

      let orgProfile = await this?.imgHelper?.uploadOrganizationImage(
        updateOrganizationDto?.profilePhoto,
      );
      rollImage = orgProfile;

      // Delete the old profile photo if it exists in the directorate
      let front_path = org?.profilePhoto;
      if (front_path != null) {
        fs.access(front_path, fs.F_OK, async (err) => {
          if (err) {
            console.error(err);
            return;
          }
          await this.imgHelper.unlinkFile(front_path);
        });
      }

      let insertQry = {
        organizationName: updateOrganizationDto?.organizationName,
        email: updateOrganizationDto?.email,
        phoneNumber: updateOrganizationDto?.phoneNumber,
        profilePhoto: orgProfile,
      };
      // console.log(insertQry)

      // return false
      await this?.organizationModel?.update(insertQry, {
        where: { organizationId: org?.organizationId },
      });
      return Util?.handleCreateSuccessRespone(
        `Organization with this #${organizationId} updated successfully`,
      );
    } catch (error) {
      if (rollImage) {
        await this?.imgHelper?.unlinkFile(rollImage);
      }
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update Organization Profile Photo
  async updateImg(
    organizationId: string,
    createOrganizationImgDto: CreateOrganizationImgDto,
  ) {
    let rollImage = '';

    try {
      const org_data = await this.organizationModel.findOne({
        where: { organizationId },
      });
      if (!org_data) {
        return Util?.handleFailResponse(
          `Organization with this #${organizationId} not found`,
        );
      }

      if (
        createOrganizationImgDto?.profilePhoto == null ||
        createOrganizationImgDto?.profilePhoto == undefined ||
        createOrganizationImgDto?.profilePhoto == ''
      ) {
        return Util?.handleFailResponse('File Can not be empty');
      }

      var image_matches = createOrganizationImgDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file');
      }

      let org_image = await this?.imgHelper?.uploadOrganizationImage(
        createOrganizationImgDto?.profilePhoto,
      );

      rollImage = org_image;

      // Delete the old profile photo if it exists in the directorate
      let front_path = org_data?.profilePhoto;
      if (front_path != null) {
        fs.access(front_path, fs.F_OK, async (err) => {
          if (err) {
            console.error(err);
            return;
          }
          await this.imgHelper.unlinkFile(front_path);
        });
      }

      let insertQry = {
        profilePhoto: org_image,
      };
      // console.log(insertQry)
      await this?.organizationModel?.update(insertQry, {
        where: { id: org_data?.id },
      });

      return Util?.handleCreateSuccessRespone(
        `Organization with this #${organizationId} and Image updated successfully`,
      );
    } catch (error) {
      if (rollImage) {
        await this?.imgHelper?.unlinkFile(rollImage);
      }
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Delete By Id
  async remove(organizationId: string) {
    try {
      const org = await Organization.findOne({ where: { organizationId } });
      if (!org){
        return Util?.checkIfRecordNotFound('Organization not found.');
      }
        await this?.organizationModel?.destroy()

      return Util?.handleSuccessRespone(
        Util?.SuccessRespone,
        'Organization deleted successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }



  // Restore Deleted Data
  async restoreUser(organizationId: string) {
    try {
      const organization = await this.organizationModel.restore({
        where: { organizationId },
      });
      console.log(organization);
      return Util?.handleCreateSuccessRespone(
        'Organization restored successfully.',
      );
    } catch (error) {
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  async findOneByorganizationName(
    organizationName: string,
  ): Promise<Organization> {
    return await this.organizationModel.findOne<Organization>({
      where: { organizationName },
    });
  }

 

  async findOneByEmail(email: string): Promise<Organization> {
    return await this.organizationModel.findOne<Organization>({
      where: { email },
    });
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<Organization> {
    return await this.organizationModel.findOne<Organization>({
      where: { phoneNumber },
    });
  }

  async makeid(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async getTokens(org_id: string, email: string, organizationName: string) {
    const jwtPayload = {
      sub: org_id,
      email: email,
      scopes: organizationName,
    };

    const [at,rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_SECRETTABLET'),
        // expiresIn: '1m',
        expiresIn: '7d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '360d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

}
