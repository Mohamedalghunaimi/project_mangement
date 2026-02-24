/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Payload } from "utils/interfaces";


export const User = createParamDecorator(
    (data:any,context:ExecutionContext)=> {
        const request :Request = context.switchToHttp().getRequest();
        const user = request.user as Payload ;
        return user

    }
)