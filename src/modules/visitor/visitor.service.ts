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
    return await this.VisitorModel.findAll<Visitor>({
    });
  }

  async findOne(id: number) {
    try {
      let visitor = this.VisitorModel.findOne({where:{id}});
      if (!visitor) {
        throw new NotAcceptableException('The visitor does not exist')
      }
      // return Util?.handleCreateSuccessRespone(visitor,"Visitor retrieval success");
      return visitor
    } catch (error) {
      console.log(error);
      return Util?.handleTryCatchError(Util?.getTryCatchMsg(error))
    }
  }

  update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitor`;
  }
}

