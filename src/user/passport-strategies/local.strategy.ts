/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { PrismaService } from "src/prisma/prisma.service";
import bcrypt from 'bcryptjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prism :PrismaService) {
        super({usernameField:"email"})
    }
    public async validate(email:string,password:string){
        const user = await this.prism.user.findUnique({where:{email}});
        if(!user) {
            throw new UnauthorizedException("invalid inputs")
        }
        const isMatch = await bcrypt.compare(password, user.password as string);
        if(!isMatch) {
            throw new UnauthorizedException("invalid inputs")
        }
        user.password = "";
        return user;

    }
    
}