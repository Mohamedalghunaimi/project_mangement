/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable,  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompany } from './dtos/CreateCompany.dto';
import { TeamService } from '../team/team.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as fs from 'fs';
@Injectable()
export class CompanyService {

    constructor(
        private readonly prisma:PrismaService,
        private readonly teamService:TeamService,
        private readonly cloudinaryService:CloudinaryService
    ){}
    
    public async createCompany(dto:CreateCompany,userId:string,image?:Express.Multer.File) {
        const {name,description} = dto
        const company = await this.prisma.company.findUnique({where:{name}});
        if(company) {
            throw new BadRequestException("company name is already exist");
        }
        let logo :string | undefined = undefined ;
        if(image) {
            try {
                const result = await this.cloudinaryService.uploadImageOnCloud(image, "companyImages");
                logo = result?.secure_url;
            } catch (error) {
                console.error(error)
                throw new BadRequestException("Failed to upload company logo");
            } finally {
                if(fs.existsSync(image.path)) {
                    fs.unlinkSync(image.path)
                }
                
            }
        }
        return this.prisma.$transaction(async(tx)=> {
        const createdCompany = await tx.company.create({
            data:{
                description,
                name,
                logo,
                companyMembers :{
                    create :{
                        userId,
                        role:"OWNER"
                    }
                }
            }
        })

        await this.teamService.create({name,companyId:createdCompany.id},userId,tx);
        await tx.companyMember.create({
            data:{
                userId,
                companyId:createdCompany.id,
                role:"OWNER"
            }
        })
        return createdCompany
        })
        
    }

    public async getDashboardInfo(companyId:string,userId:string) {

        const company =await this.prisma.company.findUnique({where:{id:companyId},select:{id:true,companyMembers:true}})
        if(!company) {
            throw new BadRequestException("company is not exist")
        }
        const {companyMembers} = company ;
        const member = companyMembers.find((member)=> member.userId === userId);
        if(!member) {
            throw new ForbiddenException("forbidden")
        }

        const [Projects,doneProjects,myTasks,overdayTasks,recentProjects] = await Promise.all(
            [
                this.prisma.project.aggregate({where:{companyId},_count:true}),
                this.prisma.project.aggregate({where:{companyId,status:"COMPLETED"},_count:true}),
                this.prisma.task.findMany({where:{assigneeId:userId}}),
                this.prisma.task.aggregate({where:{dueTime:{lt:new Date()},status:{not:"DONE"},assigneeId:userId},_count:true}),
                this.prisma.project.findMany({
                    take:5,
                    where:{companyId},
                    include:{
                        tasks:{
                            select:{
                                status:true,
                                id:true
                            }
                        }
                    }
                })
                
            ]
        )

        const projectsInfo = recentProjects.map((project)=> {
            let progress = 0;
            const completedtasks = project.tasks.filter((task)=>task.status==='DONE').length;
            const totalTasks = project.tasks.length;
            if(totalTasks>0) {
                progress = Math.round((completedtasks / totalTasks)*100);

            }
            return {
                ...project,
                progress

            }
        })
        



        
        const companyInfo = {
            totalProjects : Projects._count,
            myTasks ,
            overdayTasks:overdayTasks._count,
            doneProjects:doneProjects._count,
            recentProjects:projectsInfo



        }
        return companyInfo

    }




}
