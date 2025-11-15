import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AddMemberDto } from './dto/add-member.dto';

export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentMember {
  id: string;
  userId: string;
  departmentId: string;
  role: 'LEADER' | 'MEMBER';
  joinedAt: Date;
}

@Injectable()
export class DepartmentsService {
  private departments: Map<string, Department> = new Map();
  private members: Map<string, DepartmentMember> = new Map();
  private idCounter = 1;

  async create(createDepartmentDto: CreateDepartmentDto) {
    const department: Department = {
      id: `dept-${this.idCounter++}`,
      ...createDepartmentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.departments.set(department.id, department);
    return department;
  }

  async findAll() {
    return Array.from(this.departments.values());
  }

  async findOne(id: string) {
    const department = this.departments.get(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    // Get members for this department
    const departmentMembers = Array.from(this.members.values()).filter(
      (m) => m.departmentId === id,
    );

    return {
      ...department,
      members: departmentMembers,
    };
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.findOne(id);

    const updated: Department = {
      ...department,
      ...updateDepartmentDto,
      updatedAt: new Date(),
    };

    this.departments.set(id, updated);
    return updated;
  }

  async remove(id: string) {
    const department = this.departments.get(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    // Remove all members
    Array.from(this.members.values())
      .filter((m) => m.departmentId === id)
      .forEach((m) => this.members.delete(m.id));

    this.departments.delete(id);
    return { message: 'Department deleted successfully' };
  }

  async addMember(id: string, addMemberDto: AddMemberDto) {
    const department = await this.findOne(id);

    // Check if member already exists
    const existing = Array.from(this.members.values()).find(
      (m) => m.userId === addMemberDto.userId && m.departmentId === id,
    );

    if (existing) {
      throw new ConflictException('User is already a member of this department');
    }

    const member: DepartmentMember = {
      id: `member-${Date.now()}`,
      userId: addMemberDto.userId,
      departmentId: id,
      role: addMemberDto.role || 'MEMBER',
      joinedAt: new Date(),
    };

    this.members.set(member.id, member);
    return member;
  }

  async removeMember(departmentId: string, userId: string) {
    const member = Array.from(this.members.values()).find(
      (m) => m.userId === userId && m.departmentId === departmentId,
    );

    if (!member) {
      throw new NotFoundException('Member not found in this department');
    }

    this.members.delete(member.id);
    return { message: 'Member removed successfully' };
  }

  async updateMemberRole(
    departmentId: string,
    userId: string,
    role: 'LEADER' | 'MEMBER',
  ) {
    const member = Array.from(this.members.values()).find(
      (m) => m.userId === userId && m.departmentId === departmentId,
    );

    if (!member) {
      throw new NotFoundException('Member not found in this department');
    }

    const updated = { ...member, role };
    this.members.set(member.id, updated);
    return updated;
  }

  async getMembers(departmentId: string) {
    await this.findOne(departmentId); // Check if department exists

    return Array.from(this.members.values()).filter(
      (m) => m.departmentId === departmentId,
    );
  }
}
