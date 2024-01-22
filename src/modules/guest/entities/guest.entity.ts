import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Organization } from "src/modules/organization/entities/organization.entity";
import { VisitorLog } from "src/modules/visitor-logs/entities/visitor-log.entity";
const { v4: uuidv4 } = require('uuid');

@Table({
    paranoid: true
})
export class Guest extends Model<Guest>{
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    })
    id: number

    @Column({
        defaultValue: uuidv4,
        type: DataType.UUID,
        allowNull: false,
        unique: true
    })
    guestId: string

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
        type: DataType.STRING,
        allowNull: false
    })
    firstName: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    lastName: string

    @Column({
        type: DataType.ENUM,
        values: ['male', 'female'],
        allowNull: false
    })
    gender: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    countryCode: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    phoneNumber: string

    @Column({
        type: DataType.ENUM,
        values: ['pending', 'active'],
        allowNull: false
    })
    guestStatus: string

    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null
    })
    deletedAt: Date

    @HasMany(() => VisitorLog)
    visitorLog: VisitorLog[]


}
