
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Organization } from "src/modules/organization/entities/organization.entity";


@Table
export class Enquiry extends Model<Enquiry>{

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
    name: string;

    @Column({
       type: DataType.STRING,
       allowNull:true
    })
    email:string;

    @Column({
      type: DataType.STRING,
      allowNull: false
    })
    phoneNumber: string;

    @Column({
      allowNull:false,
      type: DataType.ENUM,
      values: ['Official','Personal']
  })
  purpose: string;


     @Column({
       type: DataType.STRING,
       allowNull: false
     })
     enquiry_Description: string

    

}
