import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import useHabits from '../../hooks/useHabits';
import { isHabitChecked } from '../../utils/habitUtils';

const HabitAnalysisChart = () => {
  const { habits, checks } = useHabits();

  const chartData = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const today = now.getDate();

    const scores = habits.map(h => {
      let dn = 0;
      for (let d = 1; d <= today; d++) {
        if (isHabitChecked(checks, h.id, y, m, d)) dn++;
      }
      return { ...h, pct: today > 0 ? Math.round((dn / today) * 100) : 0 };
    }).sort((a, b) => b.pct - a.pct);

    return {
      labels: scores.map(s => `${s.emoji} ${s.name}`),
      datasets: [{
        data: scores.map(s => s.pct),
        backgroundColor: scores.map(s => s.pct >= 80 ? 'rgba(62,207,142,0.8)' : s.pct >= 60 ? 'rgba(62,207,142,0.5)' : s.pct >= 40 ? 'rgba(245,166,35,0.75)' : 'rgba(232,67,67,0.6)'),
        borderRadius: 4,
        borderSkipped: false
      }]
    };
  }, [habits, checks]);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b8fa8', callback: v => v + '%' } },
      y: { grid: { display: false }, ticks: { color: '#c8cadb', font: { size: 12 } } }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default HabitAnalysisChart;
