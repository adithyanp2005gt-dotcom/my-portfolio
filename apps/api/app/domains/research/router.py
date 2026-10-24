from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ...db import get_db
from ...core.responses.responses import success_response
from ..auth.router import get_current_user
from ..auth.models import User
from .models import ResearchLog

router = APIRouter(prefix="/research", tags=["Lab Notebook Logs"])

@router.get("")
def list_logs(db: Session = Depends(get_db)):
    logs = db.exec(select(ResearchLog).order_by(ResearchLog.created_at.desc())).all()
    
    # If empty, seed mock lab logs automatically to keep UI alive
    if not logs:
        mock_logs = [
            ResearchLog(title="Desktop Buddy AI (v2.0)", status="development", progress=45, notes="Refining dual-core task sharing in FreeRTOS to support synchronous mechanical movement.", category="Embedded AI"),
            ResearchLog(title="Local LLM Optimizations on SBCs", status="research", progress=20, notes="Compiling and profiling quantized Llama 3 models on low-power ARM devices.", category="AI Platform"),
            ResearchLog(title="ESP32 Offline Voice Command Interface", status="testing", progress=80, notes="Developing offline wake-word engines using custom audio spectrogram filters.", category="Embedded Speech"),
            ResearchLog(title="Solar Harvesting Field Telemetry Node", status="completed", progress=100, notes="Successfully built and tested a solar node operating for 90 days with zero grid contact.", category="Telemetry")
        ]
        for ml in mock_logs:
            db.add(ml)
        db.commit()
        logs = db.exec(select(ResearchLog).order_by(ResearchLog.created_at.desc())).all()

    return success_response(logs)
