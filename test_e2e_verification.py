import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"


def test_health():
    url = f"{BASE_URL}/api/health"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode())
        assert data["status"] == "ok"
        print("[E2E PASS] GET /api/health -> OK")


def test_demo():
    url = f"{BASE_URL}/api/demo"
    req = urllib.request.Request(url, method="POST", data=b"")
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode())
        
        # Verify 809 total events & 8 reconstructed attack events
        assert data["summary"]["total_events"] == 809
        assert data["summary"]["reconstructed_events"] == 8
        assert data["confidence"] == 100.0
        assert data["completeness"] == 100.0
        
        # Verify attack vector PC-25 -> SRV-02 -> DB-01
        hosts = data["blast_radius"]["affected_hosts"]
        assert "PC-25" in hosts and "SRV-02" in hosts and "DB-01" in hosts
        assert data["blast_radius"]["affected_users"] == ["rahul"]
        assert data["blast_radius"]["critical_assets"] == ["DB-01"]
        
        # Verify timeline, evidence, graph, replay, gaps, recommendations, infrastructure
        assert len(data["timeline"]) == 8
        assert len(data["evidence"]) == 8
        assert len(data["graph"]["nodes"]) == 8
        assert len(data["graph"]["edges"]) == 7
        assert len(data["replay"]) == 8
        assert len(data["gaps"]) >= 1
        assert len(data["infrastructure"]["hosts"]) == 11
        
        print("[E2E PASS] POST /api/demo -> Verified 809 events, 8 attack stages, PC-25 -> SRV-02 -> DB-01")


def test_analyze_multipart():
    url = f"{BASE_URL}/api/analyze"
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    csv_content = (
        "timestamp,event_type,user,source_ip,source_host,destination_host,action,severity\r\n"
        "2026-09-11T10:00:30,login_failed,rahul,192.168.1.25,PC-25,,interactive_login,HIGH\r\n"
        "2026-09-11T10:01:10,login_success,rahul,192.168.1.25,PC-25,,interactive_login,LOW\r\n"
    )
    
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="authentication"; filename="authentication_logs.csv"\r\n'
        f"Content-Type: text/csv\r\n\r\n"
        f"{csv_content}\r\n"
        f"--{boundary}--\r\n"
    ).encode('utf-8')
    
    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}"
    }
    
    req = urllib.request.Request(url, method="POST", data=body, headers=headers)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode())
        assert data["summary"]["total_events"] == 2
        assert len(data["timeline"]) >= 1
        print("[E2E PASS] POST /api/analyze -> Multipart CSV upload successfully parsed and analyzed")


def test_counterfactual():
    url = f"{BASE_URL}/api/counterfactual"
    payload = json.dumps({"blocked_stage": "Lateral Movement"}).encode('utf-8')
    headers = {"Content-Type": "application/json"}
    
    req = urllib.request.Request(url, method="POST", data=payload, headers=headers)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode())
        assert data["blocked_stage"] == "Lateral Movement"
        assert data["stopped"] is True
        assert "Lateral Movement" in data["prevented_stages"]
        print("[E2E PASS] POST /api/counterfactual -> Simulation executed (Lateral Movement blocked)")


def test_investigate():
    url = f"{BASE_URL}/api/investigate"
    payload = json.dumps({"question": "How did the attacker reach DB-01?"}).encode('utf-8')
    headers = {"Content-Type": "application/json"}
    
    req = urllib.request.Request(url, method="POST", data=payload, headers=headers)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode())
        assert "answer" in data
        assert "confidence" in data
        print("[E2E PASS] POST /api/investigate -> AI investigation result returned")


def test_backend_unavailable_mock():
    # Test trying to connect to a non-existent port
    bad_url = "http://127.0.0.1:59999/api/demo"
    try:
        req = urllib.request.Request(bad_url, method="POST", data=b"")
        with urllib.request.urlopen(req):
            pass
    except urllib.error.URLError as e:
        print("[E2E PASS] Backend unavailable connection error caught cleanly:", str(e))


if __name__ == "__main__":
    print("Executing End-to-End Live Server Verification...\n")
    test_health()
    test_demo()
    test_analyze_multipart()
    test_counterfactual()
    test_investigate()
    test_backend_unavailable_mock()
    print("\nALL END-TO-END LIVE SERVER TESTS PASSED PERFECTLY!")
