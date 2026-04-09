/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { UserService } from "../user.service";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService:ConfigService,
        private readonly userService:UserService
        
    ) {
        super({
                clientID: configService.get<string>("clientIDGoogle") as string,
                clientSecret: configService.get<string>("clientSecretGoogle") as string,
                callbackURL: `${configService.get<string>("baseUrl")}/api/user/auth/google/callback`,
                scope: ['email', 'profile'], 
        })
    }

    public async validate(req:Request,accessToken: string, refreshToken: string, profile: any){
        
        const {emails,name} = profile;
        const profileData = {
            email: emails[0].value,
            name: name.givenName,
        }
        const user = await this.userService.validateUserToGoogle(profileData);
        return user;
    }
    
}