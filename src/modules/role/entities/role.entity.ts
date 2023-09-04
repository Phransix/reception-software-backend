import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/modules/users/entities/user.entity";
const { v4: uuidv4 } = require('uuid');

@Table({
  paranoid: true,
})
export class Role extends Model<Role>{

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
      roleId: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
       type: DataType.STRING,
       defaultValue: true
    })
    status: string;

    @Column({
        type : DataType.DATE,
        allowNull: true,
        defaultValue: null
      })
      deletedAt: Date

   
}


