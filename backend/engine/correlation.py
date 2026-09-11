from datetime import datetime
from models.event import SecurityEvent


def parse_timestamp(timestamp):
    return datetime.fromisoformat(timestamp)


def calculate_correlation(current, next_event, time_difference):
    score = 0
    reasons = []

    if current.user and next_event.user:
        if current.user == next_event.user:
            score += 1
            reasons.append("same_user")

    if current.source_host and next_event.source_host:
        if current.source_host == next_event.source_host:
            score += 3
            reasons.append("same_source_host")

    if current.destination_host and next_event.destination_host:
        if current.destination_host == next_event.destination_host:
            score += 2
            reasons.append("same_destination_host")

    if time_difference <= 60:
        score += 1
        reasons.append("close_in_time")

    return score, reasons


def correlate_events(events, time_window_seconds=300, minimum_score=3):
    correlations = []

    for i in range(len(events)):
        current = events[i]
        current_time = parse_timestamp(current.timestamp)

        for j in range(i + 1, len(events)):
            next_event = events[j]
            next_time = parse_timestamp(next_event.timestamp)

            time_difference = (next_time - current_time).total_seconds()

            if time_difference > time_window_seconds:
                break

            score, reasons = calculate_correlation(
                current,
                next_event,
                time_difference
            )

            if score >= minimum_score:
                correlations.append({
                    "event_1": current.event_id,
                    "event_2": next_event.event_id,
                    "time_difference": time_difference,
                    "score": score,
                    "reasons": reasons
                })

    return correlations