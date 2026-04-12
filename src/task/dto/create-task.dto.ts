/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Priority, Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString,  MinDate,  MinLength } from "class-validator";

export class CreateTaskDto {
    
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @ApiProperty({name:"title",type:"string",description:"title of the task",required:true})
    title!:string
    

    @IsString()
    @IsNotEmpty()    
    @MinLength(10)
    @ApiProperty({name:"description",type:"string",description:"description of the task",required:true})
    description!:string
    
    @ApiProperty({name:"priority",type:"string",description:"priority of the task",required:true})
    @IsEnum(Priority)
    priority!:Priority


    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({name:"assigneTo",type:"string",description:"user for the task",required:true})
    assigneTo!:string


    @ApiProperty({name:"status",type:"string",description:"status of the task",required:true})
    @IsEnum(Status)
    status!:Status
    

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    @MinDate(new Date())
    @ApiProperty({name:"dueDate",type:Date,description:"dueDate of the task",required:true})
    dueDate!:Date



}
