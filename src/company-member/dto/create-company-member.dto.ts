/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCompanyMemberDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        type:"string",
        required:true,
        name:"userId"
    })
    userId!:string


    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        type:"string",
        required:true,
        name:"companyId"
    })
    companyId!:string
    
    @IsEnum(Role)
    @ApiProperty({
        type:"string",
        required:true,
        name:"Role"
    })
    role!:Role


}
