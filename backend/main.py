from typing import List

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import FastAPI, HTTPException, Depends

from database import get_client_collection, get_prospect_collection
from model import Client, Prospect

app = FastAPI()


# Root endpoint
@app.get("/docs")
async def root():
    return


def parse_object_id(str_id: str) -> ObjectId:
    try:
        return ObjectId(str_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid Object ID format")


# Client Endpoints
@app.post("/clients/", response_model=Client)
async def create_client(client: Client, clients=Depends(get_client_collection)):
    client_dict = client.dict(by_alias=True)
    # Do not include the 'id' key if it's None or not provided
    client_dict.pop("id", None)
    new_client = await clients.insert_one(client_dict)
    # Fetch the newly created client using the automatically generated '_id'
    created_client = await clients.find_one({"_id": new_client.inserted_id})
    # Convert the '_id' from ObjectId to string for the response
    created_client["id"] = str(created_client["_id"])
    return created_client


# Modify the list_clients function to convert the '_id' field to 'id' and ensure it is a string
@app.get("/clients/", response_model=List[Client])
async def list_clients(clients=Depends(get_client_collection)):
    clients_cursor = clients.find()
    clients_list = await clients_cursor.to_list(length=100)
    response_clients_list = [
        Client(id=str(client['_id']), **client) for client in clients_list
    ]
    return response_clients_list


@app.get("/clients/", response_model=List[Client])
async def list_clients(clients=Depends(get_client_collection)):
    clients_cursor = clients.find()
    clients_list = await clients_cursor.to_list(length=100)
    return [Client(**client) for client in clients_list]


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
