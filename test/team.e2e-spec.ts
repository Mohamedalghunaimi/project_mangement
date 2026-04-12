/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { INestApplication, ValidationPipe} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeAll, afterAll, } from '@jest/globals';
import { PrismaService} from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { CreateTeamDto } from 'src/team/dto/create-team.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InviteDto } from 'src/team/dto/Invite.dto';
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma:PrismaService
  let accessToken :string

    beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
        AppModule
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
await prisma.task.deleteMany()
await prisma.project.deleteMany()

await prisma.teamMember.deleteMany()
await prisma.team.deleteMany()

await prisma.companyMember.deleteMany()

await prisma.company.deleteMany()

await prisma.user.deleteMany()
    const createUserDto :CreateUserDto = {
        name:"mohamednabil",
        email:"mohammed@gmail.com",
        password:"mohamed12366"
    }
    await request(app.getHttpServer())
    .post("/api/user/auth/register")
    .send(createUserDto)


    const loginResponse = await request(app.getHttpServer())
    .post("/api/user/auth/login")
    .send({
        email:"mohammed@gmail.com",
        password:"mohamed12366"
    })
    accessToken = loginResponse.body.accessToken as string ;
    })

    afterAll(async()=>{
await prisma.task.deleteMany()
await prisma.project.deleteMany()

await prisma.teamMember.deleteMany()
await prisma.team.deleteMany()

await prisma.companyMember.deleteMany()

await prisma.company.deleteMany()

await prisma.user.deleteMany()

        await app.close()
await prisma.$disconnect()

    })


    it("prisma is defined",()=> {
        expect(prisma).toBeDefined()
    })
    it("Create team (Post) with 200",async()=> {
        expect(accessToken).toBeDefined();
        const newCompany = await prisma.company.create({
            data:{
                name:`company-${Date.now()}`,
                description:"this is the best company in the world"
            }
        })
        const createTeamDto: CreateTeamDto = {
            companyId:newCompany.id,
            name:"mohammed"
        }

        const response = await request(app.getHttpServer())
        .post("/api/team")
        .set("Authorization",`Bearer ${accessToken}`)
        .send(createTeamDto)
        console.log(response.body)
        expect(response.status).toBe(201)


    })
    it("Create team (Post) with 401",async()=> {
        const newCompany = await prisma.company.create({
            data:{
                name: `company-${Date.now()}`,
                description:"this is the best company in the world"
            }
        })
        const createTeamDto: CreateTeamDto = {
            companyId:newCompany.id,
            name:"mohamteam"
        }
        const response = await request(app.getHttpServer())
        .post("/api/team")
        .send(createTeamDto)
        //.set("Authorization",`Bearer ${accessToken}`)
        expect(response.status).toBe(401)
        expect(response.body.message).toMatch("Unauthorized")

    })
    it("Create team (Post) with 400",async()=> {
        const createTeamDto: CreateTeamDto = {
            companyId:"123456789",
            name:"mohammed team"
        }
        const response = await request(app.getHttpServer())
        .post("/api/team")
        .send(createTeamDto)
        .set("Authorization",`Bearer ${accessToken}`)
        expect(response.status).toBe(400)
    })


        it("it returns with 200 in invite",async ()=> {
        const newCompany = await prisma.company.create({
            data:{
                name: `company-${Date.now()}`,
                description:"this is the best company in the world"
            }
        })
        const newUser = await prisma.user.create({
            data:{
                name:"mohammed",
                email:"mohammed666@gmail.com"
            }
        })

        const newTeam = await prisma.team.create({
            data:{
                companyId:newCompany.id,
                name:"mohammed team",
                leadId:newUser.id
            }
        })
        const inviteDto:InviteDto = {
            email:"mohammed@gmail.com"

        }
        const invitaionResponse = await request(app.getHttpServer())
        .post(`/api/team/invite/${newTeam.id}`)
        .set("Authorization",`Bearer ${accessToken}`)
        .send(inviteDto)
        expect(invitaionResponse.status).toBe(200)
        })

        it("it returns with 400 in invite",async ()=> {

        const newCompany = await prisma.company.create({
            data:{
                name: `company-${Date.now()}`,
                description:"this is the best company in the world"
            }
        })
        const newUser = await prisma.user.create({
            data:{
                name:"mohammed",
                email:"mohammed667@gmail.com"
            }
        })

        const newTeam = await prisma.team.create({
            data:{
                companyId:newCompany.id,
                name:"mohammed team",
                leadId:newUser.id
            }
        })
        const inviteDto:InviteDto = {
            email:"mohammed@gmail.com"

        }
        const invitaionResponse = await request(app.getHttpServer())
        .post(`/api/team/invite/${newTeam.id}`)
        .send(inviteDto)
        expect(invitaionResponse.status).toBe(401)

        })
        it("it returns with 400 in invite",async ()=> {

        const newCompany = await prisma.company.create({
            data:{
                name:`company-${Date.now()}`,
                description:"this is the best company in the world"
            }
        })
        const newUser = await prisma.user.create({
            data:{
                name: "mohammed",
                email:"mohammed6622@gmail.com"
            }
        })

        const newTeam = await prisma.team.create({
            data:{
                companyId:newCompany.id,
                name:"mohammed team",
                leadId:newUser.id
            }
        })
        const inviteDto:InviteDto = {
            email:"mohammed@gmail"

        }
        const invitaionResponse = await request(app.getHttpServer())
        .post(`/api/team/invite/${newTeam.id}`)
        .set("Authorization",`Bearer ${accessToken}`)
        .send(inviteDto)
        expect(invitaionResponse.status).toBe(400)
        
        })
        it("it returns with 200 in invite",async ()=> {

        const inviteDto:InviteDto = {
            email:"mohammed@gmail.com"

        }
        const invitaionResponse = await request(app.getHttpServer())
        .post(`/api/team/invite/${"123456789"}`)
        .set("Authorization",`Bearer ${accessToken}`)
        .send(inviteDto)
        expect(invitaionResponse.status).toBe(400)
        })



});
