import { getWeekStart, MONTHS } from './dateUtils';
import { isHabitChecked } from './habitUtils';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
};

const dateToKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildDateRange = (start, end) => {
  const dates = [];
  const cursor = normalizeDate(start);
  const finalDate = normalizeDate(end);

  while (cursor <= finalDate) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

const average = (values) => {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const round = (value, digits = 1) => {
  if (value === null || Number.isNaN(value)) return null;
  return Number(value.toFixed(digits));
};

const getPeriodBounds = (period, now, allDates) => {
  if (period === 'week') {
    return {
      start: getWeekStart(now),
      end: now,
      label: 'This Week',
    };
  }

  if (period === 'all') {
    const fallbackStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstTracked = allDates.length
      ? new Date(Math.min(...allDates.map((date) => normalizeDate(date).getTime())))
      : fallbackStart;

    return {
      start: firstTracked,
      end: now,
      label: 'All Time',
    };
  }

  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: now,
    label: `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
  };
};

export const analyzeHabitData = ({
  habits,
  checks,
  mentalState,
  period = 'month',
}) => {
  const now = normalizeDate(new Date());
  const trackedDates = [
    ...Object.keys(checks)
      .map((key) => {
        const parts = key.split('_');
        if (parts.length < 4) return null;
        const year = Number(parts[1]);
        const month = Number(parts[2]);
        const day = Number(parts[3]);
        if (!year || !month || !day) return null;
        return new Date(year, month - 1, day);
      })
      .filter(Boolean),
    ...mentalState
      .map((entry) => {
        if (!entry?.date) return null;
        const [year, month, day] = entry.date.split('-').map(Number);
        if (!year || !month || !day) return null;
        return new Date(year, month - 1, day);
      })
      .filter(Boolean),
  ];

  const { start, end, label } = getPeriodBounds(period, now, trackedDates);
  const dates = buildDateRange(start, end);
  const periodDateKeys = new Set(dates.map((date) => dateToKey(date)));
  const periodMentalEntries = mentalState.filter((entry) => periodDateKeys.has(entry.date));
  const mentalByDate = Object.fromEntries(periodMentalEntries.map((entry) => [entry.date, entry]));

  const habitStats = habits
    .map((habit) => {
      let completedDays = 0;

      dates.forEach((date) => {
        if (
          isHabitChecked(
            checks,
            habit.id,
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
          )
        ) {
          completedDays += 1;
        }
      });

      const possibleDays = dates.length;
      const pct = possibleDays > 0 ? Math.round((completedDays / possibleDays) * 100) : 0;

      return {
        ...habit,
        completedDays,
        possibleDays,
        pct,
        misses: Math.max(possibleDays - completedDays, 0),
      };
    })
    .sort((a, b) => b.pct - a.pct);

  const dailyRows = dates.map((date) => {
    const completedHabitItems = habits
      .filter((habit) =>
        isHabitChecked(
          checks,
          habit.id,
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        )
      );
    const completedHabits = completedHabitItems.map((habit) => habit.name);
    const completedHabitIds = completedHabitItems.map((habit) => habit.id);

    const totalHabits = habits.length;
    const completedCount = completedHabits.length;
    const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
    const dateKey = dateToKey(date);
    const mental = mentalByDate[dateKey] || null;

    return {
      date,
      dateKey,
      weekday: WEEKDAY_LABELS[date.getDay()],
      completedCount,
      totalHabits,
      completionRate,
      completedHabits,
      completedHabitIds,
      mental,
    };
  });

  const totalDone = dailyRows.reduce((sum, row) => sum + row.completedCount, 0);
  const totalPossible = dailyRows.reduce((sum, row) => sum + row.totalHabits, 0);
  const overall = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
  const bestHabit = habitStats[0] || null;
  const strong = habitStats.filter((habit) => habit.pct >= 75);
  const weak = habitStats.filter((habit) => habit.pct < 40);

  let streak = 0;
  for (let index = dailyRows.length - 1; index >= 0; index -= 1) {
    if (dailyRows[index].completedCount > 0) streak += 1;
    else break;
  }

  const weekdayStats = WEEKDAY_LABELS.map((weekday) => {
    const rows = dailyRows.filter((row) => row.weekday === weekday);
    const avgCompletion = round(average(rows.map((row) => row.completionRate)), 0) || 0;
    return {
      weekday,
      avgCompletion,
      sampleSize: rows.length,
    };
  });

  const bestDay = [...weekdayStats].sort((a, b) => b.avgCompletion - a.avgCompletion)[0];
  const weakestDay = [...weekdayStats].sort((a, b) => a.avgCompletion - b.avgCompletion)[0];

  const recentWindow = dailyRows.slice(-7);
  const previousWindow = dailyRows.slice(-14, -7);
  const recentAverage = round(average(recentWindow.map((row) => row.completionRate)), 0) || 0;
  const previousAverage = round(average(previousWindow.map((row) => row.completionRate)), 0) || 0;
  const trendDelta = recentAverage - previousAverage;

  const latestMental = periodMentalEntries.length ? [...periodMentalEntries].sort((a, b) => a.date.localeCompare(b.date)).at(-1) : null;
  const mentalAverages = periodMentalEntries.length
    ? {
        mood: round(average(periodMentalEntries.map((entry) => entry.mood))),
        energy: round(average(periodMentalEntries.map((entry) => entry.energy))),
        focus: round(average(periodMentalEntries.map((entry) => entry.focus ?? entry.motivation))),
        motivation: round(average(periodMentalEntries.map((entry) => entry.motivation))),
      }
    : null;

  const energyBuckets = dailyRows.filter((row) => row.mental);
  const highEnergyDays = energyBuckets.filter((row) => row.mental.energy >= 7);
  const lowEnergyDays = energyBuckets.filter((row) => row.mental.energy <= 4);
  const energyImpact = {
    high: round(average(highEnergyDays.map((row) => row.completionRate)), 0),
    low: round(average(lowEnergyDays.map((row) => row.completionRate)), 0),
  };

  const recoveryHabits = habitStats
    .map((habit) => {
      const recentCompletions = recentWindow.filter((row) => row.completedHabitIds.includes(habit.id)).length;
      const recentPct = recentWindow.length ? Math.round((recentCompletions / recentWindow.length) * 100) : 0;
      return {
        ...habit,
        recentPct,
        drift: habit.pct - recentPct,
      };
    })
    .filter((habit) => habit.drift >= 15)
    .sort((a, b) => b.drift - a.drift);

  const nextBestAction = recoveryHabits[0] || weak[0] || bestHabit;

  const insights = [];

  if (trendDelta >= 8) {
    insights.push({
      title: 'Momentum is building',
      body: `Your last 7 days are ${trendDelta} points stronger than the previous week. Keep the routine stable and avoid adding extra habits right now.`,
      tone: 'positive',
    });
  } else if (trendDelta <= -8) {
    insights.push({
      title: 'Recent drop detected',
      body: `Completion is down ${Math.abs(trendDelta)} points versus the previous week. Scale back to your most important habits for the next 3 days and rebuild consistency first.`,
      tone: 'warning',
    });
  }

  if (bestHabit) {
    insights.push({
      title: 'Your anchor habit',
      body: `${bestHabit.name} is leading at ${bestHabit.pct}%. Use it as the habit you attach weaker routines to.`,
      tone: 'positive',
    });
  }

  if (weakestDay && bestDay && weakestDay.weekday !== bestDay.weekday) {
    insights.push({
      title: 'Weekly rhythm pattern',
      body: `${bestDay.weekday} is your strongest day (${bestDay.avgCompletion}%), while ${weakestDay.weekday} is the weakest (${weakestDay.avgCompletion}%). Plan easier wins on the low day instead of forcing a full schedule.`,
      tone: 'neutral',
    });
  }

  if (energyImpact.high !== null && energyImpact.low !== null) {
    insights.push({
      title: 'Energy matters',
      body: `On high-energy days you average ${energyImpact.high}% completion, versus ${energyImpact.low}% on low-energy days. Protect sleep and start the hardest habit before noon on good-energy days.`,
      tone: 'neutral',
    });
  }

  if (latestMental) {
    insights.push({
      title: 'Latest check-in signal',
      body: `Your latest check-in shows mood ${latestMental.mood}/10, energy ${latestMental.energy}/10, focus ${(latestMental.focus ?? latestMental.motivation)}/10, motivation ${latestMental.motivation}/10.`,
      tone: 'neutral',
    });
  }

  const grade =
    overall >= 85 ? 'A+' :
    overall >= 75 ? 'A' :
    overall >= 65 ? 'B' :
    overall >= 50 ? 'C' : 'D';

  return {
    label,
    dates,
    dailyRows,
    habitStats,
    totalDone,
    totalPossible,
    overall,
    grade,
    streak,
    strong,
    weak,
    bestHabit,
    bestDay,
    weakestDay,
    recentAverage,
    previousAverage,
    trendDelta,
    mentalAverages,
    latestMental,
    energyImpact,
    recoveryHabits,
    nextBestAction,
    weekdayStats,
    insights,
  };
};

const csvEscape = (value) => {
  const stringValue = value === null || value === undefined ? '' : String(value);
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
};

export const buildDailyCsv = (analysis) => {
  const headers = [
    'date',
    'weekday',
    'completed_count',
    'total_habits',
    'completion_rate',
    'completed_habits',
    'mood',
    'energy',
    'focus',
    'motivation',
    'note',
  ];

  const rows = analysis.dailyRows.map((row) => [
    row.dateKey,
    row.weekday,
    row.completedCount,
    row.totalHabits,
    row.completionRate,
    row.completedHabits.join(', '),
    row.mental?.mood ?? '',
    row.mental?.energy ?? '',
    row.mental?.focus ?? '',
    row.mental?.motivation ?? '',
    row.mental?.note ?? '',
  ]);

  return [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n');
};

export const buildHabitCsv = (analysis) => {
  const headers = [
    'habit',
    'completed_days',
    'possible_days',
    'completion_rate',
    'missed_days',
    'recent_7_day_rate',
  ];

  const rows = analysis.habitStats.map((habit) => [
    habit.name,
    habit.completedDays,
    habit.possibleDays,
    habit.pct,
    habit.misses,
    habit.recentPct ?? '',
  ]);

  return [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n');
};

export const downloadCsv = (filename, content) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
