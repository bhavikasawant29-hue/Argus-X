import pandas as pd
from pathlib import Path
from models.event import SecurityEvent

DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "raw"


def get_value(row, column):
    if column not in row.index or pd.isna(row[column]):
        return None
    return str(row[column])


def load_csv(filename, source_type):
    file_path = DATA_DIR / filename
    df = pd.read_csv(file_path)

    events = []

    for index, row in df.iterrows():
        event = SecurityEvent(
            event_id=f"{source_type.upper()}_{index + 1:04d}",
            timestamp=get_value(row, "timestamp"),
            source_type=source_type,
            event_type=get_value(row, "event_type"),
            user=get_value(row, "user"),
            source_ip=get_value(row, "source_ip"),
            source_host=get_value(row, "source_host"),
            destination_host=get_value(row, "destination_host"),
            action=get_value(row, "action"),
            severity=get_value(row, "severity")
        )

        events.append(event)

    return events


def load_all_events():
    authentication = load_csv(
        "authentication_logs.csv",
        "authentication"
    )

    endpoint = load_csv(
        "endpoint_logs.csv",
        "endpoint"
    )

    network = load_csv(
        "network_logs.csv",
        "network"
    )

    application = load_csv(
        "application_logs.csv",
        "application"
    )

    all_events = authentication + endpoint + network + application

    return sorted(all_events, key=lambda event: event.timestamp)