import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Organization } from "src/modules/organization/entities/organization.entity";
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
        type: DataType.DATEONLY,
        allowNull: true,
        defaultValue: null
    })
    signInDate: Date

    @Column({
        type: DataType.TIME,
        allowNull: true,
        defaultValue: null
    })
    signInTime: string

    @Column({
        type: DataType.TIME,
        allowNull: true,
        defaultValue: null
    })
    signOutTime: string

    @Column({
        type: DataType.ENUM,
        values: ['Signed In', 'Signed Out'],
        allowNull: true,
    })
    visitStatus: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null
    })
    deletedAt: Date


}


