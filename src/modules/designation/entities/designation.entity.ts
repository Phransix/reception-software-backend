import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Col } from "sequelize/types/utils";
import { Department } from "src/modules/department/entities/department.entity";
import { Organization } from "src/modules/organization/entities/organization.entity";
const { v4: uuidv4 } = require('uuid');




@Table({
    paranoid:true
})
export class Designation extends Model<Designation> {

@Column({
  type: DataType.INTEGER,
  allowNull: false,
  autoIncrement:true,
   primaryKey: true,
})
id:number;

@Column({
    defaultValue: uuidv4,
    type: DataType.UUID,
    allowNull: false,
    unique: true,
})
designationId:string;

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
   unique: true
})
designation_name:string

}
