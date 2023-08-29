import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Staff } from './entities/staff.entity';
import * as Util from '../../utils/index'
import * as Abstract from '../../utils/abstract'




@Injectable()
export class StaffService {

  constructor (@InjectModel(Staff) private staffModel: typeof Staff
  ){}

 async create(createStaffDto: CreateStaffDto) {
    try {
      await Abstract?.createData(Staff,createStaffDto);
      return Util?.handleCreateSuccessRespone( "Staff Created Successfully");
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

  
  }

  async findAll() {
    try {
      const staffs = await Staff.findAll({
          
      attributes:{
        exclude:['password','createdAt','updatedAt','deletedAt']
      },
      })
      return Util?.handleSuccessRespone(staffs, "Users Data retrieved successfully.")
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
   
  }

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


  async update(id: string, updateStaffDto: UpdateStaffDto) {
    try {
      const staff_data  = await this.staffModel.findOne({where:{id}})
      if(!staff_data){
        return Util?.handleFailResponse(`Staff with this #${id} not found`)
      }

      Object.assign(staff_data,updateStaffDto)
      await staff_data.save()
      return Util?.handleSuccessRespone(staff_data,`Staff with this #${id} not found`)
 
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse(`Staff with this #${id} not Updated`)
    }
  }


 async remove(id: string) {
  try {
    const staff = await Staff.findOne({where:{id}})
    if(!staff){
      return Util?.handleFailResponse(`Staff with this #${id} not found`)
    }

    Object.assign(staff)
    await staff.destroy()
    return Util?.handleSuccessRespone(Util?.SuccessRespone,"User deleted successfully.")

    
  } catch (error) {
    console.log(error)
    return Util?.handleFailResponse(`Staff with this #${id} not Deleted`)
  }
  }
}
