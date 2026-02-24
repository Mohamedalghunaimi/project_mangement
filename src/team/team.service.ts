/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma:PrismaService,
    private readonly mailService:MailService,
    private readonly jwtService:JwtService,
    private readonly config:ConfigService
  ) {}


  public async create(
  createTeamDto: CreateTeamDto,leadId:string,
  prismaClient: Prisma.TransactionClient = this.prisma
  ,) {
    const {name,companyId} = createTeamDto;
    const [company,user] = await Promise.all([
        prismaClient.company.findUnique({where:{id:companyId},select:{id:true}}) ,
        prismaClient.user.findUnique({ where: { id: leadId }, }) 
    ])
    if(!user) {
      throw new BadRequestException("invalid user id")
    }
    if(!company) {
      throw new BadRequestException("invalid company id")
    }

  const newTeam = await prismaClient.team.create({
    data: {
      name,
      companyId,
      leadId,
      teamMembers :{
        create: {
          userId: leadId,
          role:"OWNER"
        }
      }
    },
  });


  return newTeam;

  }

    public async inviteMember(email:string,teamId:string) {
      const team = await this.prisma.team.findUnique({where:{id:teamId}});
      if(!team) {
        throw new BadRequestException("team is not exists")
      }

      const subject = "invitation to join my team"
      const token = await this.jwtService.signAsync(
        {email,teamId},
        { expiresIn: '24h' }
      )
      const link = `${this.config.get<string>("base_url")}/api/auth/google?invitationToken=${token}`
      const result = await this.mailService.sendInvitationToEmail(email,subject,link);
      return result ;


    }

    public async acceptInvitaion(token:string,googleUser:User) {
      try {
      const {email,teamId} = await this.jwtService.verifyAsync(token as string) as {email:string,teamId:string};
      if(email !== googleUser.email) {
        throw new UnauthorizedException()
      }
      const member = await this.prisma.teamMember.findUnique({
        where:{
          userId_teamId:{
            userId:googleUser.id,
            teamId
          }
        }
        }
      );
      if(member) {
        throw new BadRequestException("member is already exists");
      }
      const newUserMember = await this.prisma.teamMember.create(
        {
          data:{
            userId:googleUser.id,
            teamId
          }
        }
      )
      return newUserMember
      } catch (error) {
        console.error(error)
        throw new InternalServerErrorException("invalid token")
        
      }

    }


}
