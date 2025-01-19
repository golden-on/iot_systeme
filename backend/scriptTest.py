import paho.mqtt.publish as publish
import json

message = {
    "device_id": "device789",
    "heart_rate": 90,
    "oxygen_level": 92,
    "timestamp": "2025-01-18T15:30:00Z"
}

publish.single(
    topic="health/monitoring",
    payload=json.dumps(message),
    hostname="test.mosquitto.org",
    port=1883
)
print("Message published!")
