import React, { useEffect, useMemo, useState } from 'react';
import StatsCards from '../components/StatsCards';
import WeekGrid from '../components/WeekGrid';
import WeeklyChart from '../components/Charts/WeeklyChart';
import useHabits from '../hooks/useHabits';
import { analyzeHabitData } from '../utils/analytics';
import { getWeekStart } from '../utils/dateUtils';
import { isHabitChecked } from '../utils/habitUtils';
import { getAiCoach } from '../services/aiService';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyCheckout } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { habits, checks, mentalState } = useHabits();
  const { refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [coachLoading, setCoachLoading] = useState(true);
  const [coachError, setCoachError] = useState('');

  // Handle Paddle checkout redirect with _ptxn
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ptxn = searchParams.get('_ptxn');
    if (ptxn) {
      // Remove query params to avoid re-verifying on refresh
      navigate('/dashboard', { replace: true });
      
      verifyCheckout(ptxn)
        .then(() => {
          refreshUser(); // Updates context, unlocking premium features
        })
        .catch((err) => {
          console.error("Failed to verify Paddle checkout", err);
        });
    }
  }, [location.search, navigate, refreshUser]);

  const analysis = useMemo(
    () => analyzeHabitData({ habits, checks, mentalState, period: 'month' }),
    [habits, checks, mentalState]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchCoach = async () => {
      try {
        setCoachLoading(true);
        setCoachError('');
        const response = await getAiCoach({ refresh: true });

        if (isMounted) {
          setCoach(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch AI coach', error);

        if (isMounted) {
          setCoach(null);
          setCoachError(error.response?.data?.message || 'AI coach is unavailable right now.');
        }
      } finally {
        if (isMounted) {
          setCoachLoading(false);
        }
      }
    };

    fetchCoach();

    return () => {
      isMounted = false;
    };
  }, []);

  const topHabits = useMemo(() => {
    const now = new Date();
    const weekStart = getWeekStart(now);

    return habits
      .map((habit) => {
        let done = 0;
        let total = 0;

        for (let index = 0; index < 7; index += 1) {
          const day = new Date(weekStart);
          day.setDate(weekStart.getDate() + index);
          if (day <= now) {
            total += 1;
            if (isHabitChecked(checks, habit.id, day.getFullYear(), day.getMonth() + 1, day.getDate())) {
              done += 1;
            }
          }
        }

        return {
          ...habit,
          pct: total > 0 ? Math.round((done / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6);
  }, [habits, checks]);

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">This week at a glance</div>
      </div>

      <StatsCards />
      <WeekGrid />

      <div className="card coach-card" style={{ marginBottom: '16px' }}>
        <div className="coach-head">
          <div>
            <div className="card-title" style={{ marginBottom: '6px' }}>AI coach</div>
            <div className="coach-subtitle">Motivation and next steps from your live productivity analysis.</div>
          </div>
          {coach && (
            <div className="coach-score-pill">
              <span>Productivity</span>
              <strong>{Math.round(coach.productivityScore)}</strong>
            </div>
          )}
        </div>

        {coachLoading ? (
          <div className="empty-note">Generating your motivation message...</div>
        ) : coach ? (
          <div className="coach-body">
            <div className="coach-message">{coach.motivationMessage}</div>

            {coach.recommendedHabits?.length > 0 && (
              <div className="coach-section">
                <div className="coach-section-label">Recommended habits</div>
                <div className="coach-chip-list">
                  {coach.recommendedHabits.slice(0, 3).map((habit) => (
                    <span key={habit} className="coach-chip">{habit}</span>
                  ))}
                </div>
              </div>
            )}

            {coach.behaviorSuggestions?.length > 0 && (
              <div className="coach-section">
                <div className="coach-section-label">Coach notes</div>
                <div className="coach-tip-list">
                  {coach.behaviorSuggestions.slice(0, 2).map((suggestion) => (
                    <div key={suggestion} className="coach-tip">{suggestion}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-note">{coachError || 'No AI coaching is available yet. Add habits and mindset entries first.'}</div>
        )}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Weekly completion</div>
          <div className="chart-wrap">
            <WeeklyChart />
          </div>
        </div>
        <div className="card">
          <div className="card-title">Top habits this week</div>
          <div style={{ marginTop: '4px' }}>
            {topHabits.map((habit) => {
              const color = habit.pct >= 75 ? '#3ecf8e' : habit.pct >= 50 ? '#f5a623' : '#5c6ef8';
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
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '16px' }}>
        <div className="card">
          <div className="card-title">Insight pulse</div>
          <div className="insight-list">
            {analysis.insights.slice(0, 3).map((insight) => (
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

        <div className="card">
          <div className="card-title">Next best move</div>
          {analysis.nextBestAction ? (
            <div className="focus-panel">
              <div className="focus-kicker">Recommended focus</div>
              <div className="focus-name">
                <span>{analysis.nextBestAction.emoji}</span>
                <span>{analysis.nextBestAction.name}</span>
              </div>
              <div className="focus-copy">
                {analysis.nextBestAction.drift >= 15
                  ? `This habit has cooled off recently. Its last 7 days are ${analysis.nextBestAction.recentPct}% versus ${analysis.nextBestAction.pct}% across the full period.`
                  : `This is your clearest growth opportunity right now with a ${analysis.nextBestAction.pct}% completion rate.`}
              </div>
              <div className="focus-meta">
                <span>Best day: {analysis.bestDay?.weekday || '--'}</span>
                <span>Streak: {analysis.streak} days</span>
                <span>Trend: {analysis.trendDelta >= 0 ? '+' : ''}{analysis.trendDelta} pts</span>
              </div>
            </div>
          ) : (
            <div className="empty-note">Add habits and check in consistently to unlock suggestions.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
