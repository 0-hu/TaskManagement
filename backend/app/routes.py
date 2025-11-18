from __future__ import annotations

from fastapi import APIRouter, HTTPException

from .models import Task, Summary, Submission
from .storage import load_summary, load_tasks, save_tasks, load_submissions

router = APIRouter()


@router.get("/summary", response_model=Summary)
def get_summary() -> Summary:
    return load_summary()


@router.get("/tasks", response_model=list[Task])
def get_tasks(category: str | None = None) -> list[Task]:
    tasks = load_tasks()
    if category:
        return [task for task in tasks if task.category == category]
    return tasks


@router.post("/tasks", response_model=Task)
def create_task(task: Task) -> Task:
    tasks = load_tasks()
    if any(existing.id == task.id for existing in tasks):
        raise HTTPException(status_code=400, detail="동일한 ID의 업무가 존재합니다.")
    tasks.append(task)
    save_tasks(tasks)
    return task


@router.get("/submissions", response_model=list[Submission])
def get_submissions() -> list[Submission]:
    return load_submissions()
