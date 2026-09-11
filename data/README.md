# ARGUS-X Synthetic Telemetry

Team-generated synthetic dataset for the ARGUS-X prototype.

Sources:
- authentication_logs.csv
- endpoint_logs.csv
- network_logs.csv
- application_logs.csv

The dataset contains benign events mixed with a known multi-stage attack:
Failed Login -> Successful Login -> PowerShell Execution -> Credential Access
-> Lateral Movement -> Privilege Escalation -> Database Access

The known attack sequence is ground truth for prototype evaluation.
