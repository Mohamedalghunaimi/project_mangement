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
import { Company, Project, Team, TeamMember, User } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma:PrismaService;
  let jwtService:JwtService
  let configService:ConfigService
  let leader:User;
  let payload:Payload;
  let accessToken:string;
  let assigneTo:User;
  let newCompany:Company;
  let team:Team;
  let teamMember:TeamMember
  let newProject:Project
let createTaskDto:CreateTaskDto


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
            leader = await prisma.user.create({
                data:{
                    email:"mohammedbb@gmail.com",
                    name:"mohammed"
                }
            })
            payload  = {
                name:leader.name,
                id:leader.id
            }
            accessToken = await jwtService.signAsync(payload)
            assigneTo = await prisma.user.create({
                data:{
                    email:"mohammed123@gmail.com",
                    name:"mohammed"
                },

            });
            newCompany = await prisma.company.create({
                data:{
                    name:`mohammed-${Date.now()}`,
                    description:"this is the best company in the world"
                }
            })
            team = await prisma.team.create({
                data:{
                    name:"mohammteam",
                    companyId:newCompany.id,
                    leadId:leader.id
                }
            })
            teamMember = await prisma.teamMember.create({
                data:{
                    userId:assigneTo.id,
                    teamId:team.id,
                    role:"MEMBER"
                }
            })
            newProject  = await prisma.project.create({
                data:{
                    name:"first project",
                    description:"this is the first project",
                    companyId:newCompany.id,
                    teamId:team.id,
                    startDate:new Date(),
                    endDate: new Date(Date.now() + 1000*60*60*24*1),
                    creatorId:assigneTo.id

                }
            })
            createTaskDto = {
                assigneTo:assigneTo.email,
                title:"first task",
                description:"this is the first task",
                priority:"HIGH",
                status:"TODO",
                dueDate:new Date(Date.now() + 1000*60*60*3)
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
await prisma.$disconnect()

    })
    it("prisma is defined",()=> {
        expect(prisma).toBeDefined()
    })

    describe("create task",()=> {
        afterAll(async()=> {
        await prisma.task.deleteMany({})
        })
        it("create task with 200 status",async()=> {

            const createTaskResponse = await request(app.getHttpServer())
            .post(`/api/tasks/${newProject.id}`)
            .set("Authorization",`Bearer ${accessToken}`)
            .send(createTaskDto)
            expect(createTaskResponse.status).toBe(201)
        })
        it("create task return with 401",async()=> {
    

            const createTaskResponse = await request(app.getHttpServer())
            .post(`/api/tasks/${newProject.id}`)
            .send(createTaskDto)
            expect(createTaskResponse.status).toBe(401)
            

        })
        it("create task return with 400",async()=> {
            const createTaskResponse = await request(app.getHttpServer())
            .post(`/api/tasks/${newProject.id+5}`)
            .set("Authorization",`Bearer ${accessToken}`)
            .send(createTaskDto)
            console.log(createTaskResponse.body)
            expect(createTaskResponse.status).toBe(400)
        })

        it("create task return with 400 in viewer role",async ()=> {
            await prisma.teamMember.update({
                where:{id:teamMember.id},
                data:{
                    userId:assigneTo.id,
                    teamId:team.id,
                    role:"VIEWER"
                }
            })
            const createTaskResponse = await request(app.getHttpServer())
            .post(`/api/tasks/${newProject.id}`)
            .set("Authorization",`Bearer ${accessToken}`)
            .send(createTaskDto)
            console.log(createTaskResponse.body)
            expect(createTaskResponse.status).toBe(400)
            expect(createTaskResponse.body.message).toMatch("User is not a member of this team")
        })

        



    })

    describe("getAll tasks",()=> {
        it("should return with 200 status",async()=> {
            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);

            const getAllTasksResponse = await request(app.getHttpServer())
            .get(`/api/tasks/${newProject.id}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getAllTasksResponse.status).toBe(200)

            
            



        })
        it("should return with 401 status",async()=> {


            const getAllTasksResponse = await request(app.getHttpServer())
            .get(`/api/tasks/${newProject.id}`)

            expect(getAllTasksResponse.status).toBe(401)

        })
        it("should return with 404",async()=> {
            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);

            const getAllTasksResponse = await request(app.getHttpServer())
            .get(`/api/tasks/${"d9e44eb5-d0c5-4330-9ec7-e20794f22fa4"}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getAllTasksResponse.status).toBe(404)
        })
        it("should return with 400",async()=> {
            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);

            const getAllTasksResponse = await request(app.getHttpServer())
            .get(`/api/tasks/${"123456789"}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getAllTasksResponse.status).toBe(400)
        })
        it("should return with 404",async()=> {
            await prisma.teamMember.delete({
                where:{
                    id:teamMember.id
                },

            })            
            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);
            const getAllTasksResponse = await request(app.getHttpServer())
            .get(`/api/tasks/${newProject.id}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getAllTasksResponse.status).toBe(404)
        })
    })
    describe("getTasks for single user",()=> {
        it("should return with 200",async()=> {
            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);

            const getTasksForUserResponse = await request(app.getHttpServer())
            .get("/api/tasks")
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getTasksForUserResponse.status).toBe(200)
        })
        it("should return with 401",async()=> {


            const getTasksForUserResponse = await request(app.getHttpServer())
            .get("/api/tasks")

            expect(getTasksForUserResponse.status).toBe(401)
        })

    })

    describe("patch to single task",()=> {
        afterEach(async()=> {
        await prisma.task.deleteMany({})
        })
        it("should return with 200",async()=> {
            const newTask = await prisma.task.create({
                data:{
                    title:"task1",
                    description:"this is the first task1",
                    projectId:newProject.id,
                    priority:"HIGH",
                    status:"TODO",
                    dueTime:new Date(Date.now()+1000*60*60),
                    assigneeId:assigneTo.id
                },
                select:{
                    id:true
                }
            })
            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);

            const getTasksForUserResponse = await request(app.getHttpServer())
            .patch(`/api/tasks/${newTask.id}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getTasksForUserResponse.status).toBe(200)
        })
        it("should return with 400",async()=> {

            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);

            const getTasksForUserResponse = await request(app.getHttpServer())
            .patch(`/api/tasks/${"123456789"}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getTasksForUserResponse.status).toBe(400)
        })
        it("should return with 404",async()=> {

            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);

            const getTasksForUserResponse = await request(app.getHttpServer())
            .patch(`/api/tasks/${"d9e44eb5-d0c5-4330-9ec7-e20794f22fa4"}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getTasksForUserResponse.status).toBe(404)
        })
        it("should return with 403",async()=> {
            const newTask = await prisma.task.create({
                data:{
                    title:"task1",
                    description:"this is the first task1",
                    projectId:newProject.id,
                    priority:"HIGH",
                    status:"TODO",
                    dueTime:new Date(Date.now()+1000*60*60),
                    assigneeId:leader.id
                },
                select:{
                    id:true
                }
            })

            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);

            const getTasksForUserResponse = await request(app.getHttpServer())
            .patch(`/api/tasks/${newTask.id}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getTasksForUserResponse.status).toBe(403)
        })
    })
    describe("delete single task",()=> {
        afterEach(async()=> {
        await prisma.task.deleteMany({})
        })
        it("should return with 200",async()=> {
            const newTask = await prisma.task.create({
                data:{
                    title:"task1",
                    description:"this is the first task1",
                    projectId:newProject.id,
                    priority:"HIGH",
                    status:"TODO",
                    dueTime:new Date(Date.now()+1000*60*60),
                    assigneeId:leader.id
                },
                select:{
                    id:true
                }
            })
            const getTasksForUserResponse = await request(app.getHttpServer())
            .delete(`/api/tasks/${newTask.id}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getTasksForUserResponse.status).toBe(200)
        })
        it("should return with 401",async()=> {
            const newTask = await prisma.task.create({
                data:{
                    title:"task1",
                    description:"this is the first task1",
                    projectId:newProject.id,
                    priority:"HIGH",
                    status:"TODO",
                    dueTime:new Date(Date.now()+1000*60*60),
                    assigneeId:leader.id
                },
                select:{
                    id:true
                }
            })
            const getTasksForUserResponse = await request(app.getHttpServer())
            .delete(`/api/tasks/${newTask.id}`)

            expect(getTasksForUserResponse.status).toBe(401)
        })
        it("should return with 403",async()=> {
            const newTask = await prisma.task.create({
                data:{
                    title:"task1",
                    description:"this is the first task1",
                    projectId:newProject.id,
                    priority:"HIGH",
                    status:"TODO",
                    dueTime:new Date(Date.now()+1000*60*60),
                    assigneeId:leader.id
                },
                select:{
                    id:true
                }
            })

            const payload :Payload = {
                name:assigneTo.name,
                id:assigneTo.id
            }
            const accessToken = await jwtService.signAsync(payload);

            const getTasksForUserResponse = await request(app.getHttpServer())
            .delete(`/api/tasks/${newTask.id}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getTasksForUserResponse.status).toBe(403)
        })
        it("should return with 400",async()=> {


            const getTasksForUserResponse = await request(app.getHttpServer())
            .delete(`/api/tasks/${"123456789"}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getTasksForUserResponse.status).toBe(400)
        })
        it("should return with 404",async()=> {


            const getTasksForUserResponse = await request(app.getHttpServer())
            .delete(`/api/tasks/${"d9e44eb5-d0c5-4330-9ec7-e20794f22fa4"}`)
            .set("Authorization",`Bearer ${accessToken}`);

            expect(getTasksForUserResponse.status).toBe(404)
        })
    })



    


});
