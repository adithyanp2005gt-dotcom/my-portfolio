# Adithyan Platform — System Architecture & Co-Design

This document outlines the software engineering patterns and code organization guidelines implemented inside the Adithyan Platform API server.

---

## 🏗️ Vertical Slice Organization

The codebase transitions away from horizontal layer groupings (separating all models, services, and routers into massive global folders) in favor of **Vertical Domain Slices**.

Each folder under `app/domains/` represents a self-contained feature capsule:
```text
projects/
├── __init__.py
├── models.py       # SQLModel database schemas
├── schemas.py      # Pydantic request/response DTO contracts
├── repository.py   # SQL database query controller
├── service.py      # Business transactions & state calculations
└── router.py       # FastAPI endpoint controllers
```

### Dependency Flow Direction
Imports and calls flow in one direction:
`HTTP Request` &rarr; `Router` &rarr; `Service` &rarr; `Repository` &rarr; `Database`

---

## 🛰️ Asynchronous Event System

To decoupled secondary operations (logging, search indexing, notifications, or AI summaries) from the primary HTTP thread, services publish in-memory events via the `EventDispatcher`:

```python
# app/core/events/events.py
class ProjectPublishedEvent(Event):
    def __init__(self, project_id: int):
        self.project_id = project_id

# Fired from project_service.py:
await dispatcher.dispatch(ProjectPublishedEvent(saved_project.id))
```

Decoupled listeners subscribe to the event class, executing concurrently using `asyncio.gather`:
- `AuditLogListener`: Appends changes to logs.
- `AnalyticsListener`: Flags telemetry.
- `AiSummaryListener`: Schedules background summary updates.

---

## 💾 Storage Layer Abstraction

File management is decoupled behind the `BaseStorageService` abstract interface class (`base.py`):

```python
class BaseStorageService(ABC):
    @abstractmethod
    def save_file(self, file_bytes: bytes, filename: str, folder: str) -> dict[str, Any]:
        pass
```

### local.py Implementation
Stores files locally inside the directory structure, partitioned by dates to maintain OS performance boundaries:
`/uploads/YYYY/MM/<type>/`

Pillow compiles metadata metrics (width, height) on image files, auto-compressing JPG/PNG into WebP formats if files exceed 200KB limits.
