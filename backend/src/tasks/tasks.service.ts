import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, createdById: string) {
    const { assignedUserIds, ...taskData } = createTaskDto;

    const task = await this.prisma.task.create({
      data: {
        ...taskData,
        createdById,
        assignments: assignedUserIds
          ? {
              create: assignedUserIds.map((userId) => ({
                userId,
              })),
            }
          : undefined,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        department: true,
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
    });

    return task;
  }

  async findAll(queryDto: QueryTaskDto) {
    const {
      status,
      priority,
      type,
      departmentId,
      assignedUserId,
      search,
      page = 1,
      limit = 20,
    } = queryDto;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (type) where.type = type;
    if (departmentId) where.departmentId = departmentId;
    if (assignedUserId) {
      where.assignments = {
        some: { userId: assignedUserId },
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          department: true,
          assignments: {
            include: {
              user: { select: { id: true, name: true, email: true, avatar: true } },
            },
          },
          _count: {
            select: { comments: true, attachments: true },
          },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true, avatar: true } },
        department: true,
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: true,
        submissions: {
          include: {
            submittedByUser: { select: { id: true, name: true, email: true } },
          },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findOne(id);

    // Check if user has permission to update
    const isCreator = task.createdById === userId;
    const isAssigned = task.assignments.some((a: { userId: string }) => a.userId === userId);

    if (!isCreator && !isAssigned) {
      throw new ForbiddenException('You do not have permission to update this task');
    }

    const { assignedUserIds, ...taskData } = updateTaskDto as CreateTaskDto;

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        assignments: assignedUserIds
          ? {
              deleteMany: {},
              create: assignedUserIds.map((userId: string) => ({
                userId,
              })),
            }
          : undefined,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        department: true,
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
    });

    return updatedTask;
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id);

    // Only creator can delete
    if (task.createdById !== userId) {
      throw new ForbiddenException('Only the task creator can delete this task');
    }

    await this.prisma.task.delete({ where: { id } });

    return { message: 'Task deleted successfully' };
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const task = await this.prisma.task.update({
      where: { id },
      data: { status: updateStatusDto.status },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
    });

    return task;
  }

  async updateProgress(id: string, updateProgressDto: UpdateProgressDto) {
    const task = await this.prisma.task.update({
      where: { id },
      data: { progress: updateProgressDto.progress },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
    });

    return task;
  }

  async assignUsers(id: string, assignTaskDto: AssignTaskDto) {
    await this.findOne(id); // Check if task exists

    // Remove existing assignments
    await this.prisma.taskAssignment.deleteMany({
      where: { taskId: id },
    });

    // Create new assignments
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        assignments: {
          create: assignTaskDto.userIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
    });

    return task;
  }

  async unassignUser(taskId: string, userId: string) {
    await this.findOne(taskId); // Check if task exists

    await this.prisma.taskAssignment.deleteMany({
      where: {
        taskId,
        userId,
      },
    });

    return { message: 'User unassigned successfully' };
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
}
