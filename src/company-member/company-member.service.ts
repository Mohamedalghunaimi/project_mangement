/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyMemberDto } from './dto/create-company-member.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyMemberService {
  constructor(private readonly prisma:PrismaService){}
  create(
    createCompanyMemberDto: CreateCompanyMemberDto,
    ownerId:string
  ) {
    const {userId,companyId} = createCompanyMemberDto
        return this.prisma.$transaction(async(prisma)=> {
            const existingCompany = await prisma.company.findFirst({
                where:{
                    id:companyId,
                    companyMembers:{
                        some:{
                            userId:ownerId,
                            role:{
                                in:['ADMIN',"OWNER"]
                            }
                        }
                    }

                }
            })
            if(!existingCompany) {
                throw new NotFoundException("company not found")
            }
            const existingMember = await prisma.companyMember.findUnique({
                where:{
                    userId_companyId:{
                        userId:userId,
                        companyId:existingCompany.id
                    }
                }
            })
            if(existingMember) {
                throw new BadRequestException("member is already exists")
            }
            const newMember = await prisma.companyMember.create({
                data:{
                    userId:userId,
                    role:"MEMBER",
                    companyId:existingCompany.id
                }
            })

            return newMember

        })

  }

  async findAll(userId:string,companyId:string) {
    const existingMember = await this.prisma.companyMember.findUnique({
      where:{
        userId_companyId:{
          userId,
          companyId
        }
      }
    })
    if(!existingMember) {
      throw new ForbiddenException("only company members can show this")
    }
    const members = await this.prisma.companyMember.findMany({
      where:{companyId},
      include:{
        user:{
          select:{
            name:true,
            id:true,
            email:true
          }
        }
      }
    });
    return members


    
  }



  

   remove(id: string,ownerId:string,companyId:string) {

    return this.prisma.$transaction(async(prisma)=> {
    
    const existingMember = await prisma.companyMember.findFirst({
      where:{
        id,
        companyId,
        role:{
          not:"OWNER"
        }
      },
      select:{
        id:true,
        companyId:true
      }
    })
    if(!existingMember) {
      throw new NotFoundException("member is already not found")
    }
    const ownerMember = await prisma.companyMember.findFirst({
      where:{
        userId:ownerId,
        companyId:existingMember.companyId,
        role:'OWNER'
      }

    })
    if(!ownerMember) {
      throw new ForbiddenException("forbidden")
    }
    if(ownerMember.id===id) {
      throw new ForbiddenException("forbidden")

    }
    await  prisma.companyMember.delete({
      where:{id:existingMember.id}
    })

    return "member is deleted successfully"
    })




  }
}
