import React, { useEffect, useMemo, useState } from 'react';
import useHabits from '../hooks/useHabits';
import useMentalState from '../hooks/useMentalState';
import {
  analyzeHabitData,
  buildDailyCsv,
  buildHabitCsv,
  downloadCsv,
} from '../utils/analytics';

const REPORT_PERIOD_STORAGE_KEY = 'mindset_report_period';

const ReportPage = () => {
  const [period, setPeriod] = useState(() => {
    const stored = localStorage.getItem(REPORT_PERIOD_STORAGE_KEY);
    return ['month', 'week', 'all'].includes(stored) ? stored : 'month';
  });

  const { habits, checks } = useHabits();
  const { mentalState } = useMentalState();

  useEffect(() => {
    localStorage.setItem(REPORT_PERIOD_STORAGE_KEY, period);
  }, [period]);

  const reportData = useMemo(
    () => analyzeHabitData({ habits, checks, mentalState, period }),
    [habits, checks, mentalState, period]
  );

  const exportDailyCsv = () => {
    downloadCsv(`mindset-daily-${period}.csv`, buildDailyCsv(reportData));
  };

  const exportHabitCsv = () => {
    downloadCsv(`mindset-habits-${period}.csv`, buildHabitCsv(reportData));
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Monthly Report</div>
        <div className="page-sub">Insights and progress analysis</div>
      </div>

      <div className="report-period">
        <button className={`period-btn ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>This Month</button>
        <button className={`period-btn ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>This Week</button>
        <button className={`period-btn ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>All Time</button>
      </div>

      <div id="report-content">
        <div className="report-toolbar">
          <button className="btn btn-ghost" onClick={exportDailyCsv}>Export Daily CSV</button>
          <button className="btn btn-ghost" onClick={exportHabitCsv}>Export Habit CSV</button>
        </div>

        <div className="report-highlight">
          <div className="rh-title">Report summary</div>
          <div className="rh-text">
            {reportData.label}: you completed <strong>{reportData.totalDone}</strong> of <strong>{reportData.totalPossible}</strong> possible habit-days with an overall score of <strong style={{ color: reportData.overall >= 75 ? 'var(--accent2)' : reportData.overall >= 50 ? 'var(--accent3)' : 'var(--danger)' }}>{reportData.overall}% (Grade: {reportData.grade})</strong>. Current streak: <strong>{reportData.streak}</strong> days across <strong>{habits.length}</strong> habits.
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '14px' }}>
          <div className="report-card">
            <div className="report-section-title">Strong habits</div>
            <div className="badge-list">
              {reportData.strong.length > 0 ? reportData.strong.map((habit) => (
                <span key={habit.id} className="badge badge-green">{habit.emoji} {habit.name} - {habit.pct}%</span>
              )) : <span style={{ color: 'var(--text3)', fontSize: '13px' }}>None above 75% yet</span>}
            </div>
          </div>
          <div className="report-card">
            <div className="report-section-title">Needs work</div>
            <div className="badge-list">
              {reportData.weak.length > 0 ? reportData.weak.map((habit) => (
                <span key={habit.id} className="badge badge-red">{habit.emoji} {habit.name} - {habit.pct}%</span>
              )) : <span style={{ color: 'var(--accent2)', fontSize: '13px' }}>Nothing below 40% right now.</span>}
            </div>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: '14px' }}>
          <div className="report-card compact">
            <div className="report-section-title">Best day</div>
            <div className="metric-big">{reportData.bestDay?.weekday || '--'}</div>
            <div className="muted-copy">{reportData.bestDay?.avgCompletion || 0}% average completion</div>
          </div>
          <div className="report-card compact">
            <div className="report-section-title">Trend</div>
            <div className={`metric-big ${reportData.trendDelta >= 0 ? 'green' : 'red'}`}>{reportData.trendDelta >= 0 ? '+' : ''}{reportData.trendDelta}</div>
            <div className="muted-copy">versus the previous 7-day window</div>
          </div>
          <div className="report-card compact">
            <div className="report-section-title">Mindset average</div>
            <div className="metric-stack">
              <span>Mood {reportData.mentalAverages?.mood ?? '--'}</span>
              <span>Energy {reportData.mentalAverages?.energy ?? '--'}</span>
              <span>Focus {reportData.mentalAverages?.focus ?? '--'}</span>
            </div>
          </div>
        </div>

        <div className="report-card" style={{ marginBottom: '14px' }}>
          <div className="report-section-title">All habits</div>
          {reportData.habitStats.map((habit) => {
            const color = habit.pct >= 75 ? '#3ecf8e' : habit.pct >= 50 ? '#f5a623' : '#e84343';
            return (
              <div key={habit.id} className="hal-row">
                <span className="hal-emoji">{habit.emoji}</span>
                <span className="hal-name">{habit.name}</span>
                <div className="hal-bar-wrap">
                  <div className="hal-bar-bg">
                    <div className="hal-bar" style={{ width: `${habit.pct}%`, background: color }}></div>
                  </div>
                </div>
                <span className="hal-pct" style={{ color }}>{habit.pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="report-card">
          <div className="report-section-title">AI-powered insights</div>
          <div className="insight-list">
            {reportData.insights.map((insight) => (
              <div key={insight.title} className="insight-item">
                <span className={`insight-dot ${insight.tone}`}></span>
                <div>
                  <div className="mini-title">{insight.title}</div>
                  <div className="insight-text">{insight.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
