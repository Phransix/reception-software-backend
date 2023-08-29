// import { Model } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Table ,Model} from "sequelize-typescript";
import { Department } from "src/modules/department/entities/department.entity";
import { Organization } from "src/modules/organization/entities/organization.entity";
const { v4: uuidv4 } = require('uuid');


@Table({
    paranoid: true,
})
export class Staff extends Model<Staff>{

 
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
        unique: true
      })
      staffId: string;


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
     @BelongsTo(() => Organization)
     organization: Organization;


     @ForeignKey(() => Department)
     @Column({
       defaultValue: uuidv4,
         type: DataType.STRING,
         allowNull: false,
         unique:true,
         references: {
           model: {
             tableName: 'Department',
           },
           key: 'departmentId',
         },
         onDelete: 'CASCADE',
     })
     departmentId: string;
      @BelongsTo(() => Department)
      department: Department;


      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      fullName: string;

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
       profilePhoto: string;
}
