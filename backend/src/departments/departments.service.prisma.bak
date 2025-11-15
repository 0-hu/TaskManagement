import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = await this.prisma.department.create({
      data: createDepartmentDto,
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
    });

    return department;
  }

  async findAll() {
    const departments = await this.prisma.department.findMany({
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return departments;
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        tasks: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
            assignments: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatar: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    await this.findOne(id); // Check if exists

    const department = await this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
    });

    return department;
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    await this.prisma.department.delete({ where: { id } });

    return { message: 'Department deleted successfully' };
  }

  async addMember(departmentId: string, addMemberDto: AddMemberDto) {
    await this.findOne(departmentId); // Check if department exists

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: addMemberDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${addMemberDto.userId} not found`,
      );
    }

    // Check if user is already a member
    const existingMember = await this.prisma.departmentMember.findUnique({
      where: {
        userId_departmentId: {
          userId: addMemberDto.userId,
          departmentId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this department');
    }

    const member = await this.prisma.departmentMember.create({
      data: {
        userId: addMemberDto.userId,
        departmentId,
        role: addMemberDto.role || 'MEMBER',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        department: true,
      },
    });

    return member;
  }

  async removeMember(departmentId: string, userId: string) {
    await this.findOne(departmentId); // Check if department exists

    const member = await this.prisma.departmentMember.findUnique({
      where: {
        userId_departmentId: {
          userId,
          departmentId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('User is not a member of this department');
    }

    await this.prisma.departmentMember.delete({
      where: {
        userId_departmentId: {
          userId,
          departmentId,
        },
      },
    });

    return { message: 'Member removed successfully' };
  }

  async getMembers(departmentId: string) {
    await this.findOne(departmentId); // Check if exists

    const members = await this.prisma.departmentMember.findMany({
      where: { departmentId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return members;
  }
}
