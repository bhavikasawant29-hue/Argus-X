def simulate_counterfactual(timeline, blocked_stage):
    if not timeline:
        return {
            "blocked_stage": blocked_stage,
            "stopped": False,
            "remaining_events": [],
            "prevented_stages": [],
            "impact": "No attack timeline available."
        }

    blocked_index = None

    for index, event in enumerate(timeline):
        if event["stage"] == blocked_stage:
            blocked_index = index
            break

    if blocked_index is None:
        return {
            "blocked_stage": blocked_stage,
            "stopped": False,
            "remaining_events": timeline,
            "prevented_stages": [],
            "impact": f"Stage '{blocked_stage}' was not observed in the attack."
        }

    remaining_events = timeline[:blocked_index]
    prevented_events = timeline[blocked_index:]

    prevented_stages = []
    for event in prevented_events:
        if event["stage"] not in prevented_stages:
            prevented_stages.append(event["stage"])

    if prevented_stages:
        impact = (
            f"Blocking '{blocked_stage}' would prevent the attack "
            f"from progressing through: {', '.join(prevented_stages)}."
        )
    else:
        impact = f"Blocking '{blocked_stage}' would stop the attack at this stage."

    return {
        "blocked_stage": blocked_stage,
        "stopped": True,
        "remaining_events": remaining_events,
        "prevented_stages": prevented_stages,
        "impact": impact
    }