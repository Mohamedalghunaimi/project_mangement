/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {  Post, Body, Controller, UseGuards, Req, Get, Res, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalGuard } from './gurards/local.guard';
import express from 'express';
import { GoogleGuard } from './gurards/google.guard';
import { Payload } from 'utils/interfaces';
import { TeamService } from '../team/team.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly teamService:TeamService
  ) {}

  @Post("auth/register")
  public async create(@Body() createUserDto: CreateUserDto) {
    
    const result = await this.userService.create(createUserDto);
    return result;
  }

  @Post("auth/login")
  @UseGuards(LocalGuard)
  @HttpCode(200)
  public async login(@Req() req:express.Request) {
    const user = req.user as Payload ;
    const result = await this.userService.signUp(user)
    return result;
  }

  @Get("/auth/google")
  @UseGuards(GoogleGuard)
  public loginWithGoogle(@Req() req:express.Request,@Res() res:express.Response) {
  const inviteToken = req.query.inviteToken;
  if(inviteToken) {
    res.cookie("inviteToken",inviteToken,{
      httpOnly:true,
      secure:true,
      sameSite:"lax",
      path:"/",
      maxAge:1000*60*5
    })
  }

  }

  @Get('/auth/google/callback')
  @UseGuards(GoogleGuard)
  public  async googleAuthRedirect(@Req() req:express.Request,res:express.Response) {
    const {inviteToken }= req.cookies
    if(inviteToken) {
      await this.teamService.acceptInvitaion(inviteToken as string,req.user as User)
      res.clearCookie('inviteToken');

    }
    return res.redirect("http://localhost:3000");

  }
  
}
