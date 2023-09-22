import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as Util from '../../utils/index';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../role/entities/role.entity';
import { Organization } from '../organization/entities/organization.entity';
import { ChangePassDTO } from 'src/guard/auth/changePassDTO';
import { LoginDTO } from 'src/guard/auth/loginDTO';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { imageUploadProfile } from 'src/helper/usersProfile';
import { CreateUserImgDto } from './dto/create-userImg.dto';
const fs = require('fs');
import { Sequelize } from 'sequelize-typescript';
import { query } from 'express';
import { where } from 'sequelize';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../organization/dto/create-organization.dto';
import { ResetPasswordService } from 'src/helper/ResetPassHelper';
import { log } from 'console';
import { LogOutDTO } from 'src/guard/auth/logoutDto';
import { UsersModule } from './users.module';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(Organization) private orgModel: typeof Organization,
    private jwtService: JwtService,
    private config: ConfigService,
    private sequelize: Sequelize,
    private imagehelper: imageUploadProfile,
    private resetPasswordService: ResetPasswordService,
  ) {}

  //  Register New User
  async create(createUserDto: CreateUserDto,userId) {
    try {

    
      let user = await this?.userModel?.findOne({where:{userId}})
      console.log(user?.organizationId)
      var image_matches = createUserDto.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file');
      }

      let user_image = await this?.imagehelper?.uploadUserImage(
        createUserDto.profilePhoto,
      );

      const hash = await argon.hash(createUserDto.password);

      let insertQry = {
        // roleId: createUserDto?.roleId,
        roleName: createUserDto?.roleName,
        organizationId: createUserDto?.organizationId,
        fullName: createUserDto?.fullName,
        email: createUserDto?.email,
        phoneNumber: createUserDto?.phoneNumber,
        profilePhoto: user_image,
        password: hash,
      };
    

      await this.userModel?.create({ ...insertQry });

      return Util?.handleCreateSuccessRespone('User Created Successfully');
    } catch (error) {
      console.error(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Login users
  async login(loginDto: LoginDTO) {
    const { email, password } = loginDto;

    try {
      const user = await User.findOne({ where: { email } });
      const org = await Organization.findOne({ where: { email } });

      if (!user) {
        return Util.handleFailResponse('Invalid email or password');
      }

      const passwordMatches = await argon.verify(
        user.password,
        loginDto.password,
      );
      if (!passwordMatches) {
        return Util.handleFailResponse('Invalid email or password');
      }

      // Check if the oraganiazation is verified
      if (org?.isVerified != true)
        return Util?.handleFailResponse('Oraganiazation account not verified');
      console.log(org?.isVerified);

      
      //  Check the Role of the User
      const user_role = await User.findOne({
        where: { roleName: user?.roleName },
      });
      if (!user_role) return Util.handleNotFoundResponse();

      let tokens = await this?.getTokens(
        user.userId,
        user.email,
        user?.roleName,
      );

      //  console.log(tokens)
      //return;
      let org_data = {
        id: user?.id,
        userId: user.userId,
        organizationId: user?.organizationId,
        roleName: user?.roleName,
        fullname: user.fullName,
        email: user.email,
        IsPhoneNumber: user.phoneNumber,
      };

      let userDetails = {
        ...org_data,
        tokens,
      };

      await User.update(
        { isLogin: true },
        { where: { email: user?.email, password: user?.password } },
      );

      //  Send user data and tokens
      return Util?.handleCustonCreateResponse(
        userDetails,
        'Login successfully.',
      );
    } catch (error) {
      console.error(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get All Users
  async findAll(page: number, size: number) {
    try {
      let currentPage = Util.Checknegative(page);
      if (currentPage) {
        return Util?.handleErrorRespone(
          'Users current page cannot be negative',
        );
      }
      const { limit, offset } = Util.getPagination(page, size);

      const allQueries = await User.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['password','createdAt', 'updatedAt', 'deletedAt'] },
        order: [
          ['createdAt', 'ASC']
        ],

        include:[{
          model: Organization,
           attributes:{
            exclude:[
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "isVerified",
            ]
           }
        }],

      });

      let result = Util?.getPagingData(allQueries, page, limit);
      console.log(result);

      const dataResult = { ...result };
      return Util?.handleSuccessRespone(
        dataResult,
        'Users Data retrieved successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get User By Id
  async findOne(userId: string) {
    try {
      const user = await User.findOne({
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
        where: { userId },
      });
      if (!user) {
        throw new Error('User not found.');
      }

      return Util?.handleSuccessRespone(user, 'User retrieve successfully.');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update User by Id
  async update(userId: string, updateUserDto: UpdateUserDto) {
    let rollImage = '';

    try {
      const user = await this.userModel.findOne({ where: { userId } });
      if (!user) {
        // throw new Error('User not found.');
        return Util?.handleFailResponse('User  not found');
      }

      var image_matches = updateUserDto.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file');
      }

      let user_image = await this?.imagehelper?.uploadUserImage(
        updateUserDto.profilePhoto,
      );
      rollImage = user_image;

      // Delete the old profile photo if it exists in the directorate
      let front_path = user?.profilePhoto;
      if (front_path != null) {
        fs.access(front_path, fs.F_OK, async (err) => {
          if (err) {
            console.error(err);
            return;
          }
          await this.imagehelper.unlinkFile(front_path);
        });
      }

      let insertQry = {
        roleName: updateUserDto?.roleName,
        fullName: updateUserDto?.fullName,
        email: updateUserDto?.email,
        phoneNumber: updateUserDto?.phoneNumber,
        profilePhoto: user_image,
      };

      await this?.userModel?.update(insertQry, {
        where: { id: user?.id },
      });

      return Util?.SuccessRespone('User updated successfully');
    } catch (error) {
      if (rollImage) {
        await this.imagehelper.unlinkFile(rollImage);
      }
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  //  Change User Password
  async changePass(userId: string, changepassDto: ChangePassDTO) {
    const { oldPassword, newPassword, confirmNewPassword } = changepassDto;
    try {
      const user = await User.findOne({ where: { userId } });
      if (!user) {
        throw new BadRequestException('User with this ${id} does not exist');
      }

      // Verify the old password
      const match = await argon.verify(user.password, oldPassword);
      if (!match) {
        return Util?.handleFailResponse('Incorrect old password');
      }

      // Testing if confirmNewPassword != newPassword
      if (confirmNewPassword != newPassword) {
        return Util?.handleFailResponse('Passwords do not match');
      }

      // Hash the new password and update the user's password
      const hashedNewPassword = await argon.hash(newPassword);
      user.password = hashedNewPassword;

      // await this.userModel.save(user);
      Object.assign(user, changepassDto);
      await user.save();
      return Util?.SuccessRespone(
        'User with this #${userId}  password changed succcessful',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Forget Password
  async forgetPassword(email: ForgotPasswordDto) {
    try {
      let user = await this.userModel.findOne({ where: { ...email } });

      if (!user) return Util.handleForbiddenExceptionResponses('Invaild Email');
      // await this.resetPasswordService.sendResstPasswordNotification(
      //   user?.fullName,
      //   user?.userId,
      //   user?.email,
      // );

      let send_Token =
        await this.resetPasswordService.sendResstPasswordNotification({
          ...email,
        });
      console.log(send_Token);

      return Util.handleCreateSuccessRespone(
        `Reset password link sent to ${user?.email}`,
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Reset Password
  async resetPassword(token: any, data: ResetPasswordDto) {
    const t = await this.sequelize.transaction();

    try {
      const defaultPassword = data?.password;
      // const saltRounds = 10;

      // Hash the defualt password
      const hashedDefaultPassword = await argon.hash(defaultPassword);

      let decode = Util.verifyToken(token);
      const user = await this?.userModel.findOne({
        where: {
          email: decode.email,
        },
      });

      if (!user) return Util.handleForbiddenExceptionResponses('Invaid email');

      let UpdateData = {
        password: hashedDefaultPassword,
      };
      await this?.userModel.update(UpdateData, {
        where: { email: user?.email },
        transaction: t,
      });
      t.commit();
      return Util.handleCreateSuccessRespone('Password Reset Successfully');
    } catch (error) {
      t.rollback();
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Update User  Profile Photo
  async updateImg(userId: string, createUserImgDto: CreateUserImgDto) {
    let rollImage = '';
    // let InsertImg = '';

    try {
      const user_data = await this.userModel.findOne({ where: { userId } });
      if (!user_data) {
        return Util?.handleFailResponse(`User with this #${userId} not found`);
      }

      if (
        createUserImgDto?.profilePhoto == null ||
        createUserImgDto?.profilePhoto == undefined ||
        createUserImgDto?.profilePhoto == ''
      ) {
        return Util?.handleFailResponse('File Can not be empty');
      }

      var image_matches = createUserImgDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
      );
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file');
      }

      let user_image = await this?.imagehelper?.uploadUserImage(
        createUserImgDto?.profilePhoto,
      );

      rollImage = user_image;

      // Delete the old profile photo if it exists in the directorate
      let front_path = user_data?.profilePhoto;
      if (front_path != null) {
        fs.access(front_path, fs.F_OK, async (err) => {
          if (err) {
            console.error(err);
            return;
          }
          await this.imagehelper.unlinkFile(front_path);
        });
      }

      let insertQrys = {
        profilePhoto: user_image,
      };

      await this?.userModel?.update(insertQrys, {
        where: { id: user_data?.id },
      });

      return Util?.SuccessRespone(
        'User with this #${userId} and Image updated successfully',
      );
    } catch (error) {
      if (rollImage) {
        await this.imagehelper.unlinkFile(rollImage);
      }
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // delete User by Id
  async remove(userId: string) {
    try {
      const user = await User.findOne({ where: { userId } });
      if (!user) {
        throw new Error('User data not found.');
      }
      await this?.userModel?.destroy();
      return Util?.SuccessRespone('User deleted successfully.');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Restore Deleted Data
  async restoreUser(userId: string) {
    try {
      const organization = await this.userModel.restore({ where: { userId } });
      console.log(organization);
      return Util?.handleCreateSuccessRespone(
        'Organization restored successfully.',
      );
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Logout Organization
  async logout(logout: LogOutDTO) {
    const { password } = logout;
    try {
      const user = await User.findOne();

      if (!user) {
        return null; // User not found
      }

      const passwordMatches = await argon.verify(user.password, password);
      if (!passwordMatches) {
        return Util.handleFailResponse('Invalid password');
      }

      if (user?.isLogin === false)
        return Util?.handleFailResponse(
          'Organization/User account already logout ',
        );

      await User.update(
        { isLogin: false },
        { where: { password: user?.password } },
      );

      return Util?.handleCreateSuccessRespone('Logout successful');
    } catch (error) {
      console.log(error);
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }



  async getTokens(user_id: string, email: string, role: string) {
    const jwtPayload = {
      sub: user_id,
      email: email,
      scopes: role,
      role: role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        // expiresIn: '15m',
        expiresIn: '3d',
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

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { email } });
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { phoneNumber } });
  }

  async findByPassword(password: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { password } });
  }
}
