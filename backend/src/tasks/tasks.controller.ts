import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/types/request.interface';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: RequestWithUser) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: QueryTaskDto) {
    return this.tasksService.findAll(queryDto);
  }

  @Get('my')
  findMyTasks(@Request() req: RequestWithUser, @Query() queryDto: QueryTaskDto) {
    return this.tasksService.findMyTasks(req.user.id, queryDto);
  }

  @Get('department/:departmentId')
  findDepartmentTasks(
    @Param('departmentId') departmentId: string,
    @Query() queryDto: QueryTaskDto,
  ) {
    return this.tasksService.findDepartmentTasks(departmentId, queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tasksService.remove(id, req.user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.tasksService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/progress')
  updateProgress(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.tasksService.updateProgress(id, updateProgressDto);
  }

  @Post(':id/assign')
  assignUsers(
    @Param('id') id: string,
    @Body() assignTaskDto: AssignTaskDto,
  ) {
    return this.tasksService.assignUsers(id, assignTaskDto);
  }

  @Delete(':id/assign/:userId')
  unassignUser(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.tasksService.unassignUser(id, userId);
  }
}
