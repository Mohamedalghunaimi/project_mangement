/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { INestApplication, ValidationPipe} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, afterEach,  } from '@jest/globals';
import { PrismaService} from '../src/prisma/prisma.service';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma:PrismaService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,

      ]

    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api")
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

  });
  beforeEach(async()=> {
    await prisma.user.deleteMany({})

  })
  afterEach(async()=>{
    await prisma.user.deleteMany({})
    await app.close()
  })
  it("prisma is defined",()=> {
    expect(prisma).toBeDefined()
  })
  it("POST create user",async()=> {
    const createUserDto :CreateUserDto = {
      name:"mohammednabil",
      email:"mohammed@gmail.com",
      password:"mohammed12"
    }
    const response = await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)
    expect(response.status).toBe(201)
    expect(response.body.message).toMatch("please go to login")

  })
  it("400 pad Request email is not correct",async()=> {
    const createUserDto :CreateUserDto = {
      name:"mohammednabil",
      email:"mohammed",
      password:"mohammed12"
    }
    const response = await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)
    expect(response.status).toBe(400)

  })

  it("400 pad Request password is  weak",async()=> {
    const createUserDto :CreateUserDto = {
      name:"mohammednabil",
      email:"mohammed@gmail.com",
      password:"mo"
    }
    const response = await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)
    expect(response.status).toBe(400)

  })

  it("400 pad request name is weak",async()=> {
    const createUserDto :CreateUserDto = {
      name:"moh",
      email:"mohammed@gmail.com",
      password:"mohamed12366"
    }
    const response = await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)
    expect(response.status).toBe(400)
  })
  it("400 pad request user is exist",async()=> {
    const createUserDto :CreateUserDto = {
      name:"moh",
      email:"mohammed@gmail.com",
      password:"mohamed12366"
    }
    await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)

    
    const response = await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)
    expect(response.status).toBe(400)
  })

  it("200 good request in login",async()=> {
    const createUserDto :CreateUserDto = {
      name:"mohamednabil",
      email:"mohammed@gmail.com",
      password:"mohamed12366"
    }
     await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)
    //expect(registerReponse.status).toBe(201)


    const loginResponse = await request(app.getHttpServer())
    .post("/api/user/auth/login")
    .send({
      email:"mohammed@gmail.com",
      password:"mohamed12366"
    }

    )
    expect(loginResponse.status).toBe(200)
  })
  
  it("401 good request in login",async()=> {
    const createUserDto :CreateUserDto = {
      name:"mohamednabil",
      email:"mohammed@gmail.com",
      password:"mohamed12366"
    }
    await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)


    const response = await request(app.getHttpServer())
    .post("/api/user/auth/login")
    .send({
      email:"mohammed23@gmail.com",
      password:"mohamed12366"
    }

    )
    expect(response.status).toBe(401)
  })
  it("401 good request in login",async()=> {
    const createUserDto :CreateUserDto = {
      name:"mohamednabil",
      email:"mohammed@gmail.com",
      password:"mohamed12366"
    }
    await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)


    const response = await request(app.getHttpServer())
    .post("/api/user/auth/login")
    .send({
      email:"mohammed@gmail.com",
      password:"mohamed123111166"
    }

    )
    expect(response.status).toBe(401)
  })



  


});
