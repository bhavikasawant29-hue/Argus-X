def build_attack_replay(timeline):
    replay = []

    for index, event in enumerate(timeline):
        replay_step = {
            "step": index + 1,
            "event_id": event["event_id"],
            "stage": event["stage"],
            "event_type": event["event_type"],
            "timestamp": event["timestamp"],
            "user": event.get("user"),
            "source_host": event.get("source_host"),
            "destination_host": event.get("destination_host"),
            "severity": event.get("severity"),
            "description": build_description(event)
        }

        replay.append(replay_step)

    return replay


def build_description(event):
    stage = event["stage"]
    source = event.get("source_host")
    destination = event.get("destination_host")
    user = event.get("user")

    if source and destination:
        return (
            f"{stage}: {user or 'Unknown user'} "
            f"moved from {source} to {destination}."
        )

    if source:
        return (
            f"{stage}: {user or 'Unknown user'} "
            f"activity detected on {source}."
        )

    return (
        f"{stage}: {user or 'Unknown user'} "
        f"activity detected."
    )