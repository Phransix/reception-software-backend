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
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Department created successfully.")

      
    } catch (error) {
      console.log(error)
      return Util?.handleFailResponse('Department registration failed')
    }

  };



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
        return Util?.handleSuccessRespone(data,"Department retrieve successfully.")
      
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
        return Util?.handleFailResponse(`Department with this #${id} not found`)
      }
      
      Object.assign(data,updateDepartmentDto)
      await data.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,`Department with this #${id} updated successfully`)

    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
   
  }

 async remove(id: string) {
    try {
      const data = await Department.findOne({where:{id}})
      if(!data){
        return Util?.handleFailResponse(`Staff with this #${id} not found`)
      }

      Object.assign(data)
      await data.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,`Department with this #${id}  deleted successfully`)

      
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(`Department with this #${id} not deleted `) 
    }

  }
}
