import React, { useEffect, useState } from 'react';
import { fetchHealthData } from '../services/api';
import { connectMQTT } from '../services/mqttClient';

type HealthData = {
  _id?: string;
  device_id: string;
  heart_rate: number;
  oxygen_level: number;
  timestamp: string;
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<HealthData[]>([]);

  useEffect(() => {
    // Fetch initial data from the backend
    const getData = async () => {
      try {
        const result = await fetchHealthData();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();

    // Connect to MQTT for real-time updates
    const client = connectMQTT((message) => {
      try {
        const newEntry: HealthData = JSON.parse(message);
        setData((prevData) => [newEntry, ...prevData]); // Add new data at the top
      } catch (error) {
        console.error('Error processing MQTT message:', error);
      }
    });

    // Cleanup MQTT connection on unmount
    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Health Monitoring Dashboard</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Device ID</th>
            <th className="border border-gray-300 p-2">Heart Rate</th>
            <th className="border border-gray-300 p-2">Oxygen Level</th>
            <th className="border border-gray-300 p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{entry.device_id}</td>
              <td className="border border-gray-300 p-2">{entry.heart_rate}</td>
              <td className="border border-gray-300 p-2">{entry.oxygen_level}</td>
              <td className="border border-gray-300 p-2">{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
