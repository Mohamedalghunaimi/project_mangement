/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete,  ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtGuard } from '../user/gurards/jwt.guard';
import { User } from '../company/decorators/user.decorator';
import * as interfaces from '../../utils/interfaces';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post("/:projectId")
  @ApiParam({name:"projectId",required:true})
  @ApiBody({type:CreateTaskDto})
  @ApiBearerAuth()
  public async create(
    @Body() createTaskDto: CreateTaskDto,
    @Param("projectId",new ParseUUIDPipe()) projectId:string,
    @User() user:interfaces.Payload
  ) {
    const newTask = await this.taskService.create(createTaskDto,projectId,user.id);
    return newTask
  }

  @Get("/:projectId")
  @ApiParam({name:"projectId",required:true})
  @ApiBearerAuth()
  findAll(
    @Param("projectId", new ParseUUIDPipe()) projectId:string,
    @User() user:interfaces.Payload

  ) {
    return this.taskService.findAll(projectId,user.id);
  }

  @Get('')
  public async findTasksforSingleUser(@User() user:interfaces.Payload) {
    const tasks = await this.taskService.findUserTasks(user.id)
    return tasks
  }

  @Patch(':id')
  @ApiParam({name:"id",required:true})
  @ApiBody({type:UpdateTaskDto})

  update(@Param('id',new ParseUUIDPipe(),) id: string, @Body() updateTaskDto: UpdateTaskDto,@User() user:interfaces.Payload) {
    return this.taskService.update(id, updateTaskDto,user.id);
  }

  @Delete(':id')
  @ApiParam({name:"id",required:true})
  remove(@Param('id',new ParseUUIDPipe(),) id: string,@User() user:interfaces.Payload) {
    return this.taskService.remove(id,user.id);
  }
}
