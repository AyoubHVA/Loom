from typing import List

import dns.resolver
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from database import get_client_collection, get_prospect_collection
from model import Client, Prospect, LoomUrlUpdate, DomainSetup, DomainSetupResponse, DNSInstruction

app = FastAPI()

origins = [
    "http://localhost:8000",
    "https://www.jamairo.buzz",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def client_exists(client_id: str, clients):
    try:
        # If the client_id is not a valid ObjectId, return False
        oid = ObjectId(client_id)
    except InvalidId:
        return False

    # Check if the client exists in the database
    existing_client = await clients.find_one({"_id": oid})
    return existing_client is not None


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


@app.patch("/prospects/{prospect_id}/", response_model=Prospect)
async def update_prospect_loom_url(
        prospect_id: str,
        loom_url_update: LoomUrlUpdate,
        prospects=Depends(get_prospect_collection)
):
    update_result = await prospects.update_one(
        {"_id": ObjectId(prospect_id)},
        {"$set": {"loom_video_url": loom_url_update.loom_video_url}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail=f"Prospect {prospect_id} not found or Loom URL is unchanged")

    updated_prospect = await prospects.find_one({"_id": ObjectId(prospect_id)})
    if updated_prospect is None:
        raise HTTPException(status_code=404, detail=f"Prospect {prospect_id} not found")

    updated_prospect["id"] = str(updated_prospect["_id"])
    del updated_prospect["_id"]

    return updated_prospect


# endpoint for a single prospect
@app.get("/prospects/{prospect_id}/", response_model=Prospect)
async def get_prospect(prospect_id: str, prospects=Depends(get_prospect_collection)):
    _id = parse_object_id(prospect_id)
    prospect = await prospects.find_one({"_id": _id})
    if prospect:
        prospect["id"] = str(prospect["_id"])
        del prospect["_id"]  # Convert the '_id' field from ObjectId to string and remove it
        return prospect
    raise HTTPException(status_code=404, detail="Prospect not found")


# ...
@app.post("/setup-domain/", response_model=DomainSetupResponse)
async def setup_domain(domain_setup: DomainSetup, clients=Depends(get_client_collection)):
    client_id = domain_setup.client_id
    domain = domain_setup.domain

    # Check if client exists
    existing_client = await clients.find_one({"_id": ObjectId(client_id)})
    if not existing_client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Perform the update operation
    update_result = await clients.update_one(
        {"_id": ObjectId(client_id)},
        {"$set": {"domain": domain}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Domain is unchanged")

    # The instruction message for DNS records
    dns_instructions = DNSInstruction(
        message="Please add the following CNAME record:",
        record_type="CNAME",
        host="video",
        points_to="api.jamairo.buzz",
        ttl=3600
    )

    # Return a successful response with DNS instructions
    return {
        "message": "Domain setup initiated successfully.",
        "client_id": client_id,
        "domain": domain,
        "dns_records": [dns_instructions.dict()]  # Convert the Pydantic model to a dict
    }


@app.patch("/verify-domain/{client_id}")
async def verify_domain(client_id: str, clients=Depends(get_client_collection)):
    client = await clients.find_one({"_id": ObjectId(client_id)})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    domain_to_check = 'video.' + client['domain']

    try:
        # This is a synchronous call, you might want to run this in the background
        answers = dns.resolver.resolve(domain_to_check, 'CNAME')
        for record in answers:
            if record.target.to_text().rstrip(
                    '.') == 'api.jamairo.buzz':  # Make sure this matches your expected API endpoint
                await clients.update_one(
                    {"_id": ObjectId(client_id)},
                    {"$set": {"domain_verified": True}}
                )
                return {"message": "Domain verification successful"}
    except dns.resolver.NoAnswer:
        raise HTTPException(status_code=400, detail="CNAME record not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    raise HTTPException(status_code=400, detail="Domain verification failed")
