/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { Payload } from '../../utils/interfaces';

describe("userService",()=> {
    let userService:UserService
    let prisma:PrismaService
    let jwt:JwtService
    beforeEach(async()=> {
        const module :TestingModule = await Test.createTestingModule({
            providers:[
                UserService,
                {
                    provide:PrismaService,
                    useValue:{
                        user:{
                            create:jest.fn(()=> {
                                
                            }),
                            findUnique:jest.fn(()=> {
                            })
                            
                        }
                    }
                },
                {
                    provide:ConfigService,
                    useValue:{
                        
                    }
                },
                {
                    provide:JwtService,
                    useValue:{
                        signAsync:jest.fn((payload:Payload)=> {
                            return "this is access token "


                        })

                    }
                }
            ]

        }).compile()
        userService = module.get<UserService>(UserService)
        prisma = module.get<PrismaService>(PrismaService)
        jwt = module.get<JwtService>(JwtService)
    })

    it("userService to be defined",()=> {
        expect(userService).toBeDefined()

    })
    it("test create one user",async()=> {
        const creatUserDto:CreateUserDto ={
            email:"mohammed",
            name:"mohammed nabil",
            password:"12346789"
        }
        const result = await userService.create(creatUserDto);
        expect(prisma.user.create).toHaveBeenCalled()
        expect(prisma.user.findUnique).toHaveBeenCalled()
        expect(result.message).toMatch("please go to login")

    })
    it("test signup ",async()=> {
        const payload : Payload = {
            id:"1",
            role:"ADMIN",
            name:"mohammed"

        }
        const result = await userService.signUp(payload)
        expect(jwt.signAsync).toHaveBeenCalled()
        expect(result.accessToken).toBeDefined()

    })
    it("test validateUserToGoogle",async()=> {
        const user = await userService.validateUserToGoogle({
            email:"mohammed@gamil.com",
            name:"mohammed"
        })
        expect(prisma.user.findUnique).toHaveBeenCalled()
        expect(prisma.user.create).toHaveBeenCalled()



    })

    
    
});