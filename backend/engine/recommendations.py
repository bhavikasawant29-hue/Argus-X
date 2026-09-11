RECOMMENDATIONS = {
    "outbound_connection": {
        "recommendation": "Enable outbound network connection logging",
        "reason": "Outbound connection telemetry helps verify host-to-server transitions and lateral movement.",
        "priority": "High"
    },
    "process_execution": {
        "recommendation": "Enable detailed process execution telemetry",
        "reason": "Process execution records provide direct evidence of attacker execution activity.",
        "priority": "High"
    },
    "authentication": {
        "recommendation": "Enable detailed authentication logging",
        "reason": "Authentication telemetry helps verify initial access and account activity.",
        "priority": "Medium"
    },
    "network": {
        "recommendation": "Enable network flow telemetry between internal hosts",
        "reason": "Network telemetry helps establish lateral movement and infrastructure relationships.",
        "priority": "Medium"
    }
}


def generate_telemetry_recommendations(gaps, timeline, events):
    recommendations = []

    event_types = {
        event.event_type
        for event in events
    }

    timeline_types = {
        item["event_type"]
        for item in timeline
    }

    for gap in gaps:
        gap_text = gap["gap"].lower()

        if "outbound" in gap_text:
            key = "outbound_connection"

        elif "process execution" in gap_text:
            key = "process_execution"

        else:
            key = None

        if key and key in RECOMMENDATIONS:
            recommendation = RECOMMENDATIONS[key].copy()
            recommendation["gap"] = gap["gap"]

            if recommendation not in recommendations:
                recommendations.append(recommendation)

    if "authentication" not in event_types:
        recommendation = RECOMMENDATIONS["authentication"].copy()
        recommendation["gap"] = "Authentication telemetry is missing"
        recommendations.append(recommendation)

    if "network" not in event_types:
        recommendation = RECOMMENDATIONS["network"].copy()
        recommendation["gap"] = "Network telemetry is missing"
        recommendations.append(recommendation)

    return recommendations