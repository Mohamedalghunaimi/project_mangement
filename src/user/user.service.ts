/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'utils/interfaces';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma:PrismaService,
    private readonly config:ConfigService,
    private readonly jwt:JwtService
  ) {}
  public async create(createUserDto: CreateUserDto) {
    const {email,password,name} = createUserDto ;
    const user = await this.prisma.user.findUnique({where:{email}})
    if(user) {
      throw new BadRequestException('email is already exists')
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    await this.prisma.user.create({
      data:{
        password:hashedPassword,
        email,
        name
      }
    })
    return {
      message:"please go to login"
    };
  }

  public async signUp(user:Payload) {
    const payload :Payload = {
      id:user.id ,
      name:user.name,
      role:user.role
    }
    const accessToken = await this.jwt.signAsync(payload);
    return {
      accessToken
    }
  }
  public async validateUserToGoogle({email,name}:{email:any,name:any}) {
    const user = await this.prisma.user.findUnique({where:{email }});
    if(!user) {
      const newUser = await this.prisma.user.create({
        data:{
          email,
          name
        },
        select:{
          id:true,
          name:true,
          email:true
        }
      })
      return newUser
    }
    return user;

  }

}
