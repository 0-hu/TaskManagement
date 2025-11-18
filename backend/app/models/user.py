from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class Role(str, Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    USER = "USER"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Optional[Role] = Role.USER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: str
    email: str
    name: str
    role: Role
    avatar: Optional[str] = None
    createdAt: str
    updatedAt: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: Role
    avatar: Optional[str] = None
    createdAt: str
    updatedAt: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
