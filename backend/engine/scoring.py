def calculate_confidence(evidence_results):
    if not evidence_results:
        return 0

    verified = sum(
        1 for item in evidence_results
        if item["evidence_status"] == "Verified"
    )

    inferred = sum(
        1 for item in evidence_results
        if item["evidence_status"] == "Inferred"
    )

    total = len(evidence_results)

    score = (
        (verified * 1.0) +
        (inferred * 0.6)
    ) / total

    return round(score * 100, 2)


def calculate_completeness(timeline, expected_stages):
    if not expected_stages:
        return 0

    observed_stages = {
        item["stage"]
        for item in timeline
    }

    matched = observed_stages.intersection(
        set(expected_stages)
    )

    return round(
        len(matched) / len(expected_stages) * 100,
        2
    )
