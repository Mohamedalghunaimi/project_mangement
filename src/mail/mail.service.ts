/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService:MailerService){}
    
    public async sendInvitationToEmail(email:string,subject:string,link:string) {
        try {
        await this.mailerService.sendMail(
            {
                to:email,
                subject,
                html:  `
                    <div style="font-family: Arial, sans-serif; line-height:1.5;">
                    <h2>Invitation to join our team</h2>
                    <p>Please click the button below to accept the invitation:</p>
                    <a href="${link}" style="display:inline-block;padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
                        Accept Invitation
                    </a>
                    </div>
                    `
            }
        )
        return {
            success:true,
            message:"email is send"
        }
        } catch (error) {
            console.error(`Failed to send invitation to ${email}`, error);
            return {
                success:false,
                message:`Failed to send invitation to ${email}`
            }
        }


    }
}
