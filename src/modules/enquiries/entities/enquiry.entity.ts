
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Guest } from "src/modules/guest/entities/guest.entity";
import { Organization } from "src/modules/organization/entities/organization.entity";
const { v4: uuidv4 } = require('uuid');

@Table({
  paranoid: true,
})
export class Enquiry extends Model<Enquiry>{

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
  enquiryId: string


  @ForeignKey(() => Organization)
  @Column({
    defaultValue: uuidv4,
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    references: {
      model: {
        tableName: 'Organization',
      },
      key: 'organizationId',
    },
    onDelete: 'CASCADE',
  })
  organizationId: string;
  @BelongsTo(() => Organization)
  organization: Organization


  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  visitorFullname: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  phoneNumber: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM,
    values: ['Official', 'Personal']
  })
  purpose: string;


  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  enquiryDescription: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null
  })
  deletedAt: Date

}
