import sys
from pathlib import Path

# Ensure backend root directory is in sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    print("[PASS] GET /api/health passed")


def test_demo():
    response = client.post("/api/demo")
    assert response.status_code == 200
    data = response.json()

    assert "summary" in data
    assert data["summary"]["total_events"] == 809
    assert data["summary"]["reconstructed_events"] == 8
    assert data["confidence"] == 100.0
    assert data["completeness"] == 100.0

    assert len(data["timeline"]) == 8
    assert len(data["evidence"]) == 8
    assert len(data["graph"]["nodes"]) == 8
    assert len(data["graph"]["edges"]) == 7
    assert data["blast_radius"]["affected_hosts"] == ['DB-01', 'PC-25', 'SRV-02']
    assert data["blast_radius"]["critical_assets"] == ['DB-01']
    assert len(data["replay"]) == 8

    print("[PASS] POST /api/demo passed (809 events -> 8 reconstructed stages)")


def test_analyze_valid():
    csv_content = (
        "timestamp,event_type,user,source_ip,source_host,destination_host,action,severity\n"
        "2026-09-11T10:00:30,login_failed,rahul,192.168.1.25,PC-25,,interactive_login,HIGH\n"
        "2026-09-11T10:01:10,login_success,rahul,192.168.1.25,PC-25,,interactive_login,LOW\n"
    )

    files = {
        "authentication": ("auth.csv", csv_content, "text/csv")
    }

    response = client.post("/api/analyze", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["summary"]["total_events"] == 2
    assert len(data["timeline"]) >= 1
    print("[PASS] POST /api/analyze with valid CSV upload passed")


def test_analyze_invalid_no_files():
    response = client.post("/api/analyze")
    assert response.status_code == 400
    assert "No telemetry CSV files provided" in response.json()["detail"]
    print("[PASS] POST /api/analyze error handling (no files) passed")


def test_counterfactual():
    response = client.post("/api/counterfactual", json={"blocked_stage": "Lateral Movement"})
    assert response.status_code == 200
    data = response.json()
    assert data["blocked_stage"] == "Lateral Movement"
    assert data["stopped"] is True
    assert "Lateral Movement" in data["prevented_stages"]
    print("[PASS] POST /api/counterfactual passed")


def test_investigate():
    response = client.post("/api/investigate", json={"question": "How did the attacker reach DB-01?"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "confidence" in data
    print("[PASS] POST /api/investigate passed")


if __name__ == "__main__":
    print("Running ARGUS-X FastAPI API test suite...\n")
    test_health()
    test_demo()
    test_analyze_valid()
    test_analyze_invalid_no_files()
    test_counterfactual()
    test_investigate()
    print("\nALL API TESTS PASSED SUCCESSFULLY!")
