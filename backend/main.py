from typing import List
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import FastAPI, HTTPException, Depends
from database import get_client_collection, get_prospect_collection
from model import Client, Prospect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.jamairo.buzz"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello world"}


def parse_object_id(str_id: str) -> ObjectId:
    try:
        return ObjectId(str_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid Object ID format")


@app.post("/clients/", response_model=Client)
async def create_client(client: Client, clients=Depends(get_client_collection)):
    client_dict = client.dict(by_alias=True)
    client_dict.pop("id", None)
    new_client = await clients.insert_one(client_dict)
    created_client = await clients.find_one({"_id": new_client.inserted_id})
    created_client["id"] = str(created_client["_id"])
    del created_client["_id"]  # Remove the original _id field
    return created_client


@app.get("/clients/", response_model=List[Client])
async def list_clients(clients=Depends(get_client_collection)):
    clients_cursor = clients.find()
    clients_list = await clients_cursor.to_list(length=100)
    response_clients_list = [
        {**client, "id": str(client["_id"])} for client in clients_list  # Add the 'id' field and remove '_id'
    ]
    return response_clients_list


@app.get("/clients/{client_id}/", response_model=Client)
async def get_client(client_id: str, clients=Depends(get_client_collection)):
    _id = parse_object_id(client_id)
    client = await clients.find_one({"_id": _id})
    if client:
        client["id"] = str(client["_id"])
        del client["_id"]  # Remove the original _id field
        return client
    raise HTTPException(status_code=404, detail="Client not found")


@app.post("/prospects/", response_model=Prospect)
async def create_prospect(prospect: Prospect, prospects=Depends(get_prospect_collection),
                          clients=Depends(get_client_collection)):
    if not ObjectId.is_valid(prospect.client_id):
        raise HTTPException(status_code=400, detail="Invalid 'client_id' format")
    if not await clients.find_one({"_id": ObjectId(prospect.client_id)}):
        raise HTTPException(status_code=404, detail="Client not found")
    prospect_dict = prospect.dict(by_alias=True)
    prospect_dict.pop("id", None)
    new_prospect = await prospects.insert_one(prospect_dict)
    created_prospect = await prospects.find_one({"_id": new_prospect.inserted_id})
    created_prospect["id"] = str(created_prospect["_id"])
    del created_prospect["_id"]  # Remove the original _id field
    return created_prospect


@app.get("/clients/{client_id}/prospects/", response_model=List[Prospect])
async def list_prospects(client_id: str, prospects=Depends(get_prospect_collection)):
    prospects_cursor = prospects.find({"client_id": client_id})
    prospects_list = await prospects_cursor.to_list(length=100)

    transformed_prospects = []
    for prospect_doc in prospects_list:
        prospect_doc['id'] = str(prospect_doc.pop('_id', None))
        transformed_prospects.append(prospect_doc)

    return transformed_prospects
