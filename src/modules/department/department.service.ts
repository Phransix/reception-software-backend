import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import * as Util from '../../utils/index'
import * as Abstract from '../../utils/abstract'
import { Op } from 'sequelize';

@Injectable()
export class DepartmentService {

  constructor (
    private sequelize: Sequelize,
    @InjectModel(Department) private readonly departmentModel: typeof Department

  ){}

  // Create New Department
  async create(createDepartmentDto: CreateDepartmentDto) {
   
    try {

      console.log(createDepartmentDto)
      await Abstract?.createData(Department,createDepartmentDto)
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Department created successfully.")

      
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Department registration failed')
    }

  };


// Get All Departments
  async findAll() {
    try {
      const data = await Department.findAll({
        attributes:{
          exclude:['createdAt','updatedAt','deletedAt']
        },
      })

      return Util?.handleSuccessRespone(data,"Departments Data retrieved successfully.")
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
    
  }


  // Get One Department By The departmentId
 async findOne(departmentId: string) {
    try {
      const data = await Department.findOne({
        attributes:{
          exclude:['createdAt','updatedAt','deletedAt']
        },
        where:{departmentId}});
    
        if(!data){
          return Util?.handleFailResponse('Department not found')
        }
        return Util?.handleSuccessRespone(data,"Department retrieve successfully.")
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

  
  }


  // Update Department By The departmentId
  async update(departmentId: string, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      const data = await Department.findOne({where:{departmentId}})
      if(!data){
        // throw new Error('Department not found.'); 
        return Util?.handleFailResponse(`Department with this #${departmentId} not found`)
      }
      
      Object.assign(data,updateDepartmentDto)
      await data.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,`Department with this #${departmentId} updated successfully`)

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
   
  }


  // Delete Department By The DepartmentId
 async remove(departmentId: string) {
    try {
      const data = await Department.findOne({where:{departmentId}})
      if(!data){
        return Util?.handleFailResponse(`Department with this #${departmentId} not found`)
      }

      Object.assign(data)
      await data.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,`Department with this #${departmentId}  deleted successfully`)

      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(`Department with this #${departmentId} not deleted `) 
    }
  }

   // Search Department By  Name
   async searchDepartment(keyword: string) {
    try {
      const deptData = await this?.departmentModel.findAll({

        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        },

        where: {
          departmentName : { [Op.like]: `%${keyword}%`, },
        }, 

      });

      if (!deptData || deptData.length === 0) {
        return Util?.handleFailResponse('No matching Department data found.');
      }

      return Util?.handleSuccessRespone(deptData, "Departments Data retrieved successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('The Department data does not exist')
    }
  }

}
