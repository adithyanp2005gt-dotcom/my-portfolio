"""Comprehensive unit and integration test suite for the CMS backend.

This module tests login endpoints, setting modifications, health telemetry,
project pagination, soft deletion exclusions, and concurrency version controls.
"""

import uuid
import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.domains.auth.models import User
from app.domains.settings.models import SystemSetting
from app.domains.projects.models import Project, Category, Tag, ProjectStatus


# --------------------------------------------------------------------------
# Authentication Tests
# --------------------------------------------------------------------------
def test_login_success(client: TestClient, seeded_admin: User) -> None:
    """Verifies that valid admin credentials return JWT tokens."""
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin", "password": "admin"}
    )
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert "access_token" in res_data["data"]
    assert "refresh_token" in res_data["data"]


def test_login_invalid_password(client: TestClient, seeded_admin: User) -> None:
    """Verifies that incorrect passwords return 401 Unauthorized status."""
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin", "password": "wrong_password"}
    )
    assert response.status_code == 401
    assert response.json()["success"] is False


# --------------------------------------------------------------------------
# Settings Domain Tests
# --------------------------------------------------------------------------
def test_get_settings_defaults(client: TestClient) -> None:
    """Checks that dynamic settings fall back to defaults if database is unseeded."""
    response = client.get("/api/v1/settings")
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["heroTitle"] == "Adithyan"


def test_update_settings_unauthorized(client: TestClient) -> None:
    """Checks that updating settings returns 401 Unauthorized if token is missing."""
    response = client.put(
        "/api/v1/settings",
        json={"heroTitle": "Modified Title"}
    )
    assert response.status_code == 401


# --------------------------------------------------------------------------
# Health Endpoint Tests
# --------------------------------------------------------------------------
def test_health_check_operational(client: TestClient) -> None:
    """Verifies the health checks diagnostics endpoints returns the required schema contract."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["api"] == "online"
    assert data["database"] == "online"
    assert data["storage"] == "online"
    assert "uptime" in data


# --------------------------------------------------------------------------
# Project CRUD & Soft Delete & Optimistic Concurrency Tests
# --------------------------------------------------------------------------
def test_project_crud_and_soft_delete(client: TestClient, seeded_admin: User, db_session: Session) -> None:
    """Tests project creation, slug uniqueness, eager loading pagination, and soft deletion."""
    # 1. Obtain authorization token
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": "admin", "password": "admin"}
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create classification Category and Technology Tag
    cat_res = client.post(
        "/api/v1/projects/categories",
        json={"name": "Embedded Firmware"},
        headers=headers
    )
    cat_id = cat_res.json()["data"]["id"]

    tag_res = client.post(
        "/api/v1/projects/tags",
        json={"name": "FreeRTOS"},
        headers=headers
    )
    tag_id = tag_res.json()["data"]["id"]

    # 3. Save a new Project case study
    project_payload = {
        "title": "Smart Oscilloscope Firmware",
        "tagline": "Custom real-time processing kernels.",
        "description": "Comprehensive FreeRTOS kernel project using custom hardware drivers.",
        "category_id": cat_id,
        "status": "draft",
        "featured": True,
        "cover_image": "/uploads/images/oscilloscope.webp",
        "github_url": "https://github.com/adithyan-dev/smart-scope",
        "demo_url": "https://adithyan.dev/smart-scope",
        "sort_order": 1,
        "tag_ids": [tag_id]
    }
    create_res = client.post("/api/v1/projects", json=project_payload, headers=headers)
    assert create_res.status_code == 201
    proj_data = create_res.json()["data"]
    assert proj_data["slug"] == "smart-oscilloscope-firmware"
    assert proj_data["version"] == 1
    proj_id = proj_data["id"]

    # 4. Check slug collision handling
    collision_res = client.post("/api/v1/projects", json=project_payload, headers=headers)
    assert collision_res.json()["data"]["slug"] == "smart-oscilloscope-firmware-1"

    # 5. List projects paginated
    list_res = client.get("/api/v1/projects?page=1&size=10")
    assert list_res.status_code == 200
    list_data = list_res.json()["data"]
    assert list_data["total"] == 2
    assert len(list_data["items"]) == 2
    assert list_data["items"][0]["category"]["id"] == cat_id
    assert list_data["items"][0]["tags"][0]["id"] == tag_id

    # 6. Test Optimistic locking concurrency conflicts
    # Modify loaded local state
    update_payload_1 = {
        "title": "Updated Smart Oscilloscope",
        "version": 1 # Match current database version
    }
    update_payload_2 = {
        "title": "Conflicting Update Attempt",
        "version": 1 # Match stale database version
    }

    # First update succeeds, incrementing version to 2
    ok_update = client.put(f"/api/v1/projects/{proj_id}", json=update_payload_1, headers=headers)
    assert ok_update.status_code == 200
    assert ok_update.json()["data"]["version"] == 2

    # Second update using stale version (1) conflicts, returning 409 Conflict
    conflict_update = client.put(f"/api/v1/projects/{proj_id}", json=update_payload_2, headers=headers)
    assert conflict_update.status_code == 409
    assert conflict_update.json()["error"]["code"] == "CONCURRENCY_CONFLICT"

    # 7. Soft Delete and verify exclusion on paginated queries
    del_res = client.delete(f"/api/v1/projects/{proj_id}", headers=headers)
    assert del_res.status_code == 200

    # Project list count prunes soft deleted item automatically, dropping total to 1
    after_del_res = client.get("/api/v1/projects?page=1&size=10")
    assert after_del_res.json()["data"]["total"] == 1
