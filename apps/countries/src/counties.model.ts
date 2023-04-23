import { ApiProperty } from "@nestjs/swagger";
import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface CountriesOfFilmsCreationAttr {
    id: number;
    country:string;
    movieid:number;
}

@Table({tableName: "countriesOfFilms", createdAt: false, updatedAt: false})
export class CountriesOfFilms extends Model<CountriesOfFilms, CountriesOfFilmsCreationAttr> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER,autoIncrement: true, unique: true, primaryKey: true})
    id: number;
    @Column({type: DataType.STRING})
    country:string;
    @Column({type: DataType.INTEGER})
    movieid:number;    
}