/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Task, TeamMember } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma:PrismaService
  ) {

  }
  public async create(createTaskDto: CreateTaskDto,projectId:string,leader:string):Promise<Task> {
    try {
  const {assigneTo,title,description,priority,status,dueDate} = createTaskDto;
    const user = await this.prisma.user.findUnique({where:{email:assigneTo},select:{id:true}});
    if(!user) {
      throw new BadRequestException('member is not exist');
    }
    const project = await this.prisma.project.findUnique({
      where:{id:projectId},
      select:{
        id:true,
        teamId:true,
        team:{
          select:{
            leadId:true
          }
        }
      }
    })
    if(!project) {
      throw new BadRequestException("project is not exists")
    }
    if(project.team.leadId !== leader) {
      throw new UnauthorizedException("only the leader of the team can create new task")
    }
    const team = await this.prisma.team.findFirst({
      where:{
        id:project.teamId ,
        teamMembers:{
          some:{
            userId:user.id,
            role:{
              not:"VIEWER"
            }
          }
        }
      },
      select:{
        teamMembers:{
          select:{
            id:true,
            userId:true
          }
        }
      }

    });


    if(!team) {
      throw new BadRequestException("User is not a member of this team" )
    }

    const newTask = await this.prisma.task.create({
      data:{
        projectId:project.id,
        title,
        description,
        priority,
        status,
        dueTime:dueDate,
        assigneeId:user.id
      }
    })
    return newTask
    } catch (error:any) {
      if (error instanceof HttpException) {
        throw error
      }
      console.log(error)
      throw new InternalServerErrorException("some thing went wrong")      
    }
  
    


    
  }

  public async findAll(projectId:string,userId:string): Promise<Task[]> {
    const existingProject = await this.prisma.project.findFirst({
      where:{
        id:projectId,
        team:{
          teamMembers:{
            some:{
              userId
            }
          }
        }
      },
      select:{id:true}
    })
    if(!existingProject) {
      throw new NotFoundException("project not found")
    }
    const tasks = await this.prisma.task.findMany({where:{projectId:existingProject.id}});
    return tasks
    
  }

  public async update(id: string, updateTaskDto: UpdateTaskDto,userId:string):Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where:{id},

    });
    if(!task) {
      throw new NotFoundException("task not exists")
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
