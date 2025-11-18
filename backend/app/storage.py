from __future__ import annotations

import json
from pathlib import Path
from typing import Any, List, Type, TypeVar

from .models import Submission, Summary, Task

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

T = TypeVar("T")


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)


def load_summary() -> Summary:
    data = read_json(DATA_DIR / "summary.json")
    return Summary.model_validate(data)


def load_tasks() -> List[Task]:
    data = read_json(DATA_DIR / "tasks.json")
    return [Task.model_validate(item) for item in data]


def save_tasks(tasks: List[Task]) -> None:
    serialized = [task.model_dump(by_alias=True) for task in tasks]
    write_json(DATA_DIR / "tasks.json", serialized)


def load_submissions() -> List[Submission]:
    data = read_json(DATA_DIR / "submissions.json")
    return [Submission.model_validate(item) for item in data]
