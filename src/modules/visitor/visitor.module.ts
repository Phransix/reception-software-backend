import { Module } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { createData } from 'src/utils/abstract';
import { SequelizeModule } from '@nestjs/sequelize';
import { Visitor } from './entities/visitor.entity';

@Module({
  imports: [SequelizeModule.forFeature([Visitor])],
  controllers: [VisitorController],
  providers: [VisitorService]
})
export class VisitorModule {}
