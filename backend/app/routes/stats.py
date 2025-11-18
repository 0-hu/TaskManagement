from fastapi import APIRouter, HTTPException, status, Depends
from app.database.json_db import db
from app.utils.security import get_current_user
from app.models.task import TaskStatus, Priority, TaskType
from app.models.submission import SubmissionStatus

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/dashboard")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Get dashboard statistics"""
    # Get all tasks
    all_tasks = db.get_collection("tasks")

    # Get user's assigned tasks
    user_assignments = db.find_many("task_assignments", {"userId": current_user["id"]})
    user_task_ids = [a["taskId"] for a in user_assignments]
    user_tasks = [t for t in all_tasks if t["id"] in user_task_ids]

    # Task statistics
    total_tasks = len(all_tasks)
    my_tasks = len(user_tasks)

    # Status breakdown
    todo_tasks = len([t for t in all_tasks if t.get("status") == TaskStatus.TODO])
    in_progress_tasks = len([t for t in all_tasks if t.get("status") == TaskStatus.IN_PROGRESS])
    completed_tasks = len([t for t in all_tasks if t.get("status") == TaskStatus.COMPLETED])
    on_hold_tasks = len([t for t in all_tasks if t.get("status") == TaskStatus.ON_HOLD])

    # Priority breakdown
    low_priority = len([t for t in all_tasks if t.get("priority") == Priority.LOW])
    medium_priority = len([t for t in all_tasks if t.get("priority") == Priority.MEDIUM])
    high_priority = len([t for t in all_tasks if t.get("priority") == Priority.HIGH])
    urgent_priority = len([t for t in all_tasks if t.get("priority") == Priority.URGENT])

    # Type breakdown
    personal_tasks = len([t for t in all_tasks if t.get("type") == TaskType.PERSONAL])
    department_tasks = len([t for t in all_tasks if t.get("type") == TaskType.DEPARTMENT])

    # Submissions
    all_submissions = db.get_collection("task_submissions")
    pending_submissions = len([s for s in all_submissions if s.get("status") == SubmissionStatus.SUBMITTED])
    approved_submissions = len([s for s in all_submissions if s.get("status") == SubmissionStatus.APPROVED])
    rejected_submissions = len([s for s in all_submissions if s.get("status") == SubmissionStatus.REJECTED])

    # My submissions
    my_submissions = [s for s in all_submissions if s.get("userId") == current_user["id"]]
    my_pending_submissions = len([s for s in my_submissions if s.get("status") == SubmissionStatus.SUBMITTED])

    # Departments
    all_departments = db.get_collection("departments")
    total_departments = len(all_departments)

    # My departments
    my_memberships = db.find_many("department_members", {"userId": current_user["id"]})
    my_departments = len(my_memberships)

    return {
        "overview": {
            "totalTasks": total_tasks,
            "myTasks": my_tasks,
            "completedTasks": completed_tasks,
            "pendingSubmissions": pending_submissions,
            "totalDepartments": total_departments,
            "myDepartments": my_departments,
        },
        "tasksByStatus": {
            "todo": todo_tasks,
            "inProgress": in_progress_tasks,
            "completed": completed_tasks,
            "onHold": on_hold_tasks,
        },
        "tasksByPriority": {
            "low": low_priority,
            "medium": medium_priority,
            "high": high_priority,
            "urgent": urgent_priority,
        },
        "tasksByType": {
            "personal": personal_tasks,
            "department": department_tasks,
        },
        "submissions": {
            "total": len(all_submissions),
            "pending": pending_submissions,
            "approved": approved_submissions,
            "rejected": rejected_submissions,
            "myPending": my_pending_submissions,
        }
    }


@router.get("/tasks")
async def get_task_stats(current_user: dict = Depends(get_current_user)):
    """Get detailed task statistics"""
    all_tasks = db.get_collection("tasks")

    # Calculate completion rate
    total = len(all_tasks)
    completed = len([t for t in all_tasks if t.get("status") == TaskStatus.COMPLETED])
    completion_rate = (completed / total * 100) if total > 0 else 0

    # Calculate average progress
    total_progress = sum(t.get("progress", 0) for t in all_tasks)
    avg_progress = (total_progress / total) if total > 0 else 0

    # Tasks by department
    department_stats = {}
    for task in all_tasks:
        dept_id = task.get("departmentId")
        if dept_id:
            if dept_id not in department_stats:
                department = db.find_one("departments", {"id": dept_id})
                department_stats[dept_id] = {
                    "departmentId": dept_id,
                    "departmentName": department["name"] if department else "Unknown",
                    "total": 0,
                    "completed": 0,
                }
            department_stats[dept_id]["total"] += 1
            if task.get("status") == TaskStatus.COMPLETED:
                department_stats[dept_id]["completed"] += 1

    # Overdue tasks (simple check based on dueDate)
    from datetime import datetime
    now = datetime.utcnow().isoformat()
    overdue_tasks = [
        t for t in all_tasks
        if t.get("dueDate") and t.get("dueDate") < now and t.get("status") != TaskStatus.COMPLETED
    ]

    return {
        "total": total,
        "completed": completed,
        "completionRate": round(completion_rate, 2),
        "averageProgress": round(avg_progress, 2),
        "overdue": len(overdue_tasks),
        "byDepartment": list(department_stats.values()),
    }


