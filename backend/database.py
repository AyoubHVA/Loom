from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI, Depends

app = FastAPI()

# MongoDB connection parameters
MONGODB_URL = "mongodb+srv://a_elo:WS54fiLn8Z3RqzuO@cluster0.donvhoq.mongodb.net/?retryWrites=true&w=majority&appName" \
              "=Cluster0"
DATABASE_NAME = "Cluster0"


# Dependency to get database client
def get_database() -> AsyncIOMotorClient:
    client = AsyncIOMotorClient(MONGODB_URL)
    try:
        yield client[DATABASE_NAME]
    finally:
        client.close()


# Helper functions to get specific collections
def get_client_collection(db=Depends(get_database)):
    return db["clients"]


def get_prospect_collection(db=Depends(get_database)):
    return db["prospects"]
