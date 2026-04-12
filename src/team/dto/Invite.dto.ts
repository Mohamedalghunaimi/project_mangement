/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class InviteDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({name:"email",type:"string",required:true,description:"email of the user to invite him"})
    email!:string
}