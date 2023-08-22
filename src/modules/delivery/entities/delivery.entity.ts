// import { DataType } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Organization } from "src/modules/organization/entities/organization.entity";
const { v4: uuidv4 } = require('uuid');

@Table({
    paranoid: true,
  })
export class Delivery extends Model <Delivery> {

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
      deliveryId: string


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
        allowNull: false
    })
    from: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    to: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    phoneNumber: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    date_and_time: string

    @Column({
        type: DataType.ENUM,
        values: ['delivered','not delivered'],
        allowNull: false,
    })
    status: string;

    @Column({
        type: DataType.ENUM,
        values: ['food','document','other'],
        allowNull: false,
    })
    type: string

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    deliveryDescription: string

    @Column ({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null
    })
    deletedAt: Date

}
