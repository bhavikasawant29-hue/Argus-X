# ARGUS-X Dataset

## Overview

This directory contains the synthetic security telemetry used
by ARGUS-X for attack reconstruction and investigation.

The dataset contains 809 events across four telemetry sources:

- Authentication: 232 events
- Endpoint: 223 events
- Network: 203 events
- Application: 151 events

## Data Sources

### authentication_logs.csv
Authentication and login activity.

### endpoint_logs.csv
Endpoint activity such as process execution,
credential access, and privilege escalation.

### network_logs.csv
Network communication, lateral movement,
and database connections.

### application_logs.csv
Application-level database access activity.

## Common Event Schema

Each telemetry source is normalized into the ARGUS-X
SecurityEvent structure:

- event_id
- timestamp
- source_type
- event_type
- user
- source_ip
- source_host
- destination_host
- action
- severity

## Dataset Characteristics

The dataset contains both attack-related events and
legitimate background activity. This allows ARGUS-X
to demonstrate correlation and reconstruction while
keeping unrelated telemetry outside the reconstructed
attack path.

## Privacy

This is synthetic security telemetry created for
demonstration and evaluation. It does not contain
real user or organizational security logs.
