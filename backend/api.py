import asyncio
import paho.mqtt.client as mqtt
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import paho.mqtt.client as mqtt
import json
from dotenv import load_dotenv
import os

app = FastAPI()

# MongoDB connection
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client.health_monitoring

# MQTT client configuration
BROKER = "test.mosquitto.org"
PORT = 1883
TOPIC = "health/monitoring"

# Define the MQTT message callback
def on_message(client, userdata, msg):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        payload = json.loads(msg.payload.decode())
        loop.run_until_complete(save_data(payload))
    finally:
        loop.close()

async def save_data(payload):
    await db.health_data.insert_one(payload)
    print(f"Data saved: {payload}")

# MQTT setup
mqtt_client = mqtt.Client()

mqtt_client.on_message = on_message
mqtt_client.connect(BROKER, PORT, 60)
mqtt_client.subscribe(TOPIC)

@app.on_event("startup")
async def start_mqtt():
    mqtt_client.loop_start()

@app.on_event("shutdown")
async def stop_mqtt():
    mqtt_client.loop_stop()
# Pydantic model for health data
class HealthData(BaseModel):
    device_id: str
    heart_rate: int
    temperature: float
    timestamp: str

# API routes
@app.post("/data/")
async def save_health_data(data: HealthData):
    try:
        result = await db.health_data.insert_one(data.dict())
        return {"message": "Data saved successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save data: {str(e)}")

@app.get("/data/")
async def get_all_health_data():
    try:
        data = await db.health_data.find().to_list(100)
        return data
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

# Start server command: uvicorn main:app --reload