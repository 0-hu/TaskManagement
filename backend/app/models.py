from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    COMPLETED = "completed"


class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Assignee(BaseModel):
    name: str
    avatarUrl: Optional[str] = Field(None, serialization_alias="avatarUrl")


class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: Priority
    progress: int = Field(ge=0, le=100)
    dueDate: str = Field(alias="dueDate")
    assignees: List[Assignee]
    tags: Optional[List[str]] = None
    category: str

    class Config:
        populate_by_name = True


class Summary(BaseModel):
    total: int
    inProgress: int
    blocked: int
    planned: int


class SubmissionStatus(str, Enum):
    SUBMITTED = "submitted"
    WAITING = "waiting"
    REJECTED = "rejected"
    APPROVED = "approved"


class Submission(BaseModel):
    id: str
    title: str
    team: str
    owner: str
    dueDate: str = Field(alias="dueDate")
    status: SubmissionStatus

    class Config:
        populate_by_name = True
