import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartProps = {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  options?: {
    responsive: boolean;
    scales?: {
      y: {
        beginAtZero: boolean;
      };
    };
  };
};

const Chart: React.FC<ChartProps> = ({ data, options }) => {
  return <Line data={data} options={options} />;
};

export default Chart;