RELATIONSHIPS = {
    ("Initial Access", "Initial Access"): "AUTHENTICATES",
    ("Initial Access", "Execution"): "EXECUTES",
    ("Execution", "Credential Access"): "ACCESS_CREDENTIALS",
    ("Credential Access", "Lateral Movement"): "MOVES_TO",
    ("Lateral Movement", "Privilege Escalation"): "ESCALATES",
    ("Privilege Escalation", "Database Access"): "CONNECTS_TO",
    ("Database Access", "Database Access"): "ACCESSES"
}


def get_relationship(current, next_event):
    key = (
        current["stage"],
        next_event["stage"]
    )

    return RELATIONSHIPS.get(
        key,
        "LEADS_TO"
    )


def build_attack_graph(timeline):
    nodes = []
    edges = []

    for item in timeline:
        nodes.append({
            "id": item["event_id"],
            "label": item["event_type"],
            "stage": item["stage"],
            "timestamp": item["timestamp"],
            "host": item["source_host"],
            "destination": item["destination_host"]
        })

    for i in range(len(timeline) - 1):
        current = timeline[i]
        next_event = timeline[i + 1]

        edges.append({
            "source": current["event_id"],
            "target": next_event["event_id"],
            "relationship": get_relationship(
                current,
                next_event
            )
        })

    return {
        "nodes": nodes,
        "edges": edges
    }