from pydantic import BaseModel, Field
from typing import Optional, Dict
from bson import ObjectId
import datetime


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return str(ObjectId(v))


# Client Model
class Client(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
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
            ObjectId: str
        }
        schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
            }
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
