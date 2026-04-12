/* eslint-disable prettier/prettier */

import { Role } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCompanyMemberDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    userId!:string


    @IsString()
    @IsNotEmpty()
    @IsUUID()
    companyId!:string
    
    @IsEnum(Role)
    role!:Role


}
