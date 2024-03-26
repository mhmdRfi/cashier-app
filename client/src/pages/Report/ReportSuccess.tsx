
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box } from '@chakra-ui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Sales Data',
    },
  },
};

const salesData = [
  {
    "totalSales": 9000000,
    "totalQuantity": 170,
    "totalTransactions": 90,
    "saleDate": "2023-11-18"
  },
  {
    "totalSales": 8000000,
    "totalQuantity": 200,
    "totalTransactions": 100,
    "saleDate": "2023-11-15"
  },
  {
    "totalSales": 10000000,
    "totalQuantity": 200,
    "totalTransactions": 100,
    "saleDate": "2023-11-16"
  },
  {
    "totalSales": 6258200,
    "totalQuantity": 62,
    "totalTransactions": 34,
    "saleDate": "2023-11-17"
  },
  {
    "totalSales": 7000000,
    "totalQuantity": 200,
    "totalTransactions": 100,
    "saleDate": "2023-11-18"
  }
];

const labels = salesData.map(item => item.saleDate);
export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Total Sales',
      data: salesData.map(item => item.totalSales),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      fill: true,
      label: 'Total Products',
      data: salesData.map(item => item.totalQuantity),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      fill: true,
      label: 'Total Transactions',
      data: salesData.map(item => item.totalTransactions),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
};


export function ReportSuccess() {
  return (
    <Box width='50vw'>
    <Line options={options} data={{ labels, datasets: [data.datasets[0]] }} />
    <Line options={options} data={{ labels, datasets: [data.datasets[1]] }} />
    <Line options={options} data={{ labels, datasets: [data.datasets[2]] }} />
  </Box>
  );
}
