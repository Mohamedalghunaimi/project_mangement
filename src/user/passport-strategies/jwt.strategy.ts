/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "utils/interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly config:ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>("jwt_secret") as string,
            ignoreExpiration: false,
        })
    }
    public validate(payload:Payload) {
        return payload;


    }
    
}