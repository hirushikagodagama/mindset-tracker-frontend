import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import useMentalState from '../../hooks/useMentalState';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MentalChart = () => {
  const { mentalState } = useMentalState();

  const chartData = useMemo(() => {
    const recent = mentalState.slice(-14);
    return {
      labels: recent.map((entry) => entry.date.slice(5)),
      datasets: [
        {
          label: 'Mood',
          data: recent.map((entry) => entry.mood),
          borderColor: '#5c6ef8',
          backgroundColor: 'rgba(92,110,248,0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#5c6ef8',
        },
        {
          label: 'Energy',
          data: recent.map((entry) => entry.energy),
          borderColor: '#f5a623',
          backgroundColor: 'rgba(245,166,35,0)',
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointBackgroundColor: '#f5a623',
        },
        {
          label: 'Focus',
          data: recent.map((entry) => entry.focus ?? entry.motivation),
          borderColor: '#15b9a5',
          backgroundColor: 'rgba(21,185,165,0)',
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointBackgroundColor: '#15b9a5',
        },
        {
          label: 'Motivation',
          data: recent.map((entry) => entry.motivation),
          borderColor: '#3ecf8e',
          backgroundColor: 'rgba(62,207,142,0)',
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointBackgroundColor: '#3ecf8e',
        },
      ],
    };
  }, [mentalState]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: '#8b8fa8', boxWidth: 10, font: { size: 11 } } },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b8fa8', maxRotation: 45, font: { size: 10 } } },
      y: { min: 0, max: 10, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b8fa8' } },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default MentalChart;
