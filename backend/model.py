from pydantic import BaseModel, Field
from typing import Optional, Dict
from bson import ObjectId
import datetime


def new_objectid():
    return str(ObjectId())


class PydanticObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# Client Model
class Client(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
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
            ObjectId: str,
            PydanticObjectId: str
        }
        allow_population_by_field_name = True


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
