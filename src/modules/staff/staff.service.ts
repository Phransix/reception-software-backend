import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateStaffImgDto } from './dto/create-staffImg.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Staff } from './entities/staff.entity';
import * as Util from '../../utils/index'
import { staffImageUploadProfile } from 'src/helper/staffProfiles';
import * as Abstract from '../../utils/abstract'




@Injectable()
export class StaffService {

  constructor (@InjectModel(Staff) private staffModel: typeof Staff,
         private staffImgHelper: staffImageUploadProfile
  ){}

  // Create New Staff
 async create(createStaffDto: CreateStaffDto) {
    try {

      var image_matches = createStaffDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      )
      if(!image_matches){
        return Util?.handleFailResponse('Invalid Input file')
      }

      let staff_image = await this?.staffImgHelper?.uploadStaffImage(createStaffDto?.profilePhoto)
       
      let insertQry = {
        
        organizationId:createStaffDto?.organizationId,
        departmentId: createStaffDto?.departmentId,
        title: createStaffDto?.title,
        fullName: createStaffDto?.fullName,
        email: createStaffDto?.email,
        phoneNumber: createStaffDto?.phoneNumber,
        gender: createStaffDto?.gender,
        role:createStaffDto?.role,
        profilePhoto: staff_image
        
      }
      console.log(insertQry)
         
       await this.staffModel?.create({...insertQry})
      // await Abstract?.createData(Staff,createStaffDto);
      return Util?.handleCreateSuccessRespone( "Staff Created Successfully");
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };


  // Get All Staffs
  async findAll() {
    try {
      const staffs = await Staff.findAll({
          
      attributes:{
        exclude:['password','createdAt','updatedAt','deletedAt']
      },
      })
      console.log(staffs)
      return Util?.handleSuccessRespone(staffs, "Staffs Data retrieved successfully.")
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  }

  // Get Staff By The Id
  async findOne(id: string) {
    try {
      const staff = await Staff.findOne({
        attributes:{
          exclude:['password','createdAt','updatedAt','deletedAt']
        },
         where: { id }
      })

      if(!staff){
        return Util?.handleFailResponse(`Staff with this #${id} not found`)
      }
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
    
  }

// Update Staff By The Id
  async update(id: string, updateStaffDto: UpdateStaffDto) {
    let rollImage = '';

    try {
      const staff_data  = await this.staffModel.findOne({where:{id}})
      if(!staff_data){
        return Util?.handleFailResponse(`Staff with this #${id} not found`)
      }

      var image_matches = updateStaffDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      )
      if(!image_matches){
        return Util?.handleFailResponse('Invalid Input file')
      }

      let staff_image = await this?.staffImgHelper?.uploadStaffImage(updateStaffDto?.profilePhoto)
      rollImage = staff_image

      let insertQry = {
        organizationId:updateStaffDto?.organizationId,
        departmentId: updateStaffDto?.departmentId,
        title: updateStaffDto?.title,
        fullName: updateStaffDto?.fullName,
        email: updateStaffDto?.email,
        phoneNumber: updateStaffDto?.phoneNumber,
        gender: updateStaffDto?.gender,
        role:updateStaffDto?.role,
        profilePhoto: staff_image
        
      }

      await this?.staffModel?.update(insertQry,
        {
          where:{id:staff_data?.id}
        })

      return Util?.handleCreateSuccessRespone(`Staff with this #${id} updated successfully`)
 
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse(`Staff with this #${id} not Updated`)
    }
  }


// Update Staff Profile Photo By The Id
  async updateImg(id: string, createStaffImgDto: CreateStaffImgDto) {
    let rollImage = '';
    try {
      const staff_data  = await this.staffModel.findOne({where:{id}})
      if(!staff_data){
        return Util?.handleFailResponse(`Staff with this #${id} not found`)
      }

      if (
              createStaffImgDto?.profilePhoto == null ||
              createStaffImgDto?.profilePhoto == undefined ||
              createStaffImgDto?.profilePhoto == ""
            ){
              return Util?.handleFailResponse('File Can not be empty')
            }

      var image_matches = createStaffImgDto?.profilePhoto?.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      )
      if(!image_matches){
        return Util?.handleFailResponse('Invalid Input file')
      }

      let staff_image = await this?.staffImgHelper?.uploadStaffImage(createStaffImgDto?.profilePhoto)

      rollImage = staff_image
       
      let insertQry = {
        profilePhoto: staff_image  
      }
      
       await this?.staffModel?.update(insertQry,
        {
          where:{id:staff_data?.id}
        })

      return Util?.handleCreateSuccessRespone(`Staff with this #${id} and Image updated successfully`)
 
    } catch (error) {
      if(rollImage){
        await this?.staffImgHelper?.unlinkFile(rollImage)
      }
      return Util?.handleFailResponse(`Staff with this #${id} and Image not Updated`)
    }
  }

// Delete Staff By The Id
 async remove(id: string) {
  try {
    const staff = await Staff.findOne({where:{id}})
    if(!staff){
      return Util?.handleFailResponse(`Staff with this #${id} not found`)
    }

    Object.assign(staff)
    await staff.destroy()
    return Util?.handleSuccessRespone(Util?.SuccessRespone,`Staff with this #${id}  deleted successfully`)

    
  } catch (error) {
    console.log(error)
    return Util?.handleFailResponse(`Staff with this #${id} not Deleted`)
  }
  }
}
