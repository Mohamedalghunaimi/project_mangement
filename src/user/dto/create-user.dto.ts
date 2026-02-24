/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email!:string
  
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password:string


}
