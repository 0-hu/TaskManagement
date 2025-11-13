export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskType {
  PERSONAL = 'PERSONAL',
  DEPARTMENT = 'DEPARTMENT',
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  progress: number
  type: TaskType
  startDate?: string
  dueDate?: string
  createdById: string
  departmentId?: string
  createdAt: string
  updatedAt: string
}

export interface TaskAssignment {
  id: string
  taskId: string
  userId: string
  assignedAt: string
}

export interface TaskSubmission {
  id: string
  taskId: string
  submittedBy: string
  status: SubmissionStatus
  comment?: string
  feedback?: string
  submittedAt: string
  reviewedAt?: string
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
