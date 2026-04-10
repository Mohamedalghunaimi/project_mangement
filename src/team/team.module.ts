/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
  exports:[TeamService],
  imports:[PrismaModule,JwtModule,ConfigModule,MailModule]
})
export class TeamModule {}
