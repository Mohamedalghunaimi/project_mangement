/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty({name:"name",description:"name of user",type:"string",required:true})
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({name:"email",description:"email of user",type:"string",required:true})

  email!:string
  
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({name:"password",description:"password of user",type:"string",required:true})
  password!: string;
}
