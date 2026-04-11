/* eslint-disable prettier/prettier */
import { Priority, Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString,  MinDate,  MinLength } from "class-validator";

export class CreateTaskDto {
    
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    title:string
    

    @IsString()
    @IsNotEmpty()    
    @MinLength(10)
    description:string
    
    @IsEnum(Priority)
    priority:Priority


    @IsString()
    @IsNotEmpty()
    @IsEmail()
    assigneTo:string

    @IsEnum(Status)
    status:Status
    

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    @MinDate(new Date())

    dueDate:Date



}
