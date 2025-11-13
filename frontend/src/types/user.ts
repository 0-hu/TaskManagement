export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: Role
  createdAt: string
  updatedAt: string
}

export interface Department {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export enum DepartmentRole {
  LEADER = 'LEADER',
  MEMBER = 'MEMBER',
}

export interface DepartmentMember {
  id: string
  userId: string
  departmentId: string
  role: DepartmentRole
  joinedAt: string
}
