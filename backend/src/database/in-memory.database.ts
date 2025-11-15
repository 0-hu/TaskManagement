import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  progress: number;
  type: 'PERSONAL' | 'DEPARTMENT';
  startDate?: Date;
  dueDate?: Date;
  createdById: string;
  departmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  assignedAt: Date;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  submittedBy: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  comment?: string;
  feedback?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

@Injectable()
export class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private departments: Map<string, Department> = new Map();
  private departmentMembers: Map<string, DepartmentMember> = new Map();
  private tasks: Map<string, Task> = new Map();
  private taskAssignments: Map<string, TaskAssignment> = new Map();
  private taskSubmissions: Map<string, TaskSubmission> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some initial data if needed
    console.log('📦 In-memory database initialized');
  }

  // User methods
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const id = this.generateId();
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  findAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(id: string, data: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Department methods
  createDepartment(
    dept: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>,
  ): Department {
    const id = this.generateId();
    const newDept: Department = {
      ...dept,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.departments.set(id, newDept);
    return newDept;
  }

  findDepartmentById(id: string): Department | undefined {
    return this.departments.get(id);
  }

  findAllDepartments(): Department[] {
    return Array.from(this.departments.values());
  }

  updateDepartment(id: string, data: Partial<Department>): Department | undefined {
    const dept = this.departments.get(id);
    if (!dept) return undefined;
    const updated = { ...dept, ...data, updatedAt: new Date() };
    this.departments.set(id, updated);
    return updated;
  }

  deleteDepartment(id: string): boolean {
    return this.departments.delete(id);
  }

  // Department Member methods
  createDepartmentMember(
    member: Omit<DepartmentMember, 'id' | 'joinedAt'>,
  ): DepartmentMember {
    const id = this.generateId();
    const newMember: DepartmentMember = {
      ...member,
      id,
      joinedAt: new Date(),
    };
    this.departmentMembers.set(id, newMember);
    return newMember;
  }

  findDepartmentMembers(departmentId: string): DepartmentMember[] {
    return Array.from(this.departmentMembers.values()).filter(
      (m) => m.departmentId === departmentId,
    );
  }

  deleteDepartmentMember(userId: string, departmentId: string): boolean {
    const member = Array.from(this.departmentMembers.values()).find(
      (m) => m.userId === userId && m.departmentId === departmentId,
    );
    if (!member) return false;
    return this.departmentMembers.delete(member.id);
  }

  // Task methods
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const id = this.generateId();
    const newTask: Task = {
      ...task,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  findTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  findAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  findTasksByUserId(userId: string): Task[] {
    const assignedTaskIds = Array.from(this.taskAssignments.values())
      .filter((a) => a.userId === userId)
      .map((a) => a.taskId);

    return Array.from(this.tasks.values()).filter(
      (t) => t.createdById === userId || assignedTaskIds.includes(t.id),
    );
  }

  findTasksByDepartmentId(departmentId: string): Task[] {
    return Array.from(this.tasks.values()).filter(
      (t) => t.departmentId === departmentId,
    );
  }

  updateTask(id: string, data: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    const updated = { ...task, ...data, updatedAt: new Date() };
    this.tasks.set(id, updated);
    return updated;
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  // Task Assignment methods
  createTaskAssignment(
    assignment: Omit<TaskAssignment, 'id' | 'assignedAt'>,
  ): TaskAssignment {
    const id = this.generateId();
    const newAssignment: TaskAssignment = {
      ...assignment,
      id,
      assignedAt: new Date(),
    };
    this.taskAssignments.set(id, newAssignment);
    return newAssignment;
  }

  findTaskAssignments(taskId: string): TaskAssignment[] {
    return Array.from(this.taskAssignments.values()).filter(
      (a) => a.taskId === taskId,
    );
  }

  // Task Submission methods
  createTaskSubmission(
    submission: Omit<TaskSubmission, 'id' | 'submittedAt'>,
  ): TaskSubmission {
    const id = this.generateId();
    const newSubmission: TaskSubmission = {
      ...submission,
      id,
      submittedAt: new Date(),
    };
    this.taskSubmissions.set(id, newSubmission);
    return newSubmission;
  }

  findTaskSubmissionById(id: string): TaskSubmission | undefined {
    return this.taskSubmissions.get(id);
  }

  findAllTaskSubmissions(): TaskSubmission[] {
    return Array.from(this.taskSubmissions.values());
  }

  updateTaskSubmission(
    id: string,
    data: Partial<TaskSubmission>,
  ): TaskSubmission | undefined {
    const submission = this.taskSubmissions.get(id);
    if (!submission) return undefined;
    const updated = { ...submission, ...data };
    this.taskSubmissions.set(id, updated);
    return updated;
  }

  // Helper method
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear all data (useful for testing)
  clearAll() {
    this.users.clear();
    this.departments.clear();
    this.departmentMembers.clear();
    this.tasks.clear();
    this.taskAssignments.clear();
    this.taskSubmissions.clear();
    this.seedData();
  }
}
