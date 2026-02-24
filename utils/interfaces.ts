/* eslint-disable prettier/prettier */
import { Role } from "@prisma/client";

export interface Payload {
    role:Role,
    name:string,
    id:string

}