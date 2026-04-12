/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body,  Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CompanyMemberService } from './company-member.service';
import { CreateCompanyMemberDto } from './dto/create-company-member.dto';
import { JwtGuard } from 'src/user/gurards/jwt.guard';
import { User } from 'src/company/decorators/user.decorator';
import type { Payload } from 'utils/interfaces';

@Controller('company-members')
@UseGuards(JwtGuard)
export class CompanyMemberController {
  constructor(private readonly companyMemberService: CompanyMemberService) {}

  @Post()
  create(
    @Body() createCompanyMemberDto: CreateCompanyMemberDto,
    @User() user:Payload
  ) {
    return this.companyMemberService.create(createCompanyMemberDto,user.id);
  }

  @Get(":companyId")
  findAll(
    @Param("companyId",new ParseUUIDPipe()) companyId:string,
    @User() user:Payload
  ) {
    return this.companyMemberService.findAll(user.id,companyId);
  }


  @Delete(':id')
  remove(
    @Param('id',new ParseUUIDPipe()) id: string,
    @Body("companyId",new ParseUUIDPipe()) companyId:string,
    @User() user:Payload
  ) {
    return this.companyMemberService.remove(id,user.id,companyId);
  }
}
