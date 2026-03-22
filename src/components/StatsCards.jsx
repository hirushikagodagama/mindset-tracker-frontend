import React, { useMemo } from 'react';
import useHabits from '../hooks/useHabits';
import { isHabitChecked } from '../utils/habitUtils';

const StatsCards = () => {
  const { habits, checks } = useHabits();
  
  const stats = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const today = now.getDate();
    
    let totalDone = 0;
    const totalPossible = habits.length * today;
    
    for (let d = 1; d <= today; d++) {
      habits.forEach(h => {
        if (isHabitChecked(checks, h.id, y, m, d)) totalDone++;
      });
    }
    const overallPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
    
    let streak = 0;
    for (let d = today; d >= 1; d--) {
      if (habits.some(h => isHabitChecked(checks, h.id, y, m, d))) {
        streak++;
      } else {
        break;
      }
    }
    
    let bestH = null;
    let bestP = 0;
    habits.forEach(h => {
      let dn = 0;
      for (let d = 1; d <= today; d++) {
        if (isHabitChecked(checks, h.id, y, m, d)) dn++;
      }
      const p = today > 0 ? Math.round((dn / today) * 100) : 0;
      if (p > bestP) {
        bestP = p;
        bestH = h;
      }
    });

    return { overallPct, streak, activeCount: habits.length, bestH, bestP };
  }, [habits, checks]);

  return (
    <div className="stat-grid">
      <div className="stat-card">
        <div className="stat-val blue">{stats.overallPct}%</div>
        <div className="stat-label">Month completion</div>
      </div>
      <div className="stat-card">
        <div className="stat-val green">{stats.streak}</div>
        <div className="stat-label">Current streak</div>
      </div>
      <div className="stat-card">
        <div className="stat-val amber">{stats.activeCount}</div>
        <div className="stat-label">Active habits</div>
      </div>
      <div className="stat-card">
        <div className="stat-val purple">{stats.bestH ? `${stats.bestH.emoji} ${stats.bestP}%` : '—'}</div>
        <div className="stat-label">Best habit</div>
      </div>
    </div>
  );
};

export default StatsCards;
