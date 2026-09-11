def find_evidence_gaps(timeline, events):
    gaps = []

    event_types = {
        event.event_type
        for event in events
    }

    timeline_types = {
        item["event_type"]
        for item in timeline
    }

    if "outbound_connection" not in timeline_types:
        if "outbound_connection" in event_types:
            gaps.append({
                "gap": "Outbound connection is supporting evidence only",
                "impact": "The host-to-server transition is not part of the reconstructed attack chain.",
                "severity": "medium"
            })
        else:
            gaps.append({
                "gap": "Outbound connection telemetry is missing",
                "impact": "The transition from the compromised host to the server cannot be fully verified.",
                "severity": "high"
            })

    if "process_execution" not in timeline_types:
        gaps.append({
            "gap": "Process execution evidence is missing",
            "impact": "The execution stage cannot be directly established.",
            "severity": "high"
        })

    return gaps