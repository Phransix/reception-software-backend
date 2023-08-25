import sequelize from "sequelize";
import { BeforeCreate, BelongsTo, Column, DataType, ForeignKey,Model, Table } from "sequelize-typescript";
import { LoginDTO } from "src/guard/auth/loginDTO";
import { Organization } from "src/modules/organization/entities/organization.entity";
import { Role } from "src/modules/role/entities/role.entity";
const { v4: uuidv4 } = require('uuid');
import * as bcrypt from 'bcrypt';

@Table({
  paranoid: true,
})
export class User extends Model<User> {

  static validateUser(loginDto: LoginDTO) {
    throw new Error('Method not implemented.');
  }
 


  @Column({
    defaultValue: uuidv4,
    type: DataType.UUID,
    allowNull: false,
    unique: true
  })
  userId: string

    
  @ForeignKey(() => Role)
    @Column({
      defaultValue: uuidv4,
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        references: {
          model: {
            tableName: 'Role',
          },
          key: 'roleId',
        },
        onDelete: 'CASCADE',
    })
    roleId: string;
     @BelongsTo(() => Role)
     role: Role


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
     organization: Organization


    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
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

    //  @Column({
    //   type: DataType.BOOLEAN,
    //   allowNull: true,
    //   defaultValue: false
    // })
    // isVerified: boolean;

     @Column({
      type: DataType.STRING,
        allowNull: true
    })
    password: string;

    @Column({
      type : DataType.DATE,
      allowNull: true,
      defaultValue: null
    })
    deletedAt: Date


    
   
    // @BeforeCreate
    // static async hashPassword(instance: User) {
    //   const saltRounds = 10;
    //   const hashedPassword = await bcrypt.hash(instance.password, saltRounds);
    //   instance.password = hashedPassword;
    // }
      
   

 

}
