/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { INestApplication, ValidationPipe} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, afterEach, } from '@jest/globals';
import { PrismaService} from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { CreateTeamDto } from 'src/team/dto/create-team.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma:PrismaService

  beforeEach(async () => {
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
    });
    afterEach(async()=>{
        await prisma.team.deleteMany({})
        await app.close()
    })
    it("prisma is defined",()=> {
        expect(prisma).toBeDefined()
    })
    it("Create team (Post) with 200",async()=> {
        const createTeamDto:CreateTeamDto = {
            companyId:"1",
            name:"mohammed"

        }
        const response = await request(app.getHttpServer())
        .post("/api/team")
        .send(createTeamDto)
        .set("Aurhorization","")

    })


});
