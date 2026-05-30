# Django Backend API

REST API built with Django REST Framework, JWT authentication, and Redis caching.

---

## Base URL

```
http://localhost:8000
```

---

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

## Roles & Permissions

| Role    | Capabilities                                              |
|---------|-----------------------------------------------------------|
| ADMIN   | Full access to all resources                              |
| MANAGER | Create/update/delete projects and tasks                   |
| MEMBER  | Read-only on projects; can only update their own tasks    |

---

## Endpoints

### Auth

| Method | Endpoint                | Auth | Description                        |
|--------|-------------------------|------|------------------------------------|
| POST   | `/api/register/`        | No   | Register a new user                |
| POST   | `/api/token/`           | No   | Obtain access & refresh tokens     |
| POST   | `/api/token/refresh/`   | No   | Refresh access token               |
| POST   | `/api/token/verify/`    | No   | Verify a token                     |

#### POST `/api/register/`
```json
// Request
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}

// Response 200
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

#### POST `/api/token/`
```json
// Request
{
  "username": "john",
  "password": "secret123"
}

// Response 200
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

#### POST `/api/token/refresh/`
```json
// Request
{ "refresh": "<refresh_token>" }

// Response 200
{ "access": "<access_token>" }
```

#### POST `/api/token/verify/`
```json
// Request
{ "token": "<access_token>" }

// Response 200 — {}
```

---

### Organizations

| Method | Endpoint                        | Auth | Role          | Description                  |
|--------|---------------------------------|------|---------------|------------------------------|
| GET    | `/api/organizations/`           | Yes  | Any           | List all organizations       |
| POST   | `/api/organizations/`           | Yes  | Any           | Create an organization       |
| GET    | `/api/organizations/<uuid:pk>/` | Yes  | Any           | Get organization by ID       |
| PUT    | `/api/organizations/<uuid:pk>/` | Yes  | Any           | Update organization by ID    |
| DELETE | `/api/organizations/<uuid:pk>/` | Yes  | Any           | Delete organization by ID    |

#### Organization Object
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### Projects

| Method | Endpoint                     | Auth | Role            | Description              |
|--------|------------------------------|------|-----------------|--------------------------|
| GET    | `/api/projects/`             | Yes  | Any             | List projects in your org|
| POST   | `/api/projects/`             | Yes  | ADMIN, MANAGER  | Create a project         |
| GET    | `/api/projects/<uuid:id>/`   | Yes  | Any             | Get project by ID        |
| PUT    | `/api/projects/<uuid:id>/`   | Yes  | ADMIN, MANAGER  | Update project by ID     |
| DELETE | `/api/projects/<uuid:id>/`   | Yes  | ADMIN, MANAGER  | Delete project by ID     |

#### Project Object
```json
{
  "id": "uuid",
  "name": "Website Redesign",
  "description": "Redesign the company website",
  "org": "uuid",
  "org_name": "Acme Corp",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### Tasks

| Method | Endpoint                   | Auth | Role                        | Description                        |
|--------|----------------------------|------|-----------------------------|------------------------------------|
| GET    | `/api/tasks/`              | Yes  | Any                         | List tasks (filterable, paginated) |
| POST   | `/api/tasks/`              | Yes  | ADMIN, MANAGER              | Create a task                      |
| GET    | `/api/tasks/<uuid:pk>/`    | Yes  | ADMIN, MANAGER, Assignee    | Get task by ID                     |
| PUT    | `/api/tasks/<uuid:pk>/`    | Yes  | ADMIN, MANAGER, Assignee    | Full update task by ID             |
| PATCH  | `/api/tasks/<uuid:pk>/`    | Yes  | ADMIN, MANAGER, Assignee    | Update task status only            |
| DELETE | `/api/tasks/<uuid:pk>/`    | Yes  | ADMIN, MANAGER              | Delete task by ID                  |

#### GET `/api/tasks/` — Query Parameters

| Param      | Type   | Description                                      |
|------------|--------|--------------------------------------------------|
| `status`   | string | Filter by status: `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`, `BLOCKED` |
| `priority` | string | Filter by priority: `HIGH`, `MEDIUM`, `LOW`      |
| `assignee` | int    | Filter by assignee user ID (results are cached)  |
| `page`     | int    | Page number (default: `1`)                       |
| `limit`    | int    | Results per page (default: `20`)                 |

```json
// Response 200
{
  "page": 1,
  "limit": 20,
  "total": 100,
  "results": [ /* Task objects */ ]
}
```

#### Task Object
```json
{
  "id": "uuid",
  "project": "uuid",
  "project_name": "Website Redesign",
  "assignee": 1,
  "assignee_name": "john",
  "created_by": 1,
  "created_by_name": "jane",
  "title": "Fix login bug",
  "description": "Users cannot log in on mobile",
  "priority": "HIGH",
  "status": "TODO",
  "due_date": "2024-12-31T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### PATCH `/api/tasks/<uuid:pk>/` — Status Transition Only
```json
// Request
{ "status": "IN_PROGRESS" }
```

#### Valid Status Transitions

```
TODO        → IN_PROGRESS, BLOCKED
IN_PROGRESS → IN_REVIEW, BLOCKED
IN_REVIEW   → DONE, BLOCKED
DONE        → (none)
BLOCKED     → (none)
```

---

## Error Response Format

```json
{
  "status": 403,
  "code": "PERMISSION_DENIED",
  "message": "Members cannot create tasks."
}
```

---

## Setup

```bash
# Install dependencies
uv sync

# Apply migrations
python manage.py migrate

# Run server
python manage.py runserver
```
