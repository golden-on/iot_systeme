import React, { useEffect, useState } from 'react';
import Chart from '../components/Chart';
import Gauge from '../components/Gauge';
import { fetchHealthData } from '../services/api';
import { connectMQTT } from '../services/mqttClient';
import { HealthData } from '../types/types';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<HealthData[]>([]);
  const [heartRateData, setHeartRateData] = useState<number[]>([]);
  const [oxygenLevelData, setOxygenLevelData] = useState<number[]>([]);
  const [temperatureData, setTemperatureData] = useState<number[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchHealthData();
        setData(result);
        setHeartRateData(result.map((entry: HealthData) => entry.heart_rate));
        setOxygenLevelData(result.map((entry: HealthData) => entry.oxygen_level));
        setTemperatureData(result.map((entry: HealthData) => entry.temperature));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();

    const client = connectMQTT((message) => {
      // Handle MQTT messages
      const parsedMessage = JSON.parse(message);
      setData((prevData) => [...prevData, parsedMessage]);
      setHeartRateData((prevData) => [...prevData, parsedMessage.heart_rate]);
      setOxygenLevelData((prevData) => [...prevData, parsedMessage.oxygen_level]);
      setTemperatureData((prevData) => [...prevData, parsedMessage.temperature]);
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Health Monitoring Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Gauge value={data[data.length - 1]?.heart_rate || 0} title="Current Heart Rate" />
        <Gauge value={data[data.length - 1]?.oxygen_level || 0} title="Current Oxygen Level" />
        <Gauge value={data[data.length - 1]?.temperature || 0} title="Current Temperature" />
      </div>
      <div className="mb-8">
        <Chart
          data={{
            labels: data.map((entry) => entry.timestamp),
            datasets: [
              {
                label: 'Heart Rate',
                data: heartRateData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              },
              {
                label: 'Oxygen Level',
                data: oxygenLevelData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
              },
              {
                label: 'Temperature',
                data: temperatureData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Device ID</th>
            <th className="border border-gray-300 p-2">Heart Rate</th>
            <th className="border border-gray-300 p-2">Oxygen Level</th>
            <th className="border border-gray-300 p-2">Temperature</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.device_id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{entry.device_id}</td>
              <td className="border border-gray-300 p-2">{entry.heart_rate}</td>
              <td className="border border-gray-300 p-2">{entry.oxygen_level}</td>
              <td className="border border-gray-300 p-2">{entry.temperature}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;