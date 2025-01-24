import asyncio
import paho.mqtt.client as mqtt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import ObjectId
from dotenv import load_dotenv
import os
from typing import List

app = FastAPI()

# Enable CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client.health_monitoring

# MQTT client configuration
BROKER = "broker.hivemq.com"
PORT = 1883
TOPIC = "health/monitoring"

# Define the MQTT message callback
def on_message(client, userdata, msg):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        # Process the message
        print(f"Received message: {msg.payload.decode()}")
    finally:
        loop.close()

# Initialize MQTT client
mqtt_client = mqtt.Client()
mqtt_client.on_message = on_message

# Connect to the MQTT broker
mqtt_client.connect(BROKER, PORT, 60)

# Start the MQTT client loop
mqtt_client.loop_start()

@app.on_event("startup")
async def start_mqtt():
    mqtt_client.loop_start()

@app.on_event("shutdown")
async def stop_mqtt():
    mqtt_client.loop_stop()

# Custom JSON encoder for ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

# Pydantic model for health data
class HealthData(BaseModel):
    device_id: str
    heart_rate: int
    oxygen_level: int
    temperature: float
    timestamp: str

# API routes
@app.post("/data/")
async def save_health_data(data: List[HealthData]):
    try:
        result = await db.health_data.insert_many([entry.dict() for entry in data])
        return {"message": "Data saved successfully", "ids": [str(id) for id in result.inserted_ids]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save data: {str(e)}")

@app.get("/data/")
async def get_data():
    try:
        data = await db.health_data.find().to_list(100)
        return json.loads(JSONEncoder().encode(data))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")

@app.get("/data/{device_id}")
async def get_device_data(device_id: str):
    try:
        data = await db.health_data.find({"device_id": device_id}).to_list(100)
        if not data:
            raise HTTPException(status_code=404, detail="Device not found")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")

# Start server command: uvicorn api:app --reload || python -m uvicorn api:app --reload