from pydantic import BaseModel
from typing import Optional
from enum import Enum


class SubmissionStatus(str, Enum):
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class SubmissionCreate(BaseModel):
    taskId: str
    comment: Optional[str] = None


class SubmissionApprove(BaseModel):
    feedback: Optional[str] = None


class SubmissionReject(BaseModel):
    feedback: str


class Submission(BaseModel):
    id: str
    taskId: str
    submittedBy: str
    comment: Optional[str] = None
    status: SubmissionStatus
    feedback: Optional[str] = None
    submittedAt: str
    reviewedAt: Optional[str] = None
