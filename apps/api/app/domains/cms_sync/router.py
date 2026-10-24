"""CMS Synchronization Router.

Provides unified endpoints for Projects, Skills, Research, and Settings,
persisting all data to a central JSON store so updates made in the CMS Dashboard
are immediately reflected on the public Portfolio.
"""

import os
import json
import uuid
import re
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Request, status

# Path to the persistent JSON datastore
# router.py -> cms_sync -> domains -> app -> apps/api -> data/cms_data.json
API_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DATA_FILE = os.path.join(API_ROOT, "data", "cms_data.json")

router = APIRouter(tags=["CMS Sync"])


def load_store() -> Dict[str, Any]:
    """Reads the JSON store, returning an empty template if missing."""
    target_path = DATA_FILE
    if not os.path.exists(target_path):
        # Fallback check relative to cwd
        alt_path = os.path.join(os.getcwd(), "data", "cms_data.json")
        if os.path.exists(alt_path):
            target_path = alt_path
        else:
            return {"projects": [], "skills": [], "rd": [], "settings": {}}
    try:
        with open(target_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {target_path}: {e}")
        return {"projects": [], "skills": [], "rd": [], "settings": {}}


def save_store(data: Dict[str, Any]) -> None:
    """Safely writes the store to disk."""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# ==============================================================================
# PROJECTS ENDPOINTS
# ==============================================================================
@router.get("/projects")
async def list_projects(public: Optional[bool] = None):
    store = load_store()
    projects = store.get("projects", [])
    return {
        "success": True,
        "data": projects,
        "items": projects,
        "total": len(projects)
    }


@router.get("/projects/{slug_or_id}")
async def get_project(slug_or_id: str):
    store = load_store()
    for p in store.get("projects", []):
        if str(p.get("id")) == slug_or_id or p.get("slug") == slug_or_id:
            return {"success": True, "data": p}
    raise HTTPException(status_code=404, detail="Project not found")


@router.post("/projects/sync")
async def sync_projects(request: Request):
    payload = await request.json()
    store = load_store()
    store["projects"] = payload
    save_store(store)
    return {"success": True, "data": payload, "items": payload, "total": len(payload)}


@router.post("/projects", status_code=status.HTTP_201_CREATED)
async def create_project(request: Request):
    payload = await request.json()
    store = load_store()
    if isinstance(payload, list):
        store["projects"] = payload
        save_store(store)
        return {"success": True, "data": payload, "items": payload, "total": len(payload)}

    projects: List[Dict[str, Any]] = store.get("projects", [])

    # Assign ID if missing
    if not payload.get("id"):
        payload["id"] = str(uuid.uuid4())

    # Generate slug if missing
    if not payload.get("slug"):
        title = payload.get("title", "project")
        slug = re.sub(r"[^a-zA-Z0-9\s-]", "", title).lower()
        payload["slug"] = re.sub(r"[\s-]+", "-", slug).strip("-") or str(uuid.uuid4())[:8]

    # Check if project with same ID or slug exists (update in place)
    existing_idx = None
    for idx, p in enumerate(projects):
        if p.get("id") == payload.get("id") or (payload.get("slug") and p.get("slug") == payload.get("slug")):
            existing_idx = idx
            break

    if existing_idx is not None:
        projects[existing_idx] = {**projects[existing_idx], **payload}
        saved_project = projects[existing_idx]
    else:
        projects.insert(0, payload)
        saved_project = payload

    store["projects"] = projects
    save_store(store)
    return {"success": True, "data": saved_project}


@router.put("/projects/{project_id}")
async def update_project(project_id: str, request: Request):
    payload = await request.json()
    store = load_store()
    projects = store.get("projects", [])
    found = False

    for idx, p in enumerate(projects):
        if str(p.get("id")) == project_id or p.get("slug") == project_id:
            projects[idx] = {**p, **payload, "id": p.get("id")}
            found = True
            saved = projects[idx]
            break

    if not found:
        payload["id"] = project_id
        projects.insert(0, payload)
        saved = payload

    store["projects"] = projects
    save_store(store)
    return {"success": True, "data": saved}


@router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    store = load_store()
    projects = store.get("projects", [])
    initial_len = len(projects)
    projects = [p for p in projects if str(p.get("id")) != project_id and p.get("slug") != project_id]

    if len(projects) == initial_len:
        raise HTTPException(status_code=404, detail="Project not found")

    store["projects"] = projects
    save_store(store)
    return {"success": True, "message": "Project deleted successfully"}


# ==============================================================================
# SKILLS ENDPOINTS
# ==============================================================================
@router.get("/skills")
async def list_skills():
    store = load_store()
    skills = store.get("skills", [])
    return {
        "success": True,
        "data": skills
    }


@router.post("/skills")
async def save_skills(request: Request):
    payload = await request.json()
    store = load_store()
    # If payload is a list, save as categories list
    if isinstance(payload, list):
        store["skills"] = payload
    elif isinstance(payload, dict):
        if "categories" in payload and isinstance(payload["categories"], list):
            store["skills"] = payload["categories"]
        else:
            # Single category addition
            current_skills = store.get("skills", [])
            current_skills.append(payload)
            store["skills"] = current_skills

    save_store(store)
    return {"success": True, "data": store["skills"]}


# ==============================================================================
# RESEARCH & DEVELOPMENT (R&D) ENDPOINTS
# ==============================================================================
@router.get("/research")
async def list_research():
    store = load_store()
    rd = store.get("rd", [])
    return {
        "success": True,
        "data": rd
    }


@router.post("/research/sync")
async def sync_research(request: Request):
    payload = await request.json()
    store = load_store()
    store["rd"] = payload
    save_store(store)
    return {"success": True, "data": payload}


@router.post("/research", status_code=status.HTTP_201_CREATED)
async def save_research(request: Request):
    payload = await request.json()
    store = load_store()
    if isinstance(payload, list):
        store["rd"] = payload
        save_store(store)
        return {"success": True, "data": payload}

    rd_list: List[Dict[str, Any]] = store.get("rd", [])

    if not payload.get("id"):
        title = payload.get("title", "experiment")
        slug = re.sub(r"[^a-zA-Z0-9\s-]", "", title).lower()
        payload["id"] = re.sub(r"[\s-]+", "-", slug).strip("-") or str(uuid.uuid4())[:8]

    existing_idx = None
    for idx, item in enumerate(rd_list):
        if item.get("id") == payload.get("id"):
            existing_idx = idx
            break

    if existing_idx is not None:
        rd_list[existing_idx] = {**rd_list[existing_idx], **payload}
        saved_entry = rd_list[existing_idx]
    else:
        rd_list.insert(0, payload)
        saved_entry = payload

    store["rd"] = rd_list
    save_store(store)
    return {"success": True, "data": saved_entry}


@router.delete("/research/{entry_id}")
async def delete_research(entry_id: str):
    store = load_store()
    rd_list = store.get("rd", [])
    initial_len = len(rd_list)
    rd_list = [item for item in rd_list if str(item.get("id")) != entry_id]

    if len(rd_list) == initial_len:
        raise HTTPException(status_code=404, detail="Research entry not found")

    store["rd"] = rd_list
    save_store(store)
    return {"success": True, "message": "Research entry deleted successfully"}


# ==============================================================================
# SETTINGS ENDPOINTS
# ==============================================================================
@router.get("/settings")
async def get_settings():
    store = load_store()
    return {
        "success": True,
        "data": store.get("settings", {})
    }


@router.post("/settings")
async def update_settings(request: Request):
    payload = await request.json()
    store = load_store()
    curr = store.get("settings", {})
    curr.update(payload)
    store["settings"] = curr
    save_store(store)
    return {"success": True, "data": curr}
