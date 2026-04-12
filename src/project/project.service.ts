/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable,  NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ProjectService {
  constructor (private readonly prisma:PrismaService) {}
  public async create(createProjectDto: CreateProjectDto,id:string) {
    const {teamId,companyId,name} = createProjectDto;

    const [team,company,project] = await Promise.all([
      this.prisma.team.findUnique({where:{id:teamId}}),
      this.prisma.company.findUnique({where:{id:companyId},select:{id:true,companyMembers:{select:{userId:true,role:true}}}}),
      this.prisma.project.findUnique({where:{name_teamId:{name,teamId}}})
    ])

    if(!team) {
      throw new NotFoundException("Team does not exists")
    }
    if(!company) {
      throw new NotFoundException("Company does not exist")
    }
    if(team.companyId!==company.id) {
      throw new BadRequestException("Team does not belong to this company")
    }

    const {companyMembers} = company;
    const member = companyMembers.find((member)=> member.userId===id);
    if(!member) {
      throw new ForbiddenException('forbidden')
    }
    if(member.role==='VIEWER') {
      throw new ForbiddenException('forbidden')
    }

    if(project) {
      throw new BadRequestException('Project name already exists in this team');
    }
    
    
    const newProject = await this.prisma.project.create({
      data:{
        ...createProjectDto,
        creatorId:id
      }
    })
    return newProject
    
  }

  public async findAll(companyId:string) {
    const company = await this.prisma.company.findUnique({
      where:{id:companyId},
      select:{
        id:true,
      }
   
    })
    if(!company) {
      throw new NotFoundException('Company does not exist')
    }

    const projects = await this.prisma.project.findMany({
      where:{companyId},
      orderBy:{
        createdAt:"desc"
      },
      include:{
        tasks:{
          select:{
            id:true,
            status:true
          }
        }
      }
      
    })
    const modifiedProjects = projects.map((project)=> {
      const totalTasks = project.tasks.length ;
      const completedTasks = project.tasks.filter((project)=> project.status==='DONE').length;
      const progress = project.tasks.length>0 ? Math.round((completedTasks/totalTasks)*100):0;
      return {
        ...project,
        progress
      }


    })

    return modifiedProjects;
    

  }
  public async findOne(id:string) {
    const project = await this.prisma.project.findUnique({
      where:{id},
      include:{
        team:{
          select:{
            name:true,
            id:true,
            teamMembers:{
              select:{
                id:true,
                userId:true,
                role:true
              }
            }
          }
        },
        _count:{
          select:{
            tasks:true
          }
        }
      }
    });
    if(!project) {
      throw new NotFoundException('project not exists')
    }
    return project

  }



  public async update(id: string, updateProjectDto: UpdateProjectDto,userId:string) {
      
        const project = await this.prisma.project.findUnique({
          where:{id},
          select:{
            id:true,
            team:{
              select:{
                teamMembers:{
                  select:{
                    userId:true,
                    role:true
                  }
                }
              }
            }
          }
        })
      
    
    if(!project) {
      throw new NotFoundException('Project dose not exist');
    }

    const projectTeamMembers = project.team.teamMembers;
    const memberIsExist = projectTeamMembers.find((member)=>member.userId=== userId)
    if(!memberIsExist) {
      throw new ForbiddenException('forbbiden')
    }
    if(memberIsExist.role ==='VIEWER') {
      throw new ForbiddenException('forbbiden')
    }

    const updatedProject = await this.prisma.project.update({
      where:{
        id:project.id
      },
      data:{
        ...updateProjectDto
      }
    })

    return updatedProject;



  }

  public async remove(id: string,userId:string) {
      
        const project = await this.prisma.project.findUnique({
          where:{id},
          include:{
            team:{
              select:{
                id:true,
                name:true,
                teamMembers:{
                  select:{
                    id:true,
                    role:true,
                    userId:true
                  }
                }
              }
            }
          }
        })
    if(!project) {
      throw new NotFoundException("project dose not exist")
    }

    const projectTeamMembers = project.team.teamMembers;
    const memberIsExist = projectTeamMembers.find((member)=>member.userId=== userId)
    if(project.creatorId !== userId && memberIsExist?.role !=='OWNER' ) {
      throw  new ForbiddenException('forbidden')

    }

    await this.prisma.project.delete({where:{id}});

    return {
      message:"project is deleted successfully"
    }



  }
}

