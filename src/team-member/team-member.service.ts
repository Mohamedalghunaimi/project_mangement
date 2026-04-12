/* eslint-disable prettier/prettier */
import {  ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeamMemberService {
  constructor(private readonly prisma:PrismaService){}


  async findAll(teamId:string) {
    const existingTeam = await this.prisma.team.findUnique({
      where:{id:teamId},

    })
    if(!existingTeam) {
      throw new NotFoundException("team not found")

    }
    const teamMembers = await this.prisma.teamMember.findMany({
      where:{teamId:existingTeam.id},
      include:{
        user:{
          select:{
            id:true,
            name:true
          }
        }
      }
    })
    return teamMembers


  }





  async remove(teamMemberId:string,teamId:string,leaderId:string) {
    return this.prisma.$transaction(async(prisma)=>{
    const existingTeam = await prisma.team.findFirst({
      where:{id:teamId},
      select:{
        id:true,
        leadId:true
      }
    })
    if(!existingTeam) {
      throw new NotFoundException("team not found")
    }
    const existingTeamMember = await prisma.teamMember.findFirst({
      where:{
        id:teamMemberId,
        teamId:existingTeam.id
      },
      select:{
        id:true,
        userId:true,
        role:true
      }
      
      
    })
    if(!existingTeamMember) {
      throw new NotFoundException("member not found")
    }
    if(existingTeam.leadId!==leaderId) {
      throw new ForbiddenException("forbidden")
    }
    if(existingTeamMember.userId===leaderId) {
      throw new ForbiddenException("forbidden")
    }
    if(existingTeamMember.role==="OWNER") {
      throw new ForbiddenException("forbidden")
    }
    await prisma.teamMember.delete({
      where:{id:existingTeam.id}
    })
    return {
      message:"member is deleted"
    }
    })





  }
}
