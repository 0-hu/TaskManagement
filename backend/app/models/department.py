from pydantic import BaseModel
from typing import Optional
from enum import Enum


class DepartmentRole(str, Enum):
    LEADER = "LEADER"
    MEMBER = "MEMBER"


class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class Department(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    createdAt: str
    updatedAt: str


class AddMemberRequest(BaseModel):
    userId: str
    role: Optional[DepartmentRole] = DepartmentRole.MEMBER
