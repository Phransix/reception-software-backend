import { BelongsTo, Column, DataType, ForeignKey, Model } from "sequelize-typescript";
import { Department } from "src/modules/department/entities/department.entity";
import { Guest } from "src/modules/guest/entities/guest.entity";
import { Organization } from "src/modules/organization/entities/organization.entity";
import { Purpose } from "src/modules/purpose/entities/purpose.entity";
import { Staff } from "src/modules/staff/entities/staff.entity";
const { v4: uuidv4 } = require('uuid');

export class VisitorLog extends Model <VisitorLog>{

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number

    @Column({
        defaultValue: uuidv4,
        type: DataType.UUID,
        allowNull: false,
        unique: true
    })
    visitlogId: string

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
    @BelongsTo(() => Guest)
    guest: Guest

    @ForeignKey(() => Purpose)
    @Column({
        defaultValue: uuidv4,
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        references: {
            model: {
                tableName: 'Purposes',
            },
            key: 'purposeId',
        },
        onDelete: 'CASCADE',
    })
    purposeId: string
    @BelongsTo(() => Purpose)
    purposes: Purpose

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
    @BelongsTo(() => Department)
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
    @BelongsTo(() => Staff)
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

}
