import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min, MinLength, } from "class-validator";



export class CreatePokemonDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    name: string;
    
    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @Min(1)
    no:number
}
