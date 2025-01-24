import paho.mqtt.publish as publish
import json

# Données à envoyer
message = {
    "device_id": "device456",
    "heart_rate": 85,
    "oxygen_level": 95,
    "temperature": 36.5,
    "timestamp": "2025-01-18T11:00:00Z"
}

# Informations sur le broker MQTT
BROKER_HOST = "test.mosquitto.org"
BROKER_PORT = 1883
MQTT_TOPIC = "health/monitoring"

# Publier le message
try:
    publish.single(
        topic=MQTT_TOPIC,
        payload=json.dumps(message),
        hostname=BROKER_HOST,
        port=BROKER_PORT
    )
    print("Message published successfully!")
except Exception as e:
    print(f"Failed to publish message: {e}")
