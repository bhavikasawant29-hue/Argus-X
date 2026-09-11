from ingestion.loader import load_all_events
from engine.reconstruction import reconstruct_attack
from engine.evidence import analyze_evidence
from engine.scoring import calculate_confidence
from engine.scoring import calculate_completeness
from engine.gaps import find_evidence_gaps
from engine.graph import build_attack_graph
from engine.blast_radius import calculate_blast_radius
from engine.infrastructure import build_infrastructure_map
from engine.recommendations import generate_telemetry_recommendations
from engine.counterfactual import simulate_counterfactual
from engine.investigator import investigate
from engine.replay import build_attack_replay


events = load_all_events()

timeline = reconstruct_attack(events)

evidence = analyze_evidence(
    timeline,
    events
)

confidence = calculate_confidence(evidence)

expected_stages = [
    "Initial Access",
    "Execution",
    "Credential Access",
    "Lateral Movement",
    "Privilege Escalation",
    "Database Access"
]

completeness = calculate_completeness(
    timeline,
    expected_stages
)

gaps = find_evidence_gaps(
    timeline,
    events
)

recommendations = generate_telemetry_recommendations(
    gaps,
    timeline,
    events
)

graph = build_attack_graph(timeline)

blast_radius = calculate_blast_radius(
    timeline
)

infrastructure = build_infrastructure_map(
    timeline,
    events
)

counterfactual = simulate_counterfactual(
    timeline,
    "Lateral Movement"
)

investigation = investigate(
    "How did the attacker reach DB-01?",
    timeline,
    evidence,
    gaps,
    blast_radius
)

replay = build_attack_replay(
    timeline
)


print("Attack events:", len(timeline))
print("Confidence:", confidence)
print("Completeness:", completeness)


print("\nEvidence:")

for item in evidence:
    print(
        item["event_id"],
        "|",
        item["stage"],
        "|",
        item["evidence_status"],
        "| Supporting:",
        item["supporting_events"]
    )


print("\nEvidence Gaps:")

for gap in gaps:
    print(
        gap["severity"],
        "|",
        gap["gap"],
        "|",
        gap["impact"]
    )


print("\nTelemetry Recommendations:")

for recommendation in recommendations:
    print(
        recommendation["priority"],
        "|",
        recommendation["recommendation"],
        "|",
        recommendation["reason"]
    )


print("\nAttack Graph:")

print(
    "Nodes:",
    len(graph["nodes"])
)

print(
    "Edges:",
    len(graph["edges"])
)

for edge in graph["edges"]:
    print(
        edge["source"],
        "->",
        edge["target"],
        "|",
        edge["relationship"]
    )


print("\nBlast Radius:")

print(
    "Affected Hosts:",
    blast_radius["affected_hosts"]
)

print(
    "Affected Users:",
    blast_radius["affected_users"]
)

print(
    "Host Count:",
    blast_radius["host_count"]
)

print(
    "User Count:",
    blast_radius["user_count"]
)

print(
    "Critical Assets:",
    blast_radius["critical_assets"]
)

print(
    "Critical Asset Count:",
    blast_radius["critical_asset_count"]
)

print("Attack Path:")

for path in blast_radius["attack_path"]:
    print(path)


print("\nAttack Infrastructure:")

print(
    "Hosts:",
    infrastructure["hosts"]
)

print(
    "Users:",
    infrastructure["users"]
)

print(
    "Source IPs:",
    infrastructure["source_ips"]
)

print(
    "Host Count:",
    infrastructure["host_count"]
)

print(
    "User Count:",
    infrastructure["user_count"]
)

print(
    "IP Count:",
    infrastructure["ip_count"]
)

print(
    "Connections:",
    infrastructure["connection_count"]
)

for connection in infrastructure["connections"]:
    print(
        connection["source"],
        "->",
        connection["destination"],
        "|",
        connection["event_id"]
    )


print("\nCounterfactual Simulation:")

print(
    "Blocked Stage:",
    counterfactual["blocked_stage"]
)

print(
    "Attack Stopped:",
    counterfactual["stopped"]
)

print(
    "Prevented Stages:",
    counterfactual["prevented_stages"]
)

print(
    "Impact:",
    counterfactual["impact"]
)


print("\nAI Investigator:")

print(
    "Question:",
    "How did the attacker reach DB-01?"
)

print(
    "Answer:",
    investigation["answer"]
)

print(
    "Evidence References:",
    investigation["evidence_refs"]
)

print(
    "Confidence:",
    investigation["confidence"]
)


print("\nAttack Replay:")

for step in replay:
    print(
        "Step",
        step["step"],
        "|",
        step["timestamp"],
        "|",
        step["stage"],
        "|",
        step["event_id"]
    )

    print(
        " ",
        step["description"]
    )