import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { User, Role } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // Temporary in-memory storage (will be replaced with Prisma)
  private users: User[] = [];

  async create(email: string, password: string, name: string, role: Role = Role.USER): Promise<User> {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      email,
      password: hashedPassword,
      name,
      role,
      avatar: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  // Remove password from user object before sending to client
  sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...result } = user;
    return result;
  }
}
