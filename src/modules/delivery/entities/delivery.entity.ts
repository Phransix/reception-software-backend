import { Column, DataType, Model, Table } from "sequelize-typescript";


@Table
export class Delivery extends Model <Delivery> {

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    organization_Id: number;

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
    phonenumber: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    date_and_time: string

    @Column({
        type: DataType.ENUM,
        values: ['delivered','not delivered'],
        allowNull: false,
    })
    visit_Status: string;

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
    Delivery_Description: string

}
