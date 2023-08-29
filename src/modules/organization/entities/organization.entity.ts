import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { LoginDTO } from "src/guard/auth/loginDTO";
import { Delivery } from "src/modules/delivery/entities/delivery.entity";
import { Department } from "src/modules/department/entities/department.entity";
// import { Document } from "src/modules/document/entities/document.entity";
import { Enquiry } from "src/modules/enquiries/entities/enquiry.entity";
// import { Food } from "src/modules/food/entities/food.entity";
import { Guest } from "src/modules/guest/entities/guest.entity";
// import { Other } from "src/modules/other/entities/other.entity";
import { Staff } from "src/modules/staff/entities/staff.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Visitor } from "src/modules/visitor/entities/visitor.entity";
const { v4: uuidv4 } = require('uuid');

@Table({
  paranoid: true,
})
export class Organization extends Model<Organization>  {
  

  static validateUser(loginDto: LoginDTO) {
    throw new Error('Method not implemented.');
  }

  

    static createAccessToken(user: Organization) {
      throw new Error('Method not implemented.');
    }

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
     type: DataType.STRING,
     allowNull: true
    })
    profilePhoto: string

    @Column({
      type: DataType.BOOLEAN,
      allowNull: true,
      defaultValue: false
    })
    isVerified: boolean;

    @Column({
      type : DataType.DATE,
      allowNull: true,
      defaultValue: null
    })
    deletedAt: Date

    @HasMany(() => User)
    users: User[];

    @HasMany(() => Visitor)
    visitors: Visitor[];

    @HasMany(() => Delivery)
    deliveries: Delivery[];

    @HasMany(() => Enquiry)
    enquiries: Enquiry[];

    @HasMany(() => Guest)
    guests: Guest[];

    // @HasMany(() => Food)
    // foods: Food[]

    // @HasMany(() => Document)
    // documents: Document[]

    // @HasMany(() => Other)
    // others: Other[]

    @HasMany(() => Department)
    department: Department[]

    @HasMany(() => Staff)
    staff: Staff[]

    
  static organizationName: any;

}
