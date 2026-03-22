import React from 'react';
import useHabits from '../hooks/useHabits';
import { isHabitChecked } from '../utils/habitUtils';

const HabitRow = ({
  habit,
  year,
  month,
  daysInMonth,
  isCurrentMonth,
  today,
  visibleStartDay,
  visibleEndDay,
  onEdit,
}) => {
  const { checks, toggleCheck } = useHabits();

  const handleCheck = (date) => {
    const isPast = isCurrentMonth ? date < today : !isCurrentMonth;
    const isFuture = isCurrentMonth && date > today;

    if (isPast || isFuture) {
      return;
    }

    toggleCheck(habit.id, year, month, date);
  };

  let doneCount = 0;
  const possible = isCurrentMonth ? today : daysInMonth;
  const cells = [];

  for (let d = 1; d <= daysInMonth; d += 1) {
    const isFuture = isCurrentMonth && d > today;
    const isPast = isCurrentMonth ? d < today : true;
    const isChecked = isHabitChecked(checks, habit.id, year, month, d);

    if (isChecked) {
      doneCount += 1;
    }

    if (d < visibleStartDay || d > visibleEndDay) {
      continue;
    }

    let boxClass = 'check-box';
    if (isChecked) boxClass += ' done';
    if (isFuture) boxClass += ' future';
    if (isPast && !isChecked) boxClass += ' past';

    const title = isFuture
      ? 'Future date - not available yet'
      : isPast
      ? 'Past date - cannot be changed'
      : 'Click to toggle';

    cells.push(
      <td key={d} className="check-cell">
        <div className={boxClass} onClick={() => handleCheck(d)} title={title}>
          {isChecked ? '\u2713' : ''}
        </div>
      </td>
    );
  }

  const pct = possible > 0 ? Math.round((doneCount / possible) * 100) : 0;

  return (
    <tr className="habit-row">
      <td className="habit-sticky-cell">
        <div
          className="habit-name-cell"
          style={{ cursor: 'pointer' }}
          onClick={onEdit}
          title="Edit Habit"
        >
          <span className="habit-emoji">{habit.emoji}</span>
          <span className="habit-name-text">{habit.name}</span>
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text3)' }}>
            {'\u270E'}
          </span>
        </div>
      </td>
      {cells}
      <td className="row-progress">
        <div>{pct}%</div>
        <div className="progress-bar-mini">
          <div className="progress-fill" style={{ width: `${pct}%` }}></div>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(HabitRow);
