// import { Model } from "sequelize";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
  HasMany,
} from 'sequelize-typescript';
import { Department } from 'src/modules/department/entities/department.entity';
import { Organization } from 'src/modules/organization/entities/organization.entity';
import { Purpose } from 'src/modules/purpose/entities/purpose.entity';
import { VisitorLog } from 'src/modules/visitor-logs/entities/visitor-log.entity';
const { v4: uuidv4 } = require('uuid');

@Table({
  paranoid: true,
})
export class Staff extends Model<Staff> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    defaultValue: uuidv4,
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  staffId: string;

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
  @BelongsTo(() => Organization, {
    foreignKey: 'organizationId',
    targetKey: 'organizationId',
    as: 'Organization',
  })
  organization: Organization;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  organizationName: string;

  @ForeignKey(() => Department)
  @Column({
    defaultValue: uuidv4,
    type: DataType.STRING,
    allowNull: true,
    unique: true,
    references: {
      model: {
        tableName: 'Department',
      },
      key: 'departmentId',
    },
    onDelete: 'CASCADE',
  })
  departmentId: string;
  @BelongsTo(() => Department, {
    foreignKey: 'departmentId',
    targetKey: 'departmentId',
    as: 'Department',
  })
  department: Department;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  departmentName: string;

  @Column({
    allowNull: true,
    type: DataType.ENUM,
    values: ['Mr', 'Mrs', 'Prof', 'Dr'],
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profilePhoto: string;

  @HasMany(() => VisitorLog)
  visitorLog: VisitorLog[];
}
