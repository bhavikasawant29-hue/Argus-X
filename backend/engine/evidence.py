from datetime import datetime


def parse_timestamp(timestamp):
    return datetime.fromisoformat(timestamp)


def is_supporting_event(event, other, max_gap_seconds=300):
    if event.event_id == other.event_id:
        return False

    time_gap = abs(
        (
            parse_timestamp(event.timestamp)
            - parse_timestamp(other.timestamp)
        ).total_seconds()
    )

    if time_gap > max_gap_seconds:
        return False

    same_user = (
        event.user
        and other.user
        and event.user == other.user
    )

    same_source = (
        event.source_host
        and other.source_host
        and event.source_host == other.source_host
    )

    same_destination = (
        event.destination_host
        and other.destination_host
        and event.destination_host == other.destination_host
    )

    same_path = (
        event.source_host
        and event.destination_host
        and other.source_host
        and other.destination_host
        and event.source_host == other.source_host
        and event.destination_host == other.destination_host
    )

    if same_path:
        return True

    if same_user and (same_source or same_destination):
        return True

    return False


def analyze_evidence(timeline, events):
    event_map = {
        event.event_id: event
        for event in events
    }

    results = []

    for item in timeline:
        event = event_map[item["event_id"]]

        supporting_events = []

        for other in events:
            if is_supporting_event(event, other):
                supporting_events.append(other)

        results.append({
            "event_id": event.event_id,
            "event_type": event.event_type,
            "stage": item["stage"],
            "timestamp": event.timestamp,
            "evidence_status": "Verified",
            "supporting_event_count": len(supporting_events),
            "supporting_events": [
                e.event_id for e in supporting_events[:10]
            ]
        })

    return results