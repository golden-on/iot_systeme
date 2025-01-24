import paho.mqtt.publish as publish
import json
import time
import random

def generate_message():
    return {
        "device_id": f"device{random.randint(1, 1000)}",
        "heart_rate": random.randint(60, 100),
        "oxygen_level": random.randint(90, 100),
        "temperature": round(random.uniform(36.0, 38.0), 1),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

while True:
    message = generate_message()
    publish.single(
        topic="health/monitoring",
        payload=json.dumps(message),
        hostname="test.mosquitto.org",
        port=1883
    )
    print(f"Message published: {message}")
    time.sleep(2)
