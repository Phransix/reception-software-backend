import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateStaffImgDto } from './dto/create-staffImg.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Staff } from './entities/staff.entity';
import * as Util from '../../utils/index'
import { staffImageUploadProfile } from 'src/helper/staffProfiles';
import { Op } from 'sequelize';
// import * as fs from 'fs';
const fs = require('fs')




@Injectable()
export class StaffService {

  constructor(@InjectModel(Staff) private staffModel: typeof Staff,
    private staffImgHelper: staffImageUploadProfile
  ) { }

  // Create New Staff
  async create(createStaffDto: CreateStaffDto) {
    try {

      var image_matches = createStaffDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      )
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file')
      }

      let staff_image = await this?.staffImgHelper?.uploadStaffImage(createStaffDto?.profilePhoto)

      let insertQry = {

        organizationId: createStaffDto?.organizationId,
        organizationName:createStaffDto?.organizationName,
        departmentId: createStaffDto?.departmentId,
        departmentName: createStaffDto?.departmentName,
        title: createStaffDto?.title,
        fullName: createStaffDto?.fullName,
        email: createStaffDto?.email,
        phoneNumber: createStaffDto?.phoneNumber,
        gender: createStaffDto?.gender,
        role: createStaffDto?.role,
        profilePhoto: staff_image

      }
      console.log(insertQry)

      await this.staffModel?.create({ ...insertQry })
      // await Abstract?.createData(Staff,createStaffDto);
      return Util?.handleCreateSuccessRespone("Staff Created Successfully");

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  };


  // Get All Staffs
  async findAll() {
    try {
      const staffs = await Staff.findAll({

        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
        },
      })
      console.log(staffs)
      return Util?.handleSuccessRespone(staffs, "Staffs Data retrieved successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get Staff By The Id
  async findOne(staffId: string) {
    try {
      const staff = await Staff.findOne({
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
        },
        where: { staffId }
      })

      if (!staff) {
        return Util?.handleFailResponse(`Staff with this #${staffId} not found`)
      }

      return Util?.handleSuccessRespone(staff, "Staffs Data retrieved successfully.")

    } catch (error) {
      console.log(error)
      return Util?.getTryCatchMsg(error)
    }

  }

  // Update Staff By The Id
  async update(staffId: string, updateStaffDto: UpdateStaffDto) {
    let rollImage = '';

    try {
      const staff_data = await this.staffModel.findOne({ where: { staffId } })
      if (!staff_data) {
        return Util?.handleFailResponse(`Staff with this #${staffId} not found`)
      }

      var image_matches = updateStaffDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      )
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file')
      }

      let staff_image = await this?.staffImgHelper?.uploadStaffImage(updateStaffDto?.profilePhoto)
      rollImage = staff_image

       // Delete the old profile photo if it exists in the directorate
       let front_path =staff_data?.profilePhoto
 
       if(front_path != null){
         fs.access(front_path, fs.F_OK, async (err) => {
           if (err) {
             console.error(err)
             return
           }
           await this.staffImgHelper.unlinkFile(front_path); 
         })
       }

      let insertQry = {
        organizationId: updateStaffDto?.organizationId,
        organizationName:updateStaffDto?.organizationName,
        departmentId: updateStaffDto?.departmentId,
        departmentName: updateStaffDto?.departmentName,
        title: updateStaffDto?.title,
        fullName: updateStaffDto?.fullName,
        email: updateStaffDto?.email,
        phoneNumber: updateStaffDto?.phoneNumber,
        gender: updateStaffDto?.gender,
        role: updateStaffDto?.role,
        profilePhoto: staff_image

      }

      await this?.staffModel?.update(insertQry,
        {
          where: { id: staff_data?.id }
        })

      return Util?.SuccessRespone(`Staff with this #${staffId} updated successfully`)

    } catch (error) {
       if (rollImage) {
        await this?.staffImgHelper?.unlinkFile(rollImage)
      }
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  // Update Staff Profile Photo By The Id
  async updateImg(staffId: string, createStaffImgDto: CreateStaffImgDto) {
    let rollImage = '';
    try {
      const staff_data = await this.staffModel.findOne({ where: { staffId } })
      if (!staff_data) {
        return Util?.handleFailResponse(`Staff with this #${staffId} not found`)
      }

      if (
        createStaffImgDto?.profilePhoto == null ||
        createStaffImgDto?.profilePhoto == undefined ||
        createStaffImgDto?.profilePhoto == ""
      ) {
        return Util?.handleFailResponse('File Can not be empty')
      }

      var image_matches = createStaffImgDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      )
      if (!image_matches) {
        return Util?.handleFailResponse('Invalid Input file')
      }

      let staff_image = await this?.staffImgHelper?.uploadStaffImage(createStaffImgDto?.profilePhoto)

      rollImage = staff_image

        // Delete the old profile photo if it exists in the directorate
        let front_path =staff_data?.profilePhoto
 
            if(front_path != null){
              fs.access(front_path, fs.F_OK, async (err) => {
                if (err) {
                  console.error(err)
                  return
                }
                await this.staffImgHelper.unlinkFile(front_path); 
              })
            }

    
      let insertQry = {
        profilePhoto: staff_image
      }

      await this?.staffModel?.update(insertQry,
        {
          where: { id: staff_data?.id }
        })

      return Util?.handleCreateSuccessRespone(`Staff with this #${staffId} and Image updated successfully`)

    } catch (error) {
      if (rollImage) {
        await this?.staffImgHelper?.unlinkFile(rollImage)
      }
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Delete Staff By The Id
  async remove(staffId: string) {
    try {
      const staff = await Staff.findOne({ where: { staffId } })
      if (!staff) {
        return Util?.handleFailResponse(`Staff with this #${staffId} not found`)
      }

      Object.assign(staff)
      await staff.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone, `Staff with this #${staffId}  deleted successfully`)


    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Search Staff by FullName 
  async searchStaff(keyword: string) {
    try {
      const staffData = await this?.staffModel.findAll({

        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        },

        where: {
          fullName: { [Op.like]: `%${keyword}%`, },
        },

      });

      if (!staffData || staffData.length === 0) {
        return Util?.handleFailResponse('No matching Staff data found.');
      }

      return Util?.handleSuccessRespone(staffData, "Staffs Data retrieved successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleGrpcTryCatchError(Util?.getTryCatchMsg(error));
    }
  }


  async findOneByEmail(email: string): Promise<Staff> {
    return await this.staffModel.findOne<Staff>({ where: { email } })
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<Staff> {
    return await this.staffModel.findOne<Staff>({ where: { phoneNumber } })
  }


}
