/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateTeamDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(15)
    name:string

    
    @IsString()
    @IsNotEmpty()
    companyId:string



}
