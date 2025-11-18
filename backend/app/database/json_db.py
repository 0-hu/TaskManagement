import json
import os
from typing import Any, Dict, List, Optional
from datetime import datetime
import threading


class JsonDatabase:
    """Thread-safe JSON file-based database"""

    def __init__(self, db_file: str = "data.json"):
        self.db_file = os.path.join(os.path.dirname(__file__), db_file)
        self.lock = threading.Lock()
        self._initialize_db()

    def _initialize_db(self):
        """Initialize database file if it doesn't exist"""
        if not os.path.exists(self.db_file):
            initial_data = {
                "users": [],
                "tasks": [],
                "departments": [],
                "department_members": [],
                "task_assignments": [],
                "task_submissions": [],
            }
            self._write_data(initial_data)

    def _read_data(self) -> Dict[str, List]:
        """Read data from JSON file"""
        with self.lock:
            try:
                with open(self.db_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                return {
                    "users": [],
                    "tasks": [],
                    "departments": [],
                    "department_members": [],
                    "task_assignments": [],
                    "task_submissions": [],
                }

    def _write_data(self, data: Dict[str, List]):
        """Write data to JSON file"""
        with self.lock:
            with open(self.db_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False, default=str)

    def get_collection(self, collection_name: str) -> List[Dict]:
        """Get all items from a collection"""
        data = self._read_data()
        return data.get(collection_name, [])

    def find_one(self, collection_name: str, query: Dict[str, Any]) -> Optional[Dict]:
        """Find one item in a collection"""
        items = self.get_collection(collection_name)
        for item in items:
            if all(item.get(k) == v for k, v in query.items()):
                return item
        return None

    def find_many(self, collection_name: str, query: Dict[str, Any]) -> List[Dict]:
        """Find multiple items in a collection"""
        items = self.get_collection(collection_name)
        if not query:
            return items

        result = []
        for item in items:
            if all(item.get(k) == v for k, v in query.items()):
                result.append(item)
        return result

    def insert_one(self, collection_name: str, item: Dict) -> Dict:
        """Insert one item into a collection"""
        data = self._read_data()

        # Add timestamps
        if 'createdAt' not in item:
            item['createdAt'] = datetime.utcnow().isoformat()
        if 'updatedAt' not in item:
            item['updatedAt'] = datetime.utcnow().isoformat()

        data[collection_name].append(item)
        self._write_data(data)
        return item

    def update_one(self, collection_name: str, query: Dict[str, Any], update: Dict) -> Optional[Dict]:
        """Update one item in a collection"""
        data = self._read_data()
        items = data[collection_name]

        for i, item in enumerate(items):
            if all(item.get(k) == v for k, v in query.items()):
                # Update fields
                item.update(update)
                item['updatedAt'] = datetime.utcnow().isoformat()
                data[collection_name][i] = item
                self._write_data(data)
                return item
        return None

    def delete_one(self, collection_name: str, query: Dict[str, Any]) -> bool:
        """Delete one item from a collection"""
        data = self._read_data()
        items = data[collection_name]

        for i, item in enumerate(items):
            if all(item.get(k) == v for k, v in query.items()):
                data[collection_name].pop(i)
                self._write_data(data)
                return True
        return False

    def delete_many(self, collection_name: str, query: Dict[str, Any]) -> int:
        """Delete multiple items from a collection"""
        data = self._read_data()
        items = data[collection_name]

        # Filter out items that match the query
        original_count = len(items)
        data[collection_name] = [
            item for item in items
            if not all(item.get(k) == v for k, v in query.items())
        ]

        deleted_count = original_count - len(data[collection_name])
        if deleted_count > 0:
            self._write_data(data)

        return deleted_count

    def count(self, collection_name: str, query: Optional[Dict[str, Any]] = None) -> int:
        """Count items in a collection"""
        items = self.get_collection(collection_name)
        if not query:
            return len(items)

        count = 0
        for item in items:
            if all(item.get(k) == v for k, v in query.items()):
                count += 1
        return count


# Global database instance
db = JsonDatabase()
