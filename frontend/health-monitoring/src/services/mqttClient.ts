import mqtt from 'mqtt';

const brokerUrl = 'ws://test.mosquitto.org:8080'; // URL du broker MQTT
const topic = 'health/monitoring'; // Sujet que tu veux écouter

export const connectMQTT = (onMessage: (message: string) => void) => {
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(topic, (err) => {
      if (err) {
        console.error('Subscription error:', err);
      } else {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });
  });

  client.on('message', (receivedTopic, message) => {
    if (receivedTopic === topic) {
      onMessage(message.toString());
    }
  });

  client.on('error', (err) => {
    console.error('MQTT Error:', err);
  });

  return client;
};