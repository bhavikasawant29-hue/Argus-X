import sys
from pathlib import Path
from typing import Optional, Dict, Any

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ingestion.loader import load_all_events, load_csv_from_bytes
from engine.reconstruction import reconstruct_attack
from engine.evidence import analyze_evidence
from engine.scoring import calculate_confidence, calculate_completeness
from engine.gaps import find_evidence_gaps
from engine.graph import build_attack_graph
from engine.blast_radius import calculate_blast_radius
from engine.infrastructure import build_infrastructure_map
from engine.recommendations import generate_telemetry_recommendations
from engine.counterfactual import simulate_counterfactual
from engine.investigator import investigate
from engine.replay import build_attack_replay

app = FastAPI(
    title="ARGUS-X Security Telemetry Analysis API",
    description="Evidence-Driven Security Telemetry Correlation & Attack Reconstruction Engine",
    version="2.4.0"
)

# Allow local frontend and deployed Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://argusx-one.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXPECTED_STAGES = [
    "Initial Access",
    "Execution",
    "Credential Access",
    "Lateral Movement",
    "Privilege Escalation",
    "Database Access"
]


def run_full_analysis(events):
    timeline = reconstruct_attack(events)
    evidence = analyze_evidence(timeline, events)
    confidence = calculate_confidence(evidence)
    completeness = calculate_completeness(timeline, EXPECTED_STAGES)
    gaps = find_evidence_gaps(timeline, events)
    recommendations = generate_telemetry_recommendations(gaps, timeline, events)
    graph = build_attack_graph(timeline)
    blast_radius = calculate_blast_radius(timeline)
    infrastructure = build_infrastructure_map(timeline, events)
    replay = build_attack_replay(timeline)

    return {
        "summary": {
            "total_events": len(events),
            "reconstructed_events": len(timeline),
            "confidence": confidence,
            "completeness": completeness,
        },
        "timeline": timeline,
        "evidence": evidence,
        "confidence": confidence,
        "completeness": completeness,
        "gaps": gaps,
        "recommendations": recommendations,
        "graph": graph,
        "blast_radius": blast_radius,
        "infrastructure": infrastructure,
        "replay": replay,
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "ARGUS-X Security Telemetry Engine",
        "version": "2.4.0"
    }


@app.post("/api/demo")
def run_demo():
    try:
        events = load_all_events()
        return run_full_analysis(events)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing benchmark demo analysis: {str(e)}"
        )


@app.post("/api/analyze")
async def analyze_uploaded_telemetry(
    authentication: Optional[UploadFile] = File(None),
    endpoint: Optional[UploadFile] = File(None),
    network: Optional[UploadFile] = File(None),
    application: Optional[UploadFile] = File(None)
):
    files = {
        "authentication": authentication,
        "endpoint": endpoint,
        "network": network,
        "application": application
    }

    parsed_events = []
    provided_count = 0

    for source_type, file_obj in files.items():
        if file_obj is not None and file_obj.filename:
            provided_count += 1

            try:
                content = await file_obj.read()

                if content and len(content.strip()) > 0:
                    events = load_csv_from_bytes(content, source_type)
                    parsed_events.extend(events)

            except Exception as err:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"Failed to parse {source_type} CSV log file "
                        f"'{file_obj.filename}': {str(err)}"
                    )
                )

    if provided_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "No telemetry CSV files provided. "
                "Please upload at least one valid log file."
            )
        )

    if not parsed_events:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded telemetry files contained no valid or parseable events."
        )

    parsed_events.sort(key=lambda event: event.timestamp or "")

    try:
        return run_full_analysis(parsed_events)

    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Telemetry analysis failed: {str(err)}"
        )


class InvestigateRequest(BaseModel):
    question: str
    selected_event: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None


@app.post("/api/investigate")
def run_investigation(req: InvestigateRequest):

    if not req.question or not req.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Investigative question cannot be empty."
        )

    try:
        if req.context and "timeline" in req.context:
            timeline = req.context.get("timeline", [])
            evidence = req.context.get("evidence", [])
            gaps = req.context.get("gaps", [])
            blast_radius = req.context.get("blast_radius", {})

        else:
            events = load_all_events()
            analysis = run_full_analysis(events)

            timeline = analysis["timeline"]
            evidence = analysis["evidence"]
            gaps = analysis["gaps"]
            blast_radius = analysis["blast_radius"]

        return investigate(
            req.question,
            timeline,
            evidence,
            gaps,
            blast_radius
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Investigation failed: {str(e)}"
        )


class CounterfactualRequest(BaseModel):
    blocked_stage: str


@app.post("/api/counterfactual")
def run_counterfactual_simulation(req: CounterfactualRequest):

    if not req.blocked_stage:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="blocked_stage parameter is required."
        )

    try:
        events = load_all_events()
        timeline = reconstruct_attack(events)

        return simulate_counterfactual(
            timeline,
            req.blocked_stage
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Counterfactual simulation failed: {str(e)}"
        )
