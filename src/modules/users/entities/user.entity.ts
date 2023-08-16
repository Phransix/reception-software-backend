import sequelize from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey,Model, Table } from "sequelize-typescript";
import { Organization } from "src/modules/organization/entities/organization.entity";
import { Role } from "src/modules/role/entities/role.entity";
const { v4: uuidv4 } = require('uuid');

@Table
export class User extends Model<User> {
  static save(user: User) {
    throw new Error('Method not implemented.');
  }
  hash(hash: any) {
    throw new Error('Method not implemented.');
  }

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
// })
// id: number

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
    password: string;


}
