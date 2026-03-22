import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import useHabits from '../../hooks/useHabits';
import { isHabitChecked } from '../../utils/habitUtils';
import { getWeekStart } from '../../utils/dateUtils';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const WeeklyChart = () => {
  const { habits, checks } = useHabits();

  const chartData = useMemo(() => {
    const now = new Date();
    const wLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const ws = getWeekStart(now);
    
    const weekPcts = [];
    const bgColors = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(ws);
        d.setDate(ws.getDate() + i);
        const isFuture = d > now;
        
        const dm = d.getDate();
        const dm_m = d.getMonth() + 1;
        const dm_y = d.getFullYear();
        
        let dn = 0;
        if (!isFuture) {
            habits.forEach(h => {
                if (isHabitChecked(checks, h.id, dm_y, dm_m, dm)) dn++;
            });
        }
        
        const pct = habits.length > 0 && !isFuture ? Math.round((dn / habits.length) * 100) : 0;
        weekPcts.push(pct);
        bgColors.push(pct >= 75 ? 'rgba(62,207,142,0.7)' : pct >= 50 ? 'rgba(245,166,35,0.7)' : 'rgba(92,110,248,0.7)');
    }

    return {
      labels: wLabels,
      datasets: [
        {
          data: weekPcts,
          backgroundColor: bgColors,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };
  }, [habits, checks]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b8fa8' } },
      y: { max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b8fa8', callback: v => v + '%' } }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default WeeklyChart;
