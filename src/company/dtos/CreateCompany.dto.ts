/* eslint-disable prettier/prettier */

import { IsNotEmpty,  IsString, MinLength } from "class-validator";

export class CreateCompany {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    name:string
    

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    description:string
    


    
    

}