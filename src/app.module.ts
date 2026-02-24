/* eslint-disable prettier/prettier */
import { BadRequestException, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CompanyModule } from './company/company.module';
import { TaskModule } from './task/task.module';
import { MailModule } from './mail/mail.module';
import { TeamModule } from './team/team.module';
import { ProjectModule } from './project/project.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    UserModule,
    JwtModule.registerAsync({
      global:true,
      inject:[ConfigService],
      useFactory:(config:ConfigService)=> {
        return {
          secret:config.get<string>("jwt_secret"),
          signOptions:{
            expiresIn:"7d"
          }

        }

      }
    }),
    CompanyModule,
    TaskModule,
    MailModule,
    TeamModule,
    ProjectModule,
    MulterModule.register({
      storage:diskStorage({
        filename:(req,file,cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.fieldname + '-' + uniqueSuffix)
        }
      }),
      fileFilter:(req,file,cb) => {
        if(!file.mimetype.endsWith("image")) {
          return cb(new BadRequestException("file type must be image"),false)
        }
        cb(null,true)
      },
      limits:{
        fileSize:1024*1024*5
      }
    }),
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
