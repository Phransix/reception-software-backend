
import {  BelongsTo, Column, DataType, ForeignKey,Model, Table } from "sequelize-typescript";
import { LoginDTO } from "src/guard/auth/loginDTO";
import { Organization } from "src/modules/organization/entities/organization.entity";
const { v4: uuidv4 } = require('uuid');
import { UserRole } from "src/modules/role/role.enum";

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

    
  // @ForeignKey(() => Role)
  //   @Column({
  //     defaultValue: uuidv4,
  //       type: DataType.STRING,
  //       allowNull: false,
  //       unique: true,
  //       references: {
  //         model: {
  //           tableName: 'Role',
  //         },
  //         key: 'roleId',
  //       },
  //       onDelete: 'CASCADE',
  //   })
  //   roleId: string;
  //    @BelongsTo(() => Role)
  //    role: Role


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

   
  //   @Column({
  //     type: DataType.ENUM,
  //     values: ['Admin','Receptionist'],
  //     defaultValue: 'Admin',
  //     allowNull: false,
  // })
  // roleNames: string;

  @Column({
    type:DataType.ENUM,
    // enum: UserRole,
    values: ['Admin','Receptionist'],
    defaultValue: UserRole.Admin
  })
  roleName: UserRole;

  // @Column({type: 'enum', enum: UserRole, default: UserRole.Admin})
  // roleName: UserRole;


  

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

   

      
   

 

}