@router.get("/departments/{dept_id}")
async def get_department_stats(dept_id: str, current_user: dict = Depends(get_current_user)):
    """Get department-specific statistics"""
    # Check if department exists
    department = db.find_one("departments", {"id": dept_id})
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    # Get department tasks
    dept_tasks = db.find_many("tasks", {"departmentId": dept_id})

    # Get department members
    members = db.find_many("department_members", {"departmentId": dept_id})

    # Task statistics
    total_tasks = len(dept_tasks)
    completed_tasks = len([t for t in dept_tasks if t.get("status") == TaskStatus.COMPLETED])
    in_progress_tasks = len([t for t in dept_tasks if t.get("status") == TaskStatus.IN_PROGRESS])

    # Member statistics
    member_stats = []
    for member in members:
        user = db.find_one("users", {"id": member["userId"]})
        if user:
            # Get user's assigned tasks in this department
            user_task_assignments = db.find_many("task_assignments", {"userId": user["id"]})
            user_dept_task_ids = [a["taskId"] for a in user_task_assignments]
            user_dept_tasks = [t for t in dept_tasks if t["id"] in user_dept_task_ids]

            completed = len([t for t in user_dept_tasks if t.get("status") == TaskStatus.COMPLETED])

            member_stats.append({
                "userId": user["id"],
                "userName": user["name"],
                "role": member["role"],
                "assignedTasks": len(user_dept_tasks),
                "completedTasks": completed,
            })

    return {
        "departmentId": dept_id,
        "departmentName": department["name"],
        "totalMembers": len(members),
        "totalTasks": total_tasks,
        "completedTasks": completed_tasks,
        "inProgressTasks": in_progress_tasks,
        "completionRate": round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 2),
        "members": member_stats,
    }


@router.get("/users/{user_id}")
async def get_user_stats(user_id: str, current_user: dict = Depends(get_current_user)):
    """Get user-specific statistics"""
    # Check if user exists
    user = db.find_one("users", {"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Get user's assigned tasks
    assignments = db.find_many("task_assignments", {"userId": user_id})
    task_ids = [a["taskId"] for a in assignments]
    all_tasks = db.get_collection("tasks")
    user_tasks = [t for t in all_tasks if t["id"] in task_ids]

    # Get user's created tasks
    created_tasks = db.find_many("tasks", {"createdById": user_id})

    # Get user's submissions
    submissions = db.find_many("task_submissions", {"userId": user_id})

    # Task statistics
    total_assigned = len(user_tasks)
    completed = len([t for t in user_tasks if t.get("status") == TaskStatus.COMPLETED])
    in_progress = len([t for t in user_tasks if t.get("status") == TaskStatus.IN_PROGRESS])

    # Submission statistics
    total_submissions = len(submissions)
    approved_submissions = len([s for s in submissions if s.get("status") == SubmissionStatus.APPROVED])
    pending_submissions = len([s for s in submissions if s.get("status") == SubmissionStatus.SUBMITTED])

    # Department memberships
    memberships = db.find_many("department_members", {"userId": user_id})
    departments = []
    for membership in memberships:
        dept = db.find_one("departments", {"id": membership["departmentId"]})
        if dept:
            departments.append({
                "departmentId": dept["id"],
                "departmentName": dept["name"],
                "role": membership["role"],
            })

    return {
        "userId": user_id,
        "userName": user["name"],
        "email": user["email"],
        "role": user["role"],
        "tasks": {
            "assigned": total_assigned,
            "created": len(created_tasks),
            "completed": completed,
            "inProgress": in_progress,
            "completionRate": round((completed / total_assigned * 100) if total_assigned > 0 else 0, 2),
        },
        "submissions": {
            "total": total_submissions,
            "approved": approved_submissions,
            "pending": pending_submissions,
        },
        "departments": departments,
    }
