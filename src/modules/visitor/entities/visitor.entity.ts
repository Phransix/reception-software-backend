// import { Model } from "sequelize";
import { Column, DataType, Table ,Model} from "sequelize-typescript";

@Table
export class Visitor extends Model <Visitor> {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    purpose: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    phonenumber: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    date: string;

    @Column({
        type: DataType.ENUM,
        values: ['active','inactive'],
        allowNull: false,
    })
    status: string;
}