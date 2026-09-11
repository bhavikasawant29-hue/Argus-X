from datetime import datetime
from models.event import SecurityEvent


ATTACK_EVENTS = {
    "login_failed": "Initial Access",
    "login_success": "Initial Access",
    "process_execution": "Execution",
    "credential_access": "Credential Access",
    "lateral_movement": "Lateral Movement",
    "privilege_escalation": "Privilege Escalation",
    "database_connection": "Database Access",
    "database_access": "Database Access"
}


def parse_timestamp(timestamp):
    return datetime.fromisoformat(timestamp)


def is_related(previous, current, max_gap_seconds=600):
    time_gap = (
        parse_timestamp(current.timestamp)
        - parse_timestamp(previous.timestamp)
    ).total_seconds()

    if time_gap < 0 or time_gap > max_gap_seconds:
        return False

    same_user = (
        previous.user
        and current.user
        and previous.user == current.user
    )

    same_source = (
        previous.source_host
        and current.source_host
        and previous.source_host == current.source_host
    )

    return same_user or same_source


def reconstruct_attack(events):
    suspicious_events = [
        event for event in events
        if event.event_type in ATTACK_EVENTS
    ]

    suspicious_events.sort(
        key=lambda event: parse_timestamp(event.timestamp)
    )

    if not suspicious_events:
        return []

    attack_chain = [suspicious_events[0]]

    for event in suspicious_events[1:]:
        previous = attack_chain[-1]

        if is_related(previous, event):
            attack_chain.append(event)

    timeline = []

    for index, event in enumerate(attack_chain):
        previous = attack_chain[index - 1] if index > 0 else None

        time_gap = None

        if previous:
            time_gap = (
                parse_timestamp(event.timestamp)
                - parse_timestamp(previous.timestamp)
            ).total_seconds()

        timeline.append({
            "sequence": index + 1,
            "stage": ATTACK_EVENTS[event.event_type],
            "event_id": event.event_id,
            "event_type": event.event_type,
            "timestamp": event.timestamp,
            "user": event.user,
            "source_host": event.source_host,
            "destination_host": event.destination_host,
            "severity": event.severity,
            "time_since_previous": time_gap
        })

    return timeline