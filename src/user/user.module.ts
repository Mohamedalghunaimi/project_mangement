/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LocalStrategy } from './passport-strategies/local.strategy';
import { GoogleStrategy } from './passport-strategies/google.strategy';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { TeamModule } from 'src/team/team.module';

@Module({
  controllers: [UserController],
  providers: [UserService,LocalStrategy,GoogleStrategy,JwtStrategy],
  imports:[PrismaModule,TeamModule]
})
export class UserModule {}
