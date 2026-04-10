/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtGuard } from '../user/gurards/jwt.guard';
import express from 'express';
import { Payload } from 'utils/interfaces';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('project')
@UseGuards(JwtGuard)

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
    @ApiSecurity("bearer")

  public async create(@Body() createProjectDto: CreateProjectDto,@Req() req:express.Request) {
    const user = req.user as Payload ;
    const result = await this.projectService.create(createProjectDto,user.id );
    return result
  }

  @Get(":companyId")

  public async findAll(
    @Param('companyId',new ParseUUIDPipe()) companyId:string
  ) {
    const result = await this.projectService.findAll(companyId);
    return result
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @ApiSecurity("bearer")

  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto,@Req() req:express.Request) {
    const user = req.user as Payload
    return this.projectService.update(id, updateProjectDto,user.id);
  }

  @Delete(':id')
  @ApiSecurity("bearer")

  remove(@Param('id') id: string,@Req() req:express.Request) {
    const user = req.user as Payload

    return this.projectService.remove(id,user.id);
  }
}
