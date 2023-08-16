// import { Model } from "sequelize";
import { Column, DataType, Table ,Model, ForeignKey, BelongsTo} from "sequelize-typescript";
import { Organization } from "src/modules/organization/entities/organization.entity";
const { v4: uuidv4 } = require('uuid');


@Table
export class Visitor extends Model <Visitor> {

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
      visitorId: string


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
    visitor: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    phoneNumber: string

    @Column({
        type: DataType.ENUM,
        values: ['personal','unofficial'],
        allowNull: false,
    })
    purpose: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    host: string;

    @Column({
        type: DataType.ENUM,
        values: ['active','inactive'],
        allowNull: false,
    })
    visitStatus: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    date: string;
}