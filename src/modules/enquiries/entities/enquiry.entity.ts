
import { Column, DataType, Model, Table } from "sequelize-typescript";


@Table
export class Enquiry extends Model<Enquiry>{
   
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
