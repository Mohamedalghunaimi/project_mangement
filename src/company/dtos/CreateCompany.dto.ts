/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsString, MinLength } from "class-validator";

export class CreateCompany {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @ApiProperty({ name:"name",type:String,description:"company name"})
    name!:string
    

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @ApiProperty({ name:"description",type:String,description:"company description"})
    description!:string
    
    @ApiProperty({
        type:"string",
        format:"binary",
        name: 'image',
        required:false
    })
    image?:Express.Multer.File
    


    
    

}