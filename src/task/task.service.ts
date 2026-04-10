/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TeamMember } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma:PrismaService
  ) {

  }
  public async create(createTaskDto: CreateTaskDto,projectId:string,leader:string):Promise<Task> {
    const {assigneTo,title,description,priority,status,dueDate} = createTaskDto;
    const user = await this.prisma.user.findUnique({where:{email:assigneTo}});
    if(!user) {
      throw new BadRequestException('member is not exist');
    }
    const project = await this.prisma.project.findUnique({
      where:{id:projectId},
      include:{
        team:true
      }
    })
    if(!project) {
      throw new BadRequestException("project is not exists")
    }
    if(String(project.team.leadId) !== leader) {
      throw new UnauthorizedException("only the leader of the team can create new task")
    }
    const team = await this.prisma.team.findUnique({
      where:{id:project.teamId },
      select:{
        teamMembers:{
          select:{
            id:true,
            userId:true
          }
        }
      }

    });

    const teamMembers = team!.teamMembers  ;
    const memberIsExist = teamMembers.find((member)=> String(member.userId)===String(user.id))
    if(!memberIsExist) {
      throw new BadRequestException("member is not exists in the team")
    }

    const newTask = await this.prisma.task.create({
      data:{
        projectId,
        title,
        description,
        priority,
        status,
        dueTime:dueDate,
        assigneeId:user.id
      }
    })
    return newTask
    


    
  }

  public async findAll(projectId:string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({where:{projectId}});
    return tasks
    
  }

  public async update(id: string, updateTaskDto: UpdateTaskDto,userId:string):Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where:{id},

    });
    if(!task) {
      throw new BadRequestException("task not exists")
    }
    if(task.assigneeId!==userId) {
      throw new ForbiddenException("forbidden!")
    }

    
    const updatedTask = await this.prisma.task.update(
      {
        where:{id},
        data:{
          ...updateTaskDto

        }
      }
    )
    return updatedTask
  }

  public async remove(id:string,userId:string):Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where:{id},
      select:{
        id:true,
        project:{
          select:{
            team:{
              select:{
                leadId:true
              }
            }
          }
        }
      }
    });
    if(!task) {
      throw new BadRequestException("task not exists");
    }
    const leadId = task.project.team.leadId;
    if(leadId!==userId) {
      throw new ForbiddenException("forbidden");
    }
    const removedTask = await this.prisma.task.delete({where:{id}});
    return removedTask;

    


  }
  public async findUserTasks(id:string):Promise<Task[]> {
    const user = await this.prisma.user.findUnique({where:{id}});
    if(!user) {
      throw new BadRequestException("invalid id")
    }
    const tasks = await this.prisma.task.findMany({
      where:{assigneeId:id},
      include:{
        project:{
          select:{
            name:true,
            id:true,
            description:true
          }
        }
      },
      orderBy:{dueTime:"asc"}

    })

    return tasks



  }



}
