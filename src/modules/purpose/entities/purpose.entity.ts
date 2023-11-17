import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Department } from "src/modules/department/entities/department.entity";
import { Guest } from "src/modules/guest/entities/guest.entity";
import { Organization } from "src/modules/organization/entities/organization.entity";
import { Staff } from "src/modules/staff/entities/staff.entity";
const { v4: uuidv4 } = require('uuid');

@Table({
    paranoid: true
})
export class Purpose extends Model <Purpose> {

    @Column({
        defaultValue: uuidv4,
        type: DataType.UUID,
        allowNull: false,
        unique: true
    })
    purposeId: string

    @ForeignKey(() => Guest)
    @Column({
        defaultValue: uuidv4,
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        references: {
            model: {
                tableName: 'Guests',
            },
            key: 'guestId',
        },
        onDelete: 'CASCADE',
    })
    guestId: string
    @BelongsTo(() => Guest,{
        foreignKey:'guestId',
        targetKey: 'guestId',
        as: 'guestData'
    })
    guest: Guest

    @ForeignKey(() => Organization)
    @Column({
        defaultValue: uuidv4,
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        references: {
            model: {
                tableName: 'Organizations',
            },
            key: 'organizationId',
        },
        onDelete: 'CASCADE',
    })
    organizationId: string
    @BelongsTo(() => Organization)
    organization: Organization

    @Column({
        type: DataType.ENUM,
        values: ['personal','official'],
        allowNull: false,
    })
    purpose: string;

    @ForeignKey(() => Department)
    @Column({
        defaultValue: uuidv4,
        type: DataType.STRING,
        allowNull: true,
        unique: true,
        references: {
            model: {
                tableName: 'Departments',
            },
            key: 'departmentId',
        },
        onDelete: 'CASCADE',
    })
    departmentId: string
    @BelongsTo(() => Department, {
        foreignKey:'departmentId',
        targetKey: 'departmentId',
        as: 'departmentData'
    })
    department: Department

    @ForeignKey(() => Staff)
    @Column({
        defaultValue: uuidv4,
        type: DataType.STRING,
        allowNull: true,
        unique: true,
        references: {
            model: {
                tableName: 'Staffs',
            },
            key: 'staffId',
        },
        onDelete: 'CASCADE',
    })
    staffId: string
    @BelongsTo(() => Staff, {
        foreignKey:'staffId',
        targetKey: 'staffId',
        as: 'staffData'
    }
    )
    staff: Staff

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    signInDate: Date

    @Column({
        type: DataType.TIME,
        allowNull: true
    })
    signInTime: string

    @Column({
        type: DataType.TIME,
        allowNull: true
    })
    signOutTime: string

    @Column({
        type: DataType.ENUM,
        values: ['Signed In', 'Signed Out'],
        allowNull: true,
    })
    visitStatus: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false
      })
      isLogOut: boolean;

      @Column({
        type : DataType.DATE,
        allowNull: true,
        defaultValue: null
      })
      deletedAt: Date


}
