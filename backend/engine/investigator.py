import os
import re

from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY")
MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")

client = OpenAI(api_key=API_KEY)


SYSTEM_PROMPT = """
You are the ARGUS-X Security Investigation Assistant.

You analyze only the security evidence provided to you.

STRICT RULES:
1. Do not invent events, users, hosts, IP addresses, timestamps, or attack stages.
2. Every factual claim must be supported by the provided evidence.
3. Include the relevant event IDs as evidence references.
4. If the evidence does not support an answer, explicitly say:
   "Insufficient evidence."
5. Do not infer facts that are not supported by the telemetry.
6. Clearly distinguish observed evidence from interpretation.
7. Keep answers concise and suitable for a SOC analyst.

Return your response in this format:

Answer:
<answer>

Evidence:
<comma-separated event IDs>
"""


def build_context(timeline, evidence, gaps, blast_radius):
    return {
        "attack_timeline": timeline,
        "evidence": evidence,
        "evidence_gaps": gaps,
        "blast_radius": blast_radius
    }


def validate_evidence(response, evidence):
    valid_event_ids = {
        item["event_id"]
        for item in evidence
    }

    referenced_ids = []

    for event_id in valid_event_ids:
        if event_id in response:
            referenced_ids.append(event_id)

    return referenced_ids


def calculate_ai_confidence(evidence_refs, evidence):
    if not evidence_refs:
        return 0

    evidence_map = {
        item["event_id"]: item
        for item in evidence
    }

    supported = 0

    for event_id in evidence_refs:
        if event_id in evidence_map:
            item = evidence_map[event_id]

            if item["evidence_status"] == "Verified":
                supported += 1

    confidence = (
        supported / len(evidence_refs)
    ) * 100

    return round(confidence, 2)


def investigate(query, timeline, evidence, gaps, blast_radius):

    context = build_context(
        timeline,
        evidence,
        gaps,
        blast_radius
    )

    prompt = f"""
ARGUS-X SECURITY EVIDENCE

{context}

ANALYST QUESTION:
{query}

Answer the question using ONLY the supplied evidence.

Do not provide a confidence score.
ARGUS-X will calculate confidence independently.
"""

    try:
        response = client.responses.create(
            model=MODEL,
            instructions=SYSTEM_PROMPT,
            input=prompt
        )

        answer = response.output_text

        evidence_refs = validate_evidence(
            answer,
            evidence
        )

        if not evidence_refs:
            return {
                "answer": "Insufficient evidence to support this answer.",
                "evidence_refs": [],
                "confidence": 0
            }

        confidence = calculate_ai_confidence(
            evidence_refs,
            evidence
        )

        return {
            "answer": answer,
            "evidence_refs": evidence_refs,
            "confidence": confidence
        }

    except Exception as error:
        return {
            "answer": f"AI investigation unavailable: {str(error)}",
            "evidence_refs": [],
            "confidence": 0
        }