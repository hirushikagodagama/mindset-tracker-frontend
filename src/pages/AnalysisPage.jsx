import React, { useMemo } from 'react';
import HabitAnalysisChart from '../components/Charts/HabitAnalysisChart';
import useHabits from '../hooks/useHabits';
import { MONTHS, getDaysInMonth } from '../utils/dateUtils';
import { isHabitChecked } from '../utils/habitUtils';
import { analyzeHabitData } from '../utils/analytics';

const AnalysisPage = () => {
  const { habits, checks, mentalState } = useHabits();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const today = now.getDate();
  const subtitle = `${MONTHS[now.getMonth()]} ${year} · ${today} days tracked`;

  const analysis = useMemo(
    () => analyzeHabitData({ habits, checks, mentalState, period: 'month' }),
    [habits, checks, mentalState]
  );

  const scores = useMemo(
    () =>
      habits
        .map((habit) => {
          let done = 0;
          for (let day = 1; day <= today; day += 1) {
            if (isHabitChecked(checks, habit.id, year, month, day)) done += 1;
          }
          return { ...habit, pct: today > 0 ? Math.round((done / today) * 100) : 0 };
        })
        .sort((a, b) => b.pct - a.pct),
    [habits, checks, month, today, year]
  );

  const heatmapBoxes = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month - 1);
    const boxes = [];

    for (let day = 1; day <= daysInMonth; day += 1) {
      const isFuture = day > today;
      let done = 0;

      if (!isFuture) {
        habits.forEach((habit) => {
          if (isHabitChecked(checks, habit.id, year, month, day)) done += 1;
        });
      }

      const pct = habits.length > 0 && !isFuture ? done / habits.length : 0;
      const alpha = isFuture ? 0 : pct === 0 ? 0.07 : 0.15 + pct * 0.85;
      const background =
        pct >= 0.75
          ? `rgba(62,207,142,${alpha})`
          : pct >= 0.5
            ? `rgba(245,166,35,${alpha})`
            : `rgba(92,110,248,${alpha})`;
      const border = day === today ? '1px solid var(--accent)' : '1px solid transparent';

      boxes.push(
        <div
          key={day}
          title={`Day ${day}: ${isFuture ? 'future' : `${Math.round(pct * 100)}%`}`}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            background,
            border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: 'var(--text3)',
            fontFamily: 'var(--mono)',
          }}
        >
          {day}
        </div>
      );
    }

    return boxes;
  }, [checks, habits, month, today, year]);

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Analysis</div>
        <div className="page-sub">{subtitle}</div>
      </div>

      <div className="grid-2" style={{ marginBottom: '20px' }}>
        <div className="card">
          <div className="card-title">Completion rates</div>
          <div style={{ position: 'relative', height: '320px' }}>
            <HabitAnalysisChart />
          </div>
        </div>
        <div className="card" style={{ overflowY: 'auto', maxHeight: '420px' }}>
          <div className="card-title">Breakdown</div>
          <div>
            {scores.map((score) => {
              const color =
                score.pct >= 80 ? '#3ecf8e' :
                score.pct >= 60 ? '#5c6ef8' :
                score.pct >= 40 ? '#f5a623' : '#e84343';
              return (
                <div key={score.id} className="hal-row">
                  <span className="hal-emoji">{score.emoji}</span>
                  <span className="hal-name">{score.name}</span>
                  <div className="hal-bar-wrap">
                    <div className="hal-bar-bg">
                      <div className="hal-bar" style={{ width: `${score.pct}%`, background: color }}></div>
                    </div>
                  </div>
                  <span className="hal-pct" style={{ color }}>{score.pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Monthly heatmap</div>
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {heatmapBoxes}
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '16px' }}>
        <div className="card">
          <div className="card-title">Weekly rhythm</div>
          <div className="weekday-grid">
            {analysis.weekdayStats.map((day) => (
              <div key={day.weekday} className="weekday-row">
                <span className="weekday-label">{day.weekday}</span>
                <div className="weekday-bar">
                  <div className="weekday-fill" style={{ width: `${day.avgCompletion}%` }}></div>
                </div>
                <span className="weekday-value">{day.avgCompletion}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Recovery radar</div>
          {analysis.recoveryHabits.length > 0 ? (
            analysis.recoveryHabits.slice(0, 4).map((habit) => (
              <div key={habit.id} className="recovery-row">
                <div>
                  <div className="mini-title">{habit.emoji} {habit.name}</div>
                  <div className="muted-copy">Recent 7-day rate {habit.recentPct}% vs overall {habit.pct}%</div>
                </div>
                <div className="recovery-pill">{habit.drift} pt drift</div>
              </div>
            ))
          ) : (
            <div className="empty-note">No recovery risks right now. Your recent week is holding steady.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
