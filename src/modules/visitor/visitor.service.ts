import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as Abstract from '../../utils/abstract'
import * as Util from '../../utils/index'
@Injectable()
export class VisitorService {
  Visitor: any;

  constructor(
    private sequelize: Sequelize,
    @InjectModel(Visitor) private readonly VisitorModel: typeof Visitor) { }

  async create(createVisitorDto: CreateVisitorDto) {
    try {
      await Abstract?.createData(Visitor, createVisitorDto);
      return Util?.handleCreateSuccessRespone(Util?.SuccessRespone,"Visitor Created Successfully");
    } catch (error) {
      console.error(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }


  async findAll() {
    try {
      const visitors = await Visitor.findAll()
      return Util?.handleSuccessRespone(visitors,"Visitors Data retrieved successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  };

  async findOne(id: number) {
    try {
      const visitor = await Visitor.findOne({where:{id}});
      if (!visitor) {
        throw new NotAcceptableException('The visitor does not exist')
      }
      return Util?.handleSuccessRespone(visitor,"Visitor Data retrieval success");
      // return visitor
    } catch (error) {
      console.log(error);
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  async update(id: number, updateVisitorDto: UpdateVisitorDto) {
    // return `This action updates a #${id} visitor`;
    try {
      const visitor = await Visitor.findOne({where:{ id }});
      if (!visitor){
        throw new NotAcceptableException('Visitor not found')
      }
      Object.assign(visitor, updateVisitorDto)
      await visitor.save()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Visitor Data updated Successfully");
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  };

  async remove(id: number) {
    // return `This action removes a #${id} visitor`;
    try {
      const visitor = await Visitor.findOne({where: { id }});
      if(!visitor) {
        throw new NotAcceptableException("Visitor not found");
      }
      Object.assign(visitor)
      await visitor.destroy()
      return Util?.handleSuccessRespone(Util?.SuccessRespone,"Visitor Deleted Successfully")
    } catch (error) {
      console.log(error)
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error));
    }
  }
}

