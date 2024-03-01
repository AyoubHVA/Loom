from pydantic import BaseModel, Field
from typing import Optional, Dict
from bson import ObjectId
import datetime


def new_objectid():
    return str(ObjectId())


# Client Model
class Client(BaseModel):
    id: Optional[str] = None  # Do not set a default value here; MongoDB will generate it
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
            ObjectId: str  # Ensure ObjectIds are converted to strings
        }


# Prospect Model
class Prospect(BaseModel):
    id: Optional[str] = None
    client_id: str
    first_name: str
    company_name: str
    loom_video_url: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            datetime.datetime: lambda v: v.isoformat(),
            ObjectId: lambda v: str(v)
        }
