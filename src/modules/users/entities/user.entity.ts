import {
  BeforeValidate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { LoginDTO } from 'src/guard/auth/loginDTO';
import { Organization } from 'src/modules/organization/entities/organization.entity';
const { v4: uuidv4 } = require('uuid');
import { Role } from 'src/modules/role/role.enum';
const { Sequelize, DataTypes } = require('sequelize');

@Table({
  paranoid: true,
})
export class User extends Model<User> {
  static validateUser(loginDto: LoginDTO) {
    throw new Error('Method not implemented.');
  }

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
  userId: string;

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
    type: 'enum',
    values: Object.values(Role),
    defaultValue: Role?.Receptionist,
  })
  roleName: Role;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profilePhoto: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isLogin: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  deletedAt: Date;

  role: Role[];

  @BeforeValidate
  static async validateUserInfo(instance: User, options: any): Promise<void> {
    if (options.fields.includes('email', 'phoneNumber')) {
      if (instance) {
        throw new Error(`Account has been deactivated`);
      }
    }
  }
}

