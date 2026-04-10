/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { TeamService } from '../team/team.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';

describe('UserController', () => {
  let userController:UserController;
  let userService:UserService;
  let teamService:TeamService
  

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
            provide:UserService,
            useValue:{
                create:jest.fn((
                    createUserDto:CreateUserDto
                )=> {
                    return Promise.resolve({
                        message:"please then go to login"
                    })

                })

            }
        },
        TeamService,
        {
            provide:JwtService,
            useValue:jest.fn(()=>{})
        },
        {
            provide:PrismaService,
            useValue:jest.fn(()=>{})
        },
        {
            provide:ConfigService,
            useValue:{
                
            }
        },
        {
            provide:MailService,
            useValue:jest.fn(()=> {

            })
        }

    ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService)
    teamService = app.get<TeamService>(TeamService)
  });

  it('check userController  to defined', () => {

    expect(userController).toBeDefined()
    
  });
  it("check userService",()=>{
    expect(userService).toBeDefined()
  })
  it("teamService to be defined",()=> {
    expect(teamService).toBeDefined()
  })
  it("userService.create have been used",async()=> {
    const createUserDto :CreateUserDto = {
        name:"mohammed",
        email:"mohammed@gmail.com",
        password:"1234566"
    }
    const result = await userController.create(createUserDto)
    expect(userService.create).toHaveBeenCalled()
    expect(userService.create).toHaveBeenCalledWith(createUserDto)
    expect(result.message).toMatch("please then go to login")
  })
  

});
