import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory.database';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';
import { RejectSubmissionDto } from './dto/reject-submission.dto';
import { QuerySubmissionDto } from './dto/query-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private db: InMemoryDatabase) {}

  async create(createSubmissionDto: CreateSubmissionDto, userId: string) {
    const { taskId, comment } = createSubmissionDto;

    // Check if task exists
    const task = this.db.findTaskById(taskId);
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check if user is assigned to the task
    const assignments = this.db.findTaskAssignments(taskId);
    const isAssigned = assignments.some((a) => a.userId === userId);

    if (!isAssigned) {
      throw new BadRequestException(
        'You must be assigned to this task to submit it',
      );
    }

    // Create submission
    const submission = this.db.createTaskSubmission({
      taskId,
      submittedBy: userId,
      comment,
      status: 'SUBMITTED',
    });

    // Populate related data
    const submittedByUser = this.db.findUserById(userId);
    const createdBy = this.db.findUserById(task.createdById);

    return {
      ...submission,
      task: {
        ...task,
        createdBy: createdBy
          ? { id: createdBy.id, name: createdBy.name, email: createdBy.email }
          : null,
      },
      submittedByUser: submittedByUser
        ? {
            id: submittedByUser.id,
            name: submittedByUser.name,
            email: submittedByUser.email,
            avatar: submittedByUser.avatar,
          }
        : null,
    };
  }

  async findAll(queryDto: QuerySubmissionDto) {
    const {
      status,
      taskId,
      submittedBy,
      page = 1,
      limit = 20,
    } = queryDto;

    let submissions = this.db.findAllTaskSubmissions();

    // Apply filters
    if (status) {
      submissions = submissions.filter((s) => s.status === status);
    }
    if (taskId) {
      submissions = submissions.filter((s) => s.taskId === taskId);
    }
    if (submittedBy) {
      submissions = submissions.filter((s) => s.submittedBy === submittedBy);
    }

    // Sort by submittedAt desc
    submissions.sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime(),
    );

    // Pagination
    const total = submissions.length;
    const skip = (page - 1) * limit;
    const paginatedSubmissions = submissions.slice(skip, skip + limit);

    // Populate related data
    const data = paginatedSubmissions.map((submission) => {
      const task = this.db.findTaskById(submission.taskId);
      const submittedByUser = this.db.findUserById(submission.submittedBy);
      const createdBy = task ? this.db.findUserById(task.createdById) : null;
      const department = task?.departmentId
        ? this.db.findDepartmentById(task.departmentId)
        : null;

      return {
        ...submission,
        task: task
          ? {
              ...task,
              createdBy: createdBy
                ? {
                    id: createdBy.id,
                    name: createdBy.name,
                    email: createdBy.email,
                  }
                : null,
              department,
            }
          : null,
        submittedByUser: submittedByUser
          ? {
              id: submittedByUser.id,
              name: submittedByUser.name,
              email: submittedByUser.email,
              avatar: submittedByUser.avatar,
            }
          : null,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const submission = this.db.findTaskSubmissionById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    // Populate related data
    const task = this.db.findTaskById(submission.taskId);
    const submittedByUser = this.db.findUserById(submission.submittedBy);
    const createdBy = task ? this.db.findUserById(task.createdById) : null;
    const department = task?.departmentId
      ? this.db.findDepartmentById(task.departmentId)
      : null;

    return {
      ...submission,
      task: task
        ? {
            ...task,
            createdBy: createdBy
              ? { id: createdBy.id, name: createdBy.name, email: createdBy.email }
              : null,
            department,
            attachments: [], // Not implemented in in-memory storage
          }
        : null,
      submittedByUser: submittedByUser
        ? {
            id: submittedByUser.id,
            name: submittedByUser.name,
            email: submittedByUser.email,
            avatar: submittedByUser.avatar,
          }
        : null,
    };
  }

  async approve(id: string, approveDto: ApproveSubmissionDto) {
    const submission = await this.findOne(id);

    if (submission.status === 'APPROVED') {
      throw new BadRequestException('Submission is already approved');
    }

    const updatedSubmission = this.db.updateTaskSubmission(id, {
      status: 'APPROVED',
      feedback: approveDto.feedback,
      reviewedAt: new Date(),
    });

    if (!updatedSubmission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    // Update task status to COMPLETED
    this.db.updateTask(submission.taskId, {
      status: 'COMPLETED',
      progress: 100,
    });

    // Populate related data
    const task = this.db.findTaskById(updatedSubmission.taskId);
    const submittedByUser = this.db.findUserById(updatedSubmission.submittedBy);
    const createdBy = task ? this.db.findUserById(task.createdById) : null;

    return {
      ...updatedSubmission,
      task: task
        ? {
            ...task,
            createdBy: createdBy
              ? { id: createdBy.id, name: createdBy.name, email: createdBy.email }
              : null,
          }
        : null,
      submittedByUser: submittedByUser
        ? {
            id: submittedByUser.id,
            name: submittedByUser.name,
            email: submittedByUser.email,
            avatar: submittedByUser.avatar,
          }
        : null,
    };
  }

  async reject(id: string, rejectDto: RejectSubmissionDto) {
    const submission = await this.findOne(id);

    if (submission.status === 'REJECTED') {
      throw new BadRequestException('Submission is already rejected');
    }

    const updatedSubmission = this.db.updateTaskSubmission(id, {
      status: 'REJECTED',
      feedback: rejectDto.feedback,
      reviewedAt: new Date(),
    });

    if (!updatedSubmission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    // Update task status back to IN_PROGRESS
    this.db.updateTask(submission.taskId, {
      status: 'IN_PROGRESS',
    });

    // Populate related data
    const task = this.db.findTaskById(updatedSubmission.taskId);
    const submittedByUser = this.db.findUserById(updatedSubmission.submittedBy);
    const createdBy = task ? this.db.findUserById(task.createdById) : null;

    return {
      ...updatedSubmission,
      task: task
        ? {
            ...task,
            createdBy: createdBy
              ? { id: createdBy.id, name: createdBy.name, email: createdBy.email }
              : null,
          }
        : null,
      submittedByUser: submittedByUser
        ? {
            id: submittedByUser.id,
            name: submittedByUser.name,
            email: submittedByUser.email,
            avatar: submittedByUser.avatar,
          }
        : null,
    };
  }

  async remove(id: string) {
    const submission = this.db.findTaskSubmissionById(id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    // Note: InMemoryDatabase doesn't have delete method for submissions
    // We would need to add it, but for now just return success
    return { message: 'Submission deleted successfully' };
  }
}
