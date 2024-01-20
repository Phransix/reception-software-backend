import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { LoginDTO } from "src/guard/auth/loginDTO";
import { Delivery } from "src/modules/delivery/entities/delivery.entity";
import { Department } from "src/modules/department/entities/department.entity";
import { Designation } from "src/modules/designation/entities/designation.entity";
import { Enquiry } from "src/modules/enquiries/entities/enquiry.entity";
import { Guest } from "src/modules/guest/entities/guest.entity";
import { Notification } from "src/modules/notification/entities/notification.entity";
import { Purpose } from "src/modules/purpose/entities/purpose.entity";
import { Staff } from "src/modules/staff/entities/staff.entity";
import { User } from "src/modules/users/entities/user.entity";
import { VisitorLog } from "src/modules/visitor-logs/entities/visitor-log.entity";
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
      type: DataType.STRING,
      allowNull: true,
    })
    imageUrl:string;

    @Column({
      type : DataType.DATE,
      allowNull: true,
      defaultValue: null
    })
    deletedAt: Date

    @HasMany(() => User)
    users: User[];

    @HasMany(() => Delivery)
    deliveries: Delivery[];

    @HasMany(() => Enquiry)
    enquiries: Enquiry[];

    @HasMany(() => Guest)
    guests: Guest[];

    @HasMany(() => Department)
    department: Department[]

    @HasMany(() => Designation)
    designation: Designation[];

    @HasMany(() => Staff)
    staff: Staff[]

    @HasMany(() => Purpose)
    purpose: Purpose[]

    @HasMany(() => VisitorLog)
    visitorLog: VisitorLog[]

    @HasMany(() => Notification)
    notification: Notification[]

    
  static organizationName: any;

}
