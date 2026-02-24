/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class InviteDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email:string
}