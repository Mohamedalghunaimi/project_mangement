/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  controllers: [TeamController],
  providers: [TeamService],
  exports:[TeamService],
  imports:[PrismaModule]
})
export class TeamModule {}
