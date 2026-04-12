/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateTeamDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(15)
    @ApiProperty({name:"name",type:"string",required:true,description:"name of the team"})
    name!:string

    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({name:"companyId",type:"string",required:true,description:"companyId for the team"})
    companyId!:string



}
