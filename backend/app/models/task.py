from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class TaskStatus(str, Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    ON_HOLD = "ON_HOLD"


class Priority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class TaskType(str, Enum):
    PERSONAL = "PERSONAL"
    DEPARTMENT = "DEPARTMENT"


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.TODO
    priority: Optional[Priority] = Priority.MEDIUM
    progress: Optional[int] = 0
    type: Optional[TaskType] = TaskType.PERSONAL
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    departmentId: Optional[str] = None
    assignedUserIds: Optional[List[str]] = []


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[Priority] = None
    progress: Optional[int] = None
    type: Optional[TaskType] = None
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    departmentId: Optional[str] = None
    assignedUserIds: Optional[List[str]] = None


class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: Priority
    progress: int
    type: TaskType
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    createdById: str
    departmentId: Optional[str] = None
    createdAt: str
    updatedAt: str


class TaskResponse(Task):
    assignedUserIds: List[str] = []
