
import { BelongsTo, Column, DataType, ForeignKey, Table,Model, HasMany } from "sequelize-typescript";
import { Organization } from "src/modules/organization/entities/organization.entity";
import { Purpose } from "src/modules/purpose/entities/purpose.entity";
import { Staff } from "src/modules/staff/entities/staff.entity";
import { VisitorLog } from "src/modules/visitor-logs/entities/visitor-log.entity";
const { v4: uuidv4 } = require('uuid');



@Table({
    paranoid:true,
})
export class Department extends Model<Department> {

@Column({
    defaultValue: uuidv4,
    type: DataType.UUID,
    allowNull:false,
    unique: true

})departmentId: string;



@ForeignKey(() => Organization)
@Column({
  defaultValue: uuidv4,
    type: DataType.STRING,
    allowNull: false,
    unique:true,
    references: {
      model: {
        tableName: 'Organization',
      },
      key: 'organizationId',
    },
    onDelete: 'CASCADE',
})
organizationId: string;
 @BelongsTo(() => Organization,{
foreignKey : 'organizationId',
targetKey : 'organizationId',
as: 'Organization',
 })
 organization :Organization;


   @Column({
    type: DataType.STRING,
    allowNull: false,
   })
   departmentName: string;

   @Column({
    type: DataType.STRING,
    allowNull: false
   })
   departmentRoomNum: string;


   @Column({
    type: DataType.STRING,
    allowNull: true
   })
   profilePhoto: string;

   @HasMany(() => Staff)
   staff: Staff[]

   @HasMany(() => Purpose)
   purpose: Purpose[]

   @HasMany(() => VisitorLog)
   visitorLog: VisitorLog[]

}
