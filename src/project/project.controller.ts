/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtGuard } from '../user/gurards/jwt.guard';
import express from 'express';
import { Payload } from 'utils/interfaces';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('project')
@UseGuards(JwtGuard)
@ApiTags("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({
    type: CreateProjectDto,
  })
  public async create(@Body() createProjectDto: CreateProjectDto,@Req() req:express.Request) {
    const user = req.user as Payload ;
    const result = await this.projectService.create(createProjectDto,user.id );
    return result
  }

  @Get(":companyId")
  @ApiBearerAuth()
  @ApiParam({ name: 'companyId', type:String})

  public async findAll(
    @Param('companyId',new ParseUUIDPipe()) companyId:string
  ) {
    const result = await this.projectService.findAll(companyId);
    return result
  }

  @Get('single-project/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type:String,required:true})

  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type:String,required:true})
  @ApiBody({
    type:  UpdateProjectDto,
  })
  update(@Param('id',new ParseUUIDPipe()) id: string, @Body() updateProjectDto: UpdateProjectDto,@Req() req:express.Request) {
    const user = req.user as Payload
    return this.projectService.update(id, updateProjectDto,user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type:String,required:true})

  remove(@Param('id',new ParseUUIDPipe()) id: string,@Req() req:express.Request) {
    const user = req.user as Payload

    return this.projectService.remove(id,user.id);
  }
}
