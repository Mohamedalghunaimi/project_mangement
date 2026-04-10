/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LocalStrategy } from './passport-strategies/local.strategy';
import { GoogleStrategy } from './passport-strategies/google.strategy';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { TeamModule } from '../team/team.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [UserController],
  providers: [UserService,LocalStrategy,GoogleStrategy,JwtStrategy],
  imports:[PrismaModule,TeamModule,ConfigModule],
  exports:[UserService]
})
export class UserModule {}
