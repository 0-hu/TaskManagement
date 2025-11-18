from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from app.models.submission import SubmissionCreate, SubmissionApprove, SubmissionReject, Submission, SubmissionStatus
from app.database.json_db import db
from app.utils.security import get_current_user
import uuid
from datetime import datetime

router = APIRouter(prefix="/submissions", tags=["submissions"])


@router.post("", response_model=Submission, status_code=status.HTTP_201_CREATED)
async def create_submission(
    submission_data: SubmissionCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new task submission"""
    # Check if task exists
    task = db.find_one("tasks", {"id": submission_data.taskId})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check if user is assigned to the task
    assignment = db.find_one("task_assignments", {
        "taskId": submission_data.taskId,
        "userId": current_user["id"]
    })
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not assigned to this task"
        )

    submission_id = str(uuid.uuid4())

    new_submission = {
        "id": submission_id,
        "taskId": submission_data.taskId,
        "userId": current_user["id"],
        "content": submission_data.content,
        "attachments": submission_data.attachments or [],
        "status": SubmissionStatus.SUBMITTED,
        "submittedAt": datetime.utcnow().isoformat(),
    }

    db.insert_one("task_submissions", new_submission)

    return Submission(**new_submission)


@router.get("", response_model=dict)
async def get_submissions(
    taskId: Optional[str] = None,
    userId: Optional[str] = None,
    status: Optional[SubmissionStatus] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get all submissions with filters"""
    submissions = db.get_collection("task_submissions")

    # Apply filters
    filtered_submissions = submissions
    if taskId:
        filtered_submissions = [s for s in filtered_submissions if s.get("taskId") == taskId]
    if userId:
        filtered_submissions = [s for s in filtered_submissions if s.get("userId") == userId]
    if status:
        filtered_submissions = [s for s in filtered_submissions if s.get("status") == status]

    total = len(filtered_submissions)
    skip = (page - 1) * limit
    paginated_submissions = filtered_submissions[skip:skip + limit]

    # Enrich with user and task information
    enriched_submissions = []
    for submission in paginated_submissions:
        user = db.find_one("users", {"id": submission["userId"]})
        task = db.find_one("tasks", {"id": submission["taskId"]})

        enriched_submission = {
            **submission,
            "userName": user["name"] if user else "Unknown",
            "taskTitle": task["title"] if task else "Unknown"
        }
        enriched_submissions.append(enriched_submission)

    return {
        "data": enriched_submissions,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": (total + limit - 1) // limit
        }
    }


@router.get("/my-submissions", response_model=dict)
async def get_my_submissions(
    status: Optional[SubmissionStatus] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get current user's submissions"""
    return await get_submissions(
        userId=current_user["id"],
        status=status,
        page=page,
        limit=limit,
        current_user=current_user
    )


@router.get("/{submission_id}", response_model=Submission)
async def get_submission(submission_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific submission"""
    submission = db.find_one("task_submissions", {"id": submission_id})
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )

    return Submission(**submission)


@router.patch("/{submission_id}/approve", response_model=Submission)
async def approve_submission(
    submission_id: str,
    approval_data: SubmissionApprove,
    current_user: dict = Depends(get_current_user)
):
    """Approve a submission"""
    submission = db.find_one("task_submissions", {"id": submission_id})
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )

    # Check if user is the task creator or has permission
    task = db.find_one("tasks", {"id": submission["taskId"]})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Only task creator can approve
    if task["createdById"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the task creator can approve submissions"
        )

    # Update submission
    update_data = {
        "status": SubmissionStatus.APPROVED,
        "reviewedAt": datetime.utcnow().isoformat(),
        "reviewedById": current_user["id"],
        "feedback": approval_data.feedback,
    }

    updated_submission = db.update_one("task_submissions", {"id": submission_id}, update_data)

    return Submission(**updated_submission)


@router.patch("/{submission_id}/reject", response_model=Submission)
async def reject_submission(
    submission_id: str,
    rejection_data: SubmissionReject,
    current_user: dict = Depends(get_current_user)
):
    """Reject a submission"""
    submission = db.find_one("task_submissions", {"id": submission_id})
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )

    # Check if user is the task creator or has permission
    task = db.find_one("tasks", {"id": submission["taskId"]})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Only task creator can reject
    if task["createdById"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the task creator can reject submissions"
        )

    # Update submission
    update_data = {
        "status": SubmissionStatus.REJECTED,
        "reviewedAt": datetime.utcnow().isoformat(),
        "reviewedById": current_user["id"],
        "feedback": rejection_data.reason,
    }

    updated_submission = db.update_one("task_submissions", {"id": submission_id}, update_data)

    return Submission(**updated_submission)


@router.delete("/{submission_id}")
async def delete_submission(submission_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a submission"""
    submission = db.find_one("task_submissions", {"id": submission_id})
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )

    # Only the submission creator can delete it
    if submission["userId"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the submission creator can delete this submission"
        )

    db.delete_one("task_submissions", {"id": submission_id})

    return {"message": "Submission deleted successfully"}
