from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from bson import ObjectId
import datetime


def new_objectid():
    return str(ObjectId())


# Client Model
class Client(BaseModel):
    id: Optional[str] = None
    first_name: str
    last_name: str
    client_position: str
    company: str
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    additional_info: Dict[str, str]
    sl_analytics: Dict[str, str]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
            ObjectId: lambda v: str(v),
        }


# Prospect Model
class Prospect(BaseModel):
    id: Optional[str] = None
    client_id: str
    first_name: str
    company_name: str
    domain: Optional[str] = None
    loom_video_url: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
            ObjectId: lambda v: str(v)
        }


class LoomUrlUpdate(BaseModel):
    loom_video_url: str


class DomainSetup(BaseModel):
    client_id: str
    domain: str


class DNSInstruction(BaseModel):
    message: str
    record_type: str
    host: str
    points_to: str
    ttl: int


class DomainSetupResponse(BaseModel):
    message: str
    client_id: str
    domain: str
    dns_records: List[DNSInstruction]


class DomainVerification(BaseModel):
    verified: bool
