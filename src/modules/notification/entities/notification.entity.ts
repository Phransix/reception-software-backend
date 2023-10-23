import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Guest } from "src/modules/guest/entities/guest.entity";
import { Organization } from "src/modules/organization/entities/organization.entity";
import { Purpose } from "src/modules/purpose/entities/purpose.entity";
const { v4: uuidv4 } = require('uuid')

@Table({
    paranoid: true
})
export class Notification extends Model <Notification>{
    @Column({
        defaultValue: uuidv4,
        type: DataType.UUID,
        allowNull: false,
        unique: true
    })
    socketId: string


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
        type: DataType.STRING,
        allowNull: false
    })
    type: string

    @Column({
        type: DataType.STRING,
        allowNull: false
     })
     message: string

     @Column({
        type: DataType.STRING,
        allowNull: false
    })
    status: string

    @Column({
        type : DataType.DATE,
        allowNull: true,
        defaultValue: null
      })
      deletedAt: Date

}
