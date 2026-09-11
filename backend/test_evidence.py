from ingestion.loader import load_all_events
from engine.reconstruction import reconstruct_attack
from engine.evidence import analyze_evidence
from engine.scoring import calculate_confidence
from engine.scoring import calculate_completeness
from engine.gaps import find_evidence_gaps
from engine.graph import build_attack_graph


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

graph = build_attack_graph(timeline)


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

print("\nAttack Graph:")

print("Nodes:", len(graph["nodes"]))
print("Edges:", len(graph["edges"]))

for edge in graph["edges"]:
    print(
        edge["source"],
        "->",
        edge["target"],
        "|",
        edge["relationship"]
    )