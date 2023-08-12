import { Inject, Injectable } from '@nestjs/common';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { Visitor } from './entities/visitor.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class VisitorService {

  constructor (@InjectModel(Visitor) private readonly VisitorModel: typeof Visitor) {}

  async create(createVisitorDto: CreateVisitorDto): Promise<Visitor>{
    return await this.VisitorModel.create<Visitor>(createVisitorDto)
  }

  
  async findAll() {
    return await this.VisitorModel.findAll<Visitor>({
      
    });
  }

  findOne(id: number) {
    return this.VisitorModel.findOne();
  }

  update(id: number, updateVisitorDto: UpdateVisitorDto) {
    return `This action updates a #${id} visitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitor`;
  }
}

// @Injectable()
// export class VisitorService {

//   constructor (@Inject(createData) private readonly CreateData: typeof Visitor ) {}

//   async create(visitor: CreateVisitorDto): Promise <Visitor> {
//     return await this.CreateData.create<Visitor>(visitor);
//   }

// }
