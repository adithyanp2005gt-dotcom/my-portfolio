from fastapi import APIRouter
from ...core.responses.responses import success_response

router = APIRouter(prefix="/analytics", tags=["Operational Telemetry"])

@router.get("")
def get_analytics():
    # Simple, privacy-friendly mock metric response
    metrics = {
        "visitors": 1420,
        "sessions": 1845,
        "popularProjects": [
            {"title": "Desktop Buddy AI", "clicks": 542},
            {"title": "Smart Irrigation System", "clicks": 320},
            {"title": "Computer Vision Smart Parking", "clicks": 210}
        ],
        "countries": [
            {"country": "India", "percentage": 45},
            {"country": "United States", "percentage": 30},
            {"country": "Germany", "percentage": 10},
            {"country": "Others", "percentage": 15}
        ]
    }
    return success_response(metrics)
