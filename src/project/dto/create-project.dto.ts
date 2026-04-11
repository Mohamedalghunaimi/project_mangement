/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Priority, ProjectStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength, MinDate, MinLength } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(15)
    name!:string

    @IsNotEmpty()
    @IsString()
    @MinLength(15)
    description!:string
    

    @IsEnum(ProjectStatus)
    status!:ProjectStatus
 
    

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    @MinDate(new Date())
    startDate!:Date

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    @MinDate(new Date())
    endDate!:Date


    @IsString()
    @IsNotEmpty()
    @IsUUID()
    teamId!:string

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    companyId!:string

}
