import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Guest } from "src/modules/guest/entities/guest.entity";
import { Organization } from "src/modules/organization/entities/organization.entity";
import { Unit } from "src/modules/unit/entities/unit.entity";
import { CreateDeliveryDto } from "../dto/create-delivery.dto";
import moment from "moment";
const { v4: uuidv4 } = require('uuid');



@Table({
    paranoid: true,
  })
export class Delivery extends Model <Delivery> {
  static findByDateRange(startDate: Date, endDate: Date) {
    throw new Error('Method not implemented.');
  }

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

      @ForeignKey(() => Unit)
      @Column({
        defaultValue: uuidv4,
          type: DataType.STRING,
          allowNull: true,
          unique:true,
          references: {
            model: {
              tableName: 'Units',
            },
            key: 'unitId',
          },
          onDelete: 'CASCADE',
      })
      unitId: string;
       @BelongsTo(() => Unit,{
        foreignKey: 'unitId',
        targetKey: 'unitId',
        as: 'deliveryUnit'
       })
       unit: Unit

      @ForeignKey(() => Organization)
      @Column({
        defaultValue: uuidv4,
          type: DataType.STRING,
          allowNull: false,
          unique:true,
          references: {
            model: {
              tableName: 'Organizations',
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
    receipientName: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    receipientPhoneNumber: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string

    @Column({
        type: DataType.ENUM,
        values: ['delivered','awaiting_pickup'],
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
    itemQuantity: string

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    documentTitle: string

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    itemName: string

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    itemDescription: string

    @Column ({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null
    })
    deletedAt: Date
    

}
