import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';
import { RejectSubmissionDto } from './dto/reject-submission.dto';
import { QuerySubmissionDto } from './dto/query-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubmissionDto: CreateSubmissionDto, userId: string) {
    const { taskId, comment } = createSubmissionDto;

    // Check if task exists
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check if user is assigned to the task
    const assignment = await this.prisma.taskAssignment.findFirst({
      where: {
        taskId,
        userId,
      },
    });

    if (!assignment) {
      throw new BadRequestException(
        'You must be assigned to this task to submit it',
      );
    }

    // Create submission
    const submission = await this.prisma.taskSubmission.create({
      data: {
        taskId,
        submittedBy: userId,
        comment,
        status: 'SUBMITTED',
      },
      include: {
        task: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        submittedByUser: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    return submission;
  }

  async findAll(queryDto: QuerySubmissionDto) {
    const {
      status,
      taskId,
      submittedBy,
      page = 1,
      limit = 20,
    } = queryDto;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (taskId) where.taskId = taskId;
    if (submittedBy) where.submittedBy = submittedBy;

    const [submissions, total] = await Promise.all([
      this.prisma.taskSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          task: {
            include: {
              createdBy: {
                select: { id: true, name: true, email: true },
              },
              department: true,
            },
          },
          submittedByUser: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      }),
      this.prisma.taskSubmission.count({ where }),
    ]);

    return {
      data: submissions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const submission = await this.prisma.taskSubmission.findUnique({
      where: { id },
      include: {
        task: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
            department: true,
            attachments: true,
          },
        },
        submittedByUser: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    return submission;
  }

  async approve(id: string, approveDto: ApproveSubmissionDto) {
    const submission = await this.findOne(id);

    if (submission.status === 'APPROVED') {
      throw new BadRequestException('Submission is already approved');
    }

    const updatedSubmission = await this.prisma.taskSubmission.update({
      where: { id },
      data: {
        status: 'APPROVED',
        feedback: approveDto.feedback,
        reviewedAt: new Date(),
      },
      include: {
        task: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        submittedByUser: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Update task status to COMPLETED
    await this.prisma.task.update({
      where: { id: submission.taskId },
      data: {
        status: 'COMPLETED',
        progress: 100,
      },
    });

    return updatedSubmission;
  }

  async reject(id: string, rejectDto: RejectSubmissionDto) {
    const submission = await this.findOne(id);

    if (submission.status === 'REJECTED') {
      throw new BadRequestException('Submission is already rejected');
    }

    const updatedSubmission = await this.prisma.taskSubmission.update({
      where: { id },
      data: {
        status: 'REJECTED',
        feedback: rejectDto.feedback,
        reviewedAt: new Date(),
      },
      include: {
        task: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        submittedByUser: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Update task status back to IN_PROGRESS
    await this.prisma.task.update({
      where: { id: submission.taskId },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    return updatedSubmission;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.taskSubmission.delete({ where: { id } });

    return { message: 'Submission deleted successfully' };
  }
}
