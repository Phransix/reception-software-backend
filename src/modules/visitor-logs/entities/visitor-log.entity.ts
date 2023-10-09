import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Guest } from "src/modules/guest/entities/guest.entity";
import { Purpose } from "src/modules/purpose/entities/purpose.entity";
const { v4: uuidv4 } = require('uuid');

@Table({
    paranoid: true
})
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

    // @ForeignKey(() => Guest)
    // @Column({
    //     defaultValue: uuidv4,
    //     type: DataType.STRING,
    //     allowNull: false,
    //     unique: true,
    //     references: {
    //         model: {
    //             tableName: 'Guests',
    //         },
    //         key: 'guestId',
    //     },
    //     onDelete: 'CASCADE',
    // })
    // guestId: string
    // @BelongsTo(() => Guest)
    // guest: Guest

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
    purpose: Purpose

    @Column({
        type : DataType.DATE,
        allowNull: true,
        defaultValue: null
      })
      deletedAt: Date
}
