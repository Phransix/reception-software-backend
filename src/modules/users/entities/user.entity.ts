import sequelize from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Organization } from "src/modules/organization/entities/organization.entity";

@Table
export class User extends Model<User> {
  static save(user: User) {
    throw new Error('Method not implemented.');
  }
  hash(hash: any) {
    throw new Error('Method not implemented.');
  }

    @ForeignKey(() => Organization)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    organization_Id: number;
     @BelongsTo(() => Organization)
     organization: Organization


    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    fullname: string;

    @Column({
      type: DataType.STRING,
        allowNull: false
    })
    email: string;

     @Column({
      type: DataType.STRING,
        allowNull: false
    })
    phoneNumber: string;

     @Column({
      type: DataType.STRING,
        allowNull: true
    })
    password: string;


}
