from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models.department import DepartmentCreate, DepartmentUpdate, Department, AddMemberRequest, DepartmentRole
from app.database.json_db import db
from app.utils.security import get_current_user
import uuid

router = APIRouter(prefix="/departments", tags=["departments"])


@router.post("", response_model=Department, status_code=status.HTTP_201_CREATED)
async def create_department(dept_data: DepartmentCreate, current_user: dict = Depends(get_current_user)):
    """Create a new department"""
    dept_id = str(uuid.uuid4())

    new_department = {
        "id": dept_id,
        "name": dept_data.name,
        "description": dept_data.description,
        "createdById": current_user["id"],
    }

    db.insert_one("departments", new_department)

    # Add creator as leader
    leader_membership = {
        "id": str(uuid.uuid4()),
        "departmentId": dept_id,
        "userId": current_user["id"],
        "role": DepartmentRole.LEADER,
    }
    db.insert_one("department_members", leader_membership)

    return Department(**new_department)


@router.get("", response_model=List[Department])
async def get_departments(current_user: dict = Depends(get_current_user)):
    """Get all departments"""
    departments = db.get_collection("departments")
    return [Department(**dept) for dept in departments]


@router.get("/{dept_id}", response_model=Department)
async def get_department(dept_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific department"""
    department = db.find_one("departments", {"id": dept_id})
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    return Department(**department)


@router.patch("/{dept_id}", response_model=Department)
async def update_department(
    dept_id: str,
    dept_data: DepartmentUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a department"""
    department = db.find_one("departments", {"id": dept_id})
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    # Check if user is department leader or creator
    membership = db.find_one("department_members", {
        "departmentId": dept_id,
        "userId": current_user["id"],
        "role": DepartmentRole.LEADER
    })

    if not membership and department["createdById"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only department leaders can update the department"
        )

    # Update fields
    update_dict = dept_data.model_dump(exclude_unset=True)
    updated_department = db.update_one("departments", {"id": dept_id}, update_dict)

    return Department(**updated_department)


@router.delete("/{dept_id}")
async def delete_department(dept_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a department"""
    department = db.find_one("departments", {"id": dept_id})
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    # Check if user is the creator
    if department["createdById"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the department creator can delete this department"
        )

    # Delete department and related data
    db.delete_many("department_members", {"departmentId": dept_id})
    # Also update tasks to remove department reference
    dept_tasks = db.find_many("tasks", {"departmentId": dept_id})
    for task in dept_tasks:
        db.update_one("tasks", {"id": task["id"]}, {"departmentId": None})

    db.delete_one("departments", {"id": dept_id})

    return {"message": "Department deleted successfully"}


@router.post("/{dept_id}/members")
async def add_member(
    dept_id: str,
    member_data: AddMemberRequest,
    current_user: dict = Depends(get_current_user)
):
    """Add a member to department"""
    department = db.find_one("departments", {"id": dept_id})
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    # Check if user is department leader
    membership = db.find_one("department_members", {
        "departmentId": dept_id,
        "userId": current_user["id"],
        "role": DepartmentRole.LEADER
    })

    if not membership and department["createdById"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only department leaders can add members"
        )

    # Check if user exists
    user = db.find_one("users", {"id": member_data.userId})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if already a member
    existing_membership = db.find_one("department_members", {
        "departmentId": dept_id,
        "userId": member_data.userId
    })
    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this department"
        )

    # Add member
    new_membership = {
        "id": str(uuid.uuid4()),
        "departmentId": dept_id,
        "userId": member_data.userId,
        "role": member_data.role or DepartmentRole.MEMBER,
    }
    db.insert_one("department_members", new_membership)

    return {"message": "Member added successfully"}


@router.delete("/{dept_id}/members/{user_id}")
async def remove_member(
    dept_id: str,
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Remove a member from department"""
    department = db.find_one("departments", {"id": dept_id})
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    # Check if user is department leader
    membership = db.find_one("department_members", {
        "departmentId": dept_id,
        "userId": current_user["id"],
        "role": DepartmentRole.LEADER
    })

    if not membership and department["createdById"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only department leaders can remove members"
        )

    # Cannot remove the creator
    if user_id == department["createdById"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove department creator"
        )

    # Remove member
    deleted_count = db.delete_many("department_members", {
        "departmentId": dept_id,
        "userId": user_id
    })

    if deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this department"
        )

    return {"message": "Member removed successfully"}


@router.get("/{dept_id}/members")
async def get_department_members(dept_id: str, current_user: dict = Depends(get_current_user)):
    """Get all members of a department"""
    department = db.find_one("departments", {"id": dept_id})
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    # Get all memberships
    memberships = db.find_many("department_members", {"departmentId": dept_id})

    # Get user details for each member
    members = []
    for membership in memberships:
        user = db.find_one("users", {"id": membership["userId"]})
        if user:
            members.append({
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": membership["role"],
                "joinedAt": membership.get("createdAt")
            })

    return members
