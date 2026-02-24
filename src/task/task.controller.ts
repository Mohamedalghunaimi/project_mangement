/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete,  ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtGuard } from 'src/user/gurards/jwt.guard';
import { User } from 'src/company/decorators/user.decorator';
import * as interfaces from 'utils/interfaces';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post("/:id")
  public async create(
    @Body() createTaskDto: CreateTaskDto,
    @Param("id",new ParseUUIDPipe()) projectId:string,
    @User() user:interfaces.Payload
  ) {
    const newTask = await this.taskService.create(createTaskDto,projectId,user.id);
    return newTask
  }

  @Get("/:projectId")
  findAll(@Param("projectId", new ParseUUIDPipe()) projectId:string) {
    return this.taskService.findAll(projectId);
  }

  @Get('')
  public async findTasksforSingleUser(@User() user:interfaces.Payload) {
    const tasks = await this.taskService.findUserTasks(user.id)
    return tasks
  }

  @Patch(':id')
  update(@Param('id',new ParseUUIDPipe(),) id: string, @Body() updateTaskDto: UpdateTaskDto,@User() user:interfaces.Payload) {
    return this.taskService.update(id, updateTaskDto,user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@User() user:interfaces.Payload) {
    return this.taskService.remove(id,user.id);
  }
}
