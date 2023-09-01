import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Unit } from './entities/unit.entity';
// import { Food } from '../food/entities/food.entity';
// import { UnitController } from './unit.controller';

@Module({
  imports: [SequelizeModule.forFeature([Unit])],
  // controllers: [UnitController],
  providers: [UnitService]
})
export class UnitModule {}
