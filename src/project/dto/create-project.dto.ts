/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Priority, ProjectStatus, Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength, MinDate, MinLength } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(15)
    @ApiProperty({name:"name",type:String,description:"name of the project",required:true})
    name!:string

    @IsNotEmpty()
    @IsString()
    @MinLength(15)
    @ApiProperty({name:"description",type:String,description:"description of the project",required:true})

    description!:string
    
    @ApiProperty({name:"status",type:"string",description:"status of the project",required:true})
    @IsEnum(ProjectStatus)
    status!:ProjectStatus
 
    

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    @MinDate(new Date())
    @ApiProperty({name:"startDate",type:Date,description:"startDate of the project",required:true})

    startDate!:Date

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    @MinDate(new Date())
    @ApiProperty({name:"endDate",type:Date,description:"endDate of the project",required:true})
    endDate!:Date


    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({name:"teamId",type:"string",description:"teamId of the project",required:true})

    teamId!:string

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({name:" companyId",type:"string",description:" companyId of the project",required:true})

    companyId!:string

}
