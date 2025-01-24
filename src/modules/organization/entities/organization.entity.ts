
import { Notification } from "src/modules/notification/entities/notification.entity";
import { User } from 'src/modules/users/entities/user.entity';
import { Delivery } from 'src/modules/delivery/entities/delivery.entity';
import { Enquiry } from 'src/modules/enquiries/entities/enquiry.entity';
import { Guest } from 'src/modules/guest/entities/guest.entity';
import { Department } from 'src/modules/department/entities/department.entity';
import { Designation } from 'src/modules/designation/entities/designation.entity';
import { Staff } from 'src/modules/staff/entities/staff.entity';
import { Purpose } from 'src/modules/purpose/entities/purpose.entity';
import { VisitorLog } from 'src/modules/visitor-logs/entities/visitor-log.entity';
import { Category, Status } from '../organization_ennum';
import { Column, DataType, HasMany, Model, Sequelize, Table } from "sequelize-typescript";
import { OnModuleInit } from "@nestjs/common";
const { v4: uuidv4 } = require('uuid');

@Table({
  tableName: 'Organizations',
  paranoid: true,
})
export class Organization extends Model implements OnModuleInit {
  public sequelize: Sequelize;

  onModuleInit() {
    this.sequelize = new Sequelize();
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
    type: DataType.ENUM,
    values: [
      Category.InformationTechnology,
      Category.Security,
      Category.FinanceAndBanking,
      Category.RealEstate,
      Category.ConsultingServices,
      Category.MarketingAndAdvertising,
      Category.Education,
      Category.Healthcare,
      Category.NonProfitCharity,
      Category.RetailAndECommerce,
      Category.Hospitality,
      Category.ManufacturingAndProduction,
      Category.GovernmentAndPublicSector,
      Category.TransportationAndLogistics,
      Category.EntertainmentAndMedia,
      Category.AgricultureAndFarming,
      Category.ConstructionAndInfrastructure,
      Category.EnergyAndUtilities,
      Category.ArtsAndCulture,
      Category.SportsAndRecreation,
      Category.Other,
    ],
    allowNull: false,
    defaultValue: Category.Other, // Adjust the default as needed
  })
  category: Category;
  

  @Column({
     type: DataType.STRING,
     allowNull: false
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  organization_phonenumber: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
   })
   number_of_branches: Number

   @Column({
    type: DataType.STRING,
    allowNull: true
   })
   profilePhoto: string

  @Column({
   type: DataType.STRING,
   allowNull: true
  })
  location: string

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
    type: DataType.ENUM,
    values: [
      Status?.Pending,
      Status?.Active,
      Status?.Inactive,
      Status?.Rejected,
      Status?.Deleted
    ],
    allowNull: false,
    defaultValue: Status?.Pending,
  })
  status: Status;

  @Column({
    type:DataType?.DATE,
    allowNull:false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  createdAt: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
    
  })
  updatedAt: Date;

  @Column({
    type : DataType.DATE,
    allowNull: true,
    defaultValue: null
  })
  deletedAt: Date

  @HasMany (() => User, {
    foreignKey: 'organizationId',
    sourceKey: 'organizationId',
    as: 'users',
  })
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
