import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { TaskStatus, Priority, TaskType } from '../common/enums';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  progress: number;
  type: TaskType;
  startDate?: Date;
  dueDate?: Date;
  createdById: string;
  departmentId?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedUserIds: string[];
}

@Injectable()
export class TasksService {
  private tasks: Map<string, Task> = new Map();
  private idCounter = 1;

  async create(createTaskDto: CreateTaskDto, createdById: string) {
    const { assignedUserIds, startDate, dueDate, ...taskData } = createTaskDto;

    const task: Task = {
      id: `task-${this.idCounter++}`,
      ...taskData,
      status: taskData.status || TaskStatus.TODO,
      priority: taskData.priority || Priority.MEDIUM,
      type: taskData.type || TaskType.PERSONAL,
      progress: taskData.progress !== undefined ? taskData.progress : 0,
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdById,
      assignedUserIds: assignedUserIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  async findAll(queryDto: QueryTaskDto) {
    let tasks = Array.from(this.tasks.values());

    // Apply filters
    if (queryDto.status) {
      tasks = tasks.filter((t) => t.status === queryDto.status);
    }
    if (queryDto.priority) {
      tasks = tasks.filter((t) => t.priority === queryDto.priority);
    }
    if (queryDto.type) {
      tasks = tasks.filter((t) => t.type === queryDto.type);
    }
    if (queryDto.departmentId) {
      tasks = tasks.filter((t) => t.departmentId === queryDto.departmentId);
    }
    if (queryDto.assignedUserId) {
      tasks = tasks.filter((t) => t.assignedUserIds.includes(queryDto.assignedUserId!));
    }
    if (queryDto.search) {
      const search = queryDto.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search),
      );
    }

    // Pagination
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    const total = tasks.length;
    const paginatedTasks = tasks.slice(skip, skip + limit);

    return {
      tasks: paginatedTasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findMyTasks(userId: string, queryDto: QueryTaskDto) {
    return this.findAll({
      ...queryDto,
      assignedUserId: userId,
    });
  }

  async findDepartmentTasks(departmentId: string, queryDto: QueryTaskDto) {
    return this.findAll({
      ...queryDto,
      departmentId,
    });
  }

  async findOne(id: string) {
    const task = this.tasks.get(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findOne(id);

    // Check permissions (optional)
    if (task.createdById !== userId) {
      // You can add permission check here if needed
    }

    const { startDate, dueDate, ...restDto } = updateTaskDto as any;

    const updatedTask: Task = {
      ...task,
      ...restDto,
      startDate: startDate ? new Date(startDate) : task.startDate,
      dueDate: dueDate ? new Date(dueDate) : task.dueDate,
      updatedAt: new Date(),
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const task = await this.findOne(id);
    const updatedTask = {
      ...task,
      status: updateStatusDto.status,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async updateProgress(id: string, updateProgressDto: UpdateProgressDto) {
    const task = await this.findOne(id);
    const updatedTask = {
      ...task,
      progress: updateProgressDto.progress,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async assignUsers(id: string, assignTaskDto: AssignTaskDto) {
    const task = await this.findOne(id);
    const updatedTask = {
      ...task,
      assignedUserIds: assignTaskDto.userIds,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async unassignUser(taskId: string, userId: string) {
    const task = await this.findOne(taskId);
    const updatedTask = {
      ...task,
      assignedUserIds: task.assignedUserIds.filter((uid) => uid !== userId),
      updatedAt: new Date(),
    };
    this.tasks.set(taskId, updatedTask);
    return { message: 'User unassigned successfully' };
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id);

    // Check permissions
    if (task.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    this.tasks.delete(id);
    return { message: 'Task deleted successfully' };
  }
}
