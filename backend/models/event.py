from pydantic import BaseModel
from typing import Optional


class SecurityEvent(BaseModel):
    event_id: str
    timestamp: str
    source_type: str
    event_type: str
    user: Optional[str] = None
    source_ip: Optional[str] = None
    source_host: Optional[str] = None
    destination_host: Optional[str] = None
    action: Optional[str] = None
    severity: Optional[str] = None