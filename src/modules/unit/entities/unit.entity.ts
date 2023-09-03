import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Delivery } from "src/modules/delivery/entities/delivery.entity";
const { v4: uuidv4 } = require('uuid');

@Table({
    paranoid: true,
  })
export class Unit extends Model <Unit>{
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @Column({
        defaultValue: uuidv4,
        type: DataType.UUID,
        allowNull: false,
        unique: true
      })
      unitId: string

      @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        defaultValue: true
     })
     shortName: string;
 
     @Column({
         type : DataType.DATE,
         allowNull: true,
         defaultValue: null
       })
       deletedAt: Date

        @HasMany(() => Delivery)
        deliveries: Delivery[]
}


