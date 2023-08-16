import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Delivery } from "src/modules/delivery/entities/delivery.entity";
import { Enquiry } from "src/modules/enquiries/entities/enquiry.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Visitor } from "src/modules/visitor/entities/visitor.entity";
const { v4: uuidv4 } = require('uuid');

@Table
export class Organization extends Model<Organization>   {
    // static createAccessToken(user: Organization) {
    //   throw new Error('Method not implemented.');
    // }

    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
  })
  id: number

    @Column({
      defaultValue: uuidv4,
      type : DataType.UUID,
      allowNull: false,
      unique: true
    })
    organizationId: string
  
    @Column({
       type: DataType.STRING,
       allowNull: false
    })
    organizationName: string;

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
      type: DataType.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
    isVerified: boolean;


    @HasMany(() => User)
    users: User[];

    @HasMany(() => Visitor)
    visitors: Visitor[];

    @HasMany(() => Delivery)
    deliveries: Delivery[];

    @HasMany(() => Enquiry)
    enquiries: Enquiry[];

}
