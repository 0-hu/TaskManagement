from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from app.models.task import TaskCreate, TaskUpdate, TaskResponse, TaskStatus, Priority, TaskType
from app.database import db
from app.utils.security import get_current_user
import uuid

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task_data: TaskCreate, current_user: dict = Depends(get_current_user)):
    """Create a new task"""
    task_id = str(uuid.uuid4())

    new_task = {
        "id": task_id,
        "title": task_data.title,
        "description": task_data.description,
        "status": task_data.status,
        "priority": task_data.priority,
        "progress": task_data.progress or 0,
        "type": task_data.type,
        "startDate": task_data.startDate,
        "dueDate": task_data.dueDate,
        "createdById": current_user["id"],
        "departmentId": task_data.departmentId,
    }

    db.insert_one("tasks", new_task)

    # Create task assignments
    if task_data.assignedUserIds:
        for user_id in task_data.assignedUserIds:
            assignment = {
                "id": str(uuid.uuid4()),
                "taskId": task_id,
                "userId": user_id,
            }
            db.insert_one("task_assignments", assignment)

    # Get assigned user IDs
    assignments = db.find_many("task_assignments", {"taskId": task_id})
    assigned_user_ids = [a["userId"] for a in assignments]

    response = TaskResponse(**new_task, assignedUserIds=assigned_user_ids)
    return response


@router.get("", response_model=dict)
async def get_tasks(
    status: Optional[TaskStatus] = None,
    priority: Optional[Priority] = None,
    type: Optional[TaskType] = None,
    departmentId: Optional[str] = None,
    assignedUserId: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get all tasks with filters"""
    tasks = db.get_collection("tasks")

    # Apply filters
    filtered_tasks = tasks
    if status:
        filtered_tasks = [t for t in filtered_tasks if t.get("status") == status]
    if priority:
        filtered_tasks = [t for t in filtered_tasks if t.get("priority") == priority]
    if type:
        filtered_tasks = [t for t in filtered_tasks if t.get("type") == type]
    if departmentId:
        filtered_tasks = [t for t in filtered_tasks if t.get("departmentId") == departmentId]
    if assignedUserId:
        # Get tasks assigned to user
        assignments = db.find_many("task_assignments", {"userId": assignedUserId})
        task_ids = [a["taskId"] for a in assignments]
        filtered_tasks = [t for t in filtered_tasks if t["id"] in task_ids]
    if search:
        search_lower = search.lower()
        filtered_tasks = [
            t for t in filtered_tasks
            if search_lower in t.get("title", "").lower() or search_lower in t.get("description", "").lower()
        ]

    total = len(filtered_tasks)
    skip = (page - 1) * limit
    paginated_tasks = filtered_tasks[skip:skip + limit]

    # Add assignedUserIds to each task
    tasks_with_assignments = []
    for task in paginated_tasks:
        assignments = db.find_many("task_assignments", {"taskId": task["id"]})
        assigned_user_ids = [a["userId"] for a in assignments]
        task_response = {**task, "assignedUserIds": assigned_user_ids}
        tasks_with_assignments.append(task_response)

    return {
        "data": tasks_with_assignments,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": (total + limit - 1) // limit
        }
    }


@router.get("/my-tasks", response_model=dict)
async def get_my_tasks(
    status: Optional[TaskStatus] = None,
    priority: Optional[Priority] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get current user's assigned tasks"""
    return await get_tasks(
        status=status,
        priority=priority,
        assignedUserId=current_user["id"],
        page=page,
        limit=limit,
        current_user=current_user
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific task"""
    task = db.find_one("tasks", {"id": task_id})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Get assigned user IDs
    assignments = db.find_many("task_assignments", {"taskId": task_id})
    assigned_user_ids = [a["userId"] for a in assignments]

    return TaskResponse(**task, assignedUserIds=assigned_user_ids)


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a task"""
    task = db.find_one("tasks", {"id": task_id})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update fields
    update_dict = task_data.model_dump(exclude_unset=True, exclude={"assignedUserIds"})
    updated_task = db.update_one("tasks", {"id": task_id}, update_dict)

    # Update assignments if provided
    if task_data.assignedUserIds is not None:
        # Remove old assignments
        db.delete_many("task_assignments", {"taskId": task_id})

        # Add new assignments
        for user_id in task_data.assignedUserIds:
            assignment = {
                "id": str(uuid.uuid4()),
                "taskId": task_id,
                "userId": user_id,
            }
            db.insert_one("task_assignments", assignment)

    # Get assigned user IDs
    assignments = db.find_many("task_assignments", {"taskId": task_id})
    assigned_user_ids = [a["userId"] for a in assignments]

    return TaskResponse(**updated_task, assignedUserIds=assigned_user_ids)


@router.delete("/{task_id}")
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a task"""
    task = db.find_one("tasks", {"id": task_id})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check if user is the creator
    if task["createdById"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the task creator can delete this task"
        )

    # Delete task and related data
    db.delete_many("task_assignments", {"taskId": task_id})
    db.delete_many("task_submissions", {"taskId": task_id})
    db.delete_one("tasks", {"id": task_id})

    return {"message": "Task deleted successfully"}


@router.patch("/{task_id}/assign")
async def assign_users(
    task_id: str,
    userIds: List[str],
    current_user: dict = Depends(get_current_user)
):
    """Assign users to a task"""
    task = db.find_one("tasks", {"id": task_id})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Remove old assignments
    db.delete_many("task_assignments", {"taskId": task_id})

    # Add new assignments
    for user_id in userIds:
        assignment = {
            "id": str(uuid.uuid4()),
            "taskId": task_id,
            "userId": user_id,
        }
        db.insert_one("task_assignments", assignment)

    return {"message": "Users assigned successfully"}
