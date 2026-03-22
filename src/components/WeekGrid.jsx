import React, { useMemo } from 'react';
import useHabits from '../hooks/useHabits';
import { isHabitChecked } from '../utils/habitUtils';
import { getWeekStart } from '../utils/dateUtils';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

const WeekGrid = () => {
  const { habits, checks } = useHabits();
  
  const weekData = useMemo(() => {
    const now = new Date();
    const wLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const ws = getWeekStart(now);
    
    const data = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(ws);
        d.setDate(ws.getDate() + i);
        const isToday = d.toDateString() === now.toDateString();
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
         const col = pct >= 75 ? 'var(--accent2)' : pct >= 50 ? 'var(--accent3)' : pct > 0 ? 'var(--accent)' : 'var(--text3)';
         const chartColor = pct >= 75 ? '#3ecf8e' : pct >= 50 ? '#f5a623' : pct > 0 ? '#5c6ef8' : '#2a2d3a';

         data.push({
             label: wLabels[i],
             date: dm,
             isToday,
             isFuture,
             pct,
             col,
             chartColor
         });
    }
    return data;
  }, [habits, checks]);

  return (
    <div className="week-grid">
      {weekData.map((day, i) => (
        <div key={i} className={`week-day-card ${day.isToday ? 'today' : ''}`}>
          <div className="wdc-day">{day.label}</div>
          <div className="wdc-date">{day.date}</div>
          <div className="donut-wrap">
             {!day.isFuture && (
                  <Doughnut 
                     data={{
                         datasets: [{
                             data: [day.pct, 100 - day.pct],
                             backgroundColor: [day.chartColor, '#1a1d27'],
                             borderWidth: 0
                         }]
                     }}
                     options={{
                         responsive: true,
                         cutout: '72%',
                         plugins: { tooltip: { enabled: false } },
                         maintainAspectRatio: false
                     }}
                  />
             )}
          </div>
          <div className="wdc-pct" style={{ color: day.col }}>
            {day.isFuture ? '—' : `${day.pct}%`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekGrid;
