# Adithyan Platform CMS — Backend API (v3.3)

Production-grade, enterprise-aligned FastAPI backend powering the public portfolio website and CMS admin console dashboard.

---

## Key Architectural Principles

- **Domain-Driven Design (DDD) & Vertical Slices:** Code is organized by feature domains (`auth`, `projects`, `skills`, `education`, `media`, `messages`, `dashboard`, `health`) containing models, DTOs, routers, and services.
- **Repository Pattern & Unit of Work:** Unified `BaseRepository[T]` for querying, while `UnitOfWork` context managers coordinate transactional boundaries and commits.
- **Request Context & Structured JSON Logging:** Asynchronous context variables trace request lifecycles, writing JSON logs automatically to `logs/*.log`.
- **Soft Deletes & Optimistic Locking:** Rows inherit UUID v4 identifiers, support soft-delete flags ignored by repository readers, and maintain `version` integer check bounds.

---

## Folder Tree

```text
apps/api/
├── app/
│   ├── api/v1/             # Aggregated routing mount
│   ├── config/             # Settings, DB, Logger, and Storage configurations
│   ├── core/               # Middleware, Exceptions, Responses, and Events bus
│   ├── domains/            # Vertical slice feature folders
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── education/
│   │   ├── media/
│   │   ├── messages/
│   │   ├── projects/
│   │   ├── shared/         # BaseModel and Generic Repository classes
│   │   └── skills/
│   ├── startup/            # Seeding check scripts
│   ├── db.py               # Metadata registry imports aggregator
│   └── main.py             # Root app lifespan setup
├── alembic/                # Schema migration revisions
├── alembic.ini             # Alembic configuration variables
├── .env.example            # Environment variables template
└── requirements.txt        # Locked python packages list
```

---

## Getting Started

### 1. Configure the Environment
Copy the example file to `.env`:
```bash
cp .env.example .env
```

### 2. Install Dependencies
Ensure you are using Python 3.12+:
```bash
pip install -r requirements.txt
```

### 3. Initialize Migrations & Startup
Generate initial schemas using Alembic:
```bash
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```

### 4. Run the Dev Server
Launch uvicorn:
```bash
uvicorn app.main:app --reload --port 8000
```
On startup, a default administrator account is seeded:
- **Username:** admin
- **Password:** admin
*Please rotate the admin password immediately upon your first login.*

### 5. API Documentation
Open your browser at:
- Swagger Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Redoc documentation: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Testing

Run the test suite using `pytest`:
```bash
pytest -v
```
