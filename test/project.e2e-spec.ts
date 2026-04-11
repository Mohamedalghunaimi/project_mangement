/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */

import { INestApplication, ValidationPipe} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll,  } from '@jest/globals';
import { PrismaService} from '../src/prisma/prisma.service';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { AppModule } from '../src/app.module';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'utils/interfaces';
import { ConfigService } from '@nestjs/config';
import { Company, CompanyMember, Project, Team, TeamMember, User } from '@prisma/client';
import { CreateProjectDto } from 'src/project/dto/create-project.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma:PrismaService;
  let jwtService:JwtService
  let configService:ConfigService
  let creator :User
  let team:Team
  let company:Company
  let companyMember:CompanyMember
  let createProjectDto:CreateProjectDto;

  beforeAll(async () => {
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
    jwtService = moduleFixture.get<JwtService>(JwtService)
    configService = moduleFixture.get<ConfigService>(ConfigService)
    
    await prisma.task.deleteMany({})
    await prisma.project.deleteMany({})
    await prisma.teamMember.deleteMany({})
    await prisma.companyMember.deleteMany({})
    await prisma.team.deleteMany({})
    await prisma.company.deleteMany({})
    await prisma.user.deleteMany({})


    creator = await prisma.user.create({
        data:{
            email:"mohammed@gmail.com",
            name:"mohammed"
        }

    })
    company = await prisma.company.create({
        data:{
            name:"company1",
            description:"this is the first company"
        }
    })
    team = await prisma.team.create({
        data:{
            companyId:company.id,
            leadId:creator.id,
            name:"team1"

        }
    })
    companyMember = await prisma.companyMember.create({
        data:{
            companyId:company.id,
            role:"MEMBER",
            userId:creator.id

        }
    })
    createProjectDto ={
        name:"project1",
        description:"this is first project",
        teamId:team.id,
        status:"ACTUVE",
        startDate:new Date(),
        endDate:new Date(Date.now()+1000*60*60*24*7),
        companyId:company.id,

    }


    });
    afterAll(async()=>{
        await prisma.task.deleteMany({})
        await prisma.project.deleteMany({})
        await prisma.teamMember.deleteMany({})
        await prisma.companyMember.deleteMany({})
        await prisma.team.deleteMany({})
        await prisma.company.deleteMany({})
        await prisma.user.deleteMany({})

        await app.close()

    })
    it("prisma is defined",()=> {
        expect(prisma).toBeDefined()
    })
    describe("create project",()=> {
        it("should return with 200",async() => {
            const payload :Payload = {
                name:creator.name,
                id:creator.id

            }
            const accessToken = await jwtService.signAsync(payload);

            const createProjectResponse = await request(app.getHttpServer())
            .post("/api/project")
            .set("Authorization",`Bearer ${accessToken}`)
            .send(createProjectDto)
            expect(createProjectResponse.status).toBe(201)

        })
        it("should return with 401",async()=> {


            const createProjectResponse = await request(app.getHttpServer())
            .post("/api/project")
            .send(createProjectDto)
            expect(createProjectResponse.status).toBe(401)


        })
        it("should return with 400",async()=> {

            const payload :Payload = {
                name:creator.name,
                id:creator.id

            }
            const accessToken = await jwtService.signAsync(payload);
            createProjectDto.teamId="12346789"

            const createProjectResponse = await request(app.getHttpServer())
            .post("/api/project")
            .set("Authorization",`Bearer ${accessToken}`)
            .send(createProjectDto)
            expect(createProjectResponse.status).toBe(400)


        })
        it("should return with 404",async()=> {

            const payload :Payload = {
                name:creator.name,
                id:creator.id

            }
            const accessToken = await jwtService.signAsync(payload);
            createProjectDto.teamId="d9e44eb5-d0c5-4330-9ec7-e20794f22fa4";
            const createProjectResponse = await request(app.getHttpServer())
            .post("/api/project")
            .set("Authorization",`Bearer ${accessToken}`)
            .send(createProjectDto)
            expect(createProjectResponse.status).toBe(404)


        })
        it("should return with 403",async()=> {
            await prisma.companyMember.update({
                where:{id:companyMember.id},
                data:{
                    role:"VIEWER"
                }


            })

            const payload :Payload = {
                name:creator.name,
                id:creator.id

            }
            const accessToken = await jwtService.signAsync(payload);
            const createProjectResponse = await request(app.getHttpServer())
            .post("/api/project")
            .set("Authorization",`Bearer ${accessToken}`)
            .send(createProjectDto)
            console.log(createProjectResponse.body)

            expect(createProjectResponse.status).toBe(403)
            expect(createProjectResponse.body.message).toMatch('forbidden')

        })
    })



});
