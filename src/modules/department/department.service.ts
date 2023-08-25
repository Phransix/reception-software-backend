import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import * as Util from '../../utils/index'
import * as Abstract from '../../utils/abstract'

@Injectable()
export class DepartmentService {

  constructor (
    private sequelize: Sequelize,
    @InjectModel(Department) private readonly departmentModel: typeof Department

  ){}

  async create(createDepartmentDto: CreateDepartmentDto) {
   
    try {

      console.log(createDepartmentDto)
      await Abstract?.createData(Department,createDepartmentDto)
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Enquiry created successfully.")

      
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Enquiry registration failed')
    }

  };



  async findAll() {
    try {
      const data = await Department.findAll({
        attributes:{
          exclude:['createdAt','updatedAt','deletedAt']
        },
      })

      return Util?.handleSuccessRespone(data,"Enquiries Data retrieved successfully.")
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
    
  }

 async findOne(id: string) {
    try {
      const data = await Department.findOne({
        attributes:{
          exclude:['createdAt','updatedAt','deletedAt']
        },
        where:{id}});
    
        if(!data){
          return Util?.handleFailResponse('Department not found')
        }
        return Util?.handleSuccessRespone(data,"Enquiry retrieve successfully.")
      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }

  
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      const data = await Department.findOne({where:{id}})
      if(!data){
        // throw new Error('Department not found.'); 
        return Util?.handleFailResponse('Department not found')
      }
      
      Object.assign(data,updateDepartmentDto)
      await data.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Department updated successfully.")

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
   
  }

 async remove(id: string) {
    try {
      const data = await Department.findOne({where:{id}})
      if(!data){
        return Util?.handleFailResponse('Department not found')
      }

      Object.assign(data)
      await data.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Department deleted successfully.")

      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error)) 
    }

  }
}
