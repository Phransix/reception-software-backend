import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/modules/users/entities/user.entity";


@Table
export class Organization extends Model<Organization>   {
  
    @Column({
       type: DataType.STRING,
       allowNull: false
    })
    organization_Name: string;

    @Column({
       type: DataType.STRING,
       allowNull: false
    })
    email: string;

    @Column({
      type: DataType.STRING,
      allowNull: false
    })
    phoneNumber: string

    @HasMany(() => User)
    users: User[];


}