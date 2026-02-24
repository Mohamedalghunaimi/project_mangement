/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
@Global()
@Module({
  providers: [MailService],
  exports:[MailService],
  imports:[
    MailerModule.forRootAsync({
      
      inject:[ConfigService],
      useFactory:(config:ConfigService)=> {
          const mailFrom = config.get<string>("MAIL_FROM");
          console.log(mailFrom)

        return {
          
          transport:{
            host:config.get<string>("HOST"),
            port:config.get<number>('PORT'),
            secure:false,
            auth:{
              pass:config.get<string>("password"),
              user:config.get<string>("username2")
            }
          },
        defaults: {
          from: `<no-reply@${mailFrom}`,
        },
        }

      }
    })
  ],
})
export class MailModule {}
