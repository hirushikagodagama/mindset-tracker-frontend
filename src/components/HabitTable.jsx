import React, { useEffect, useRef, useState } from 'react';
import useHabits from '../hooks/useHabits';
import { DAYS_SHORT, getDayOfWeek, getDaysInMonth } from '../utils/dateUtils';
import HabitRow from './HabitRow';

const HABIT_COLUMN_WIDTH = 220;
const PROGRESS_COLUMN_WIDTH = 64;
const ESTIMATED_DAY_WIDTH = 44;
const MIN_VISIBLE_DAYS = 7;
const MAX_VISIBLE_DAYS = 14;

const HabitTable = ({ viewYear, viewMonth, onEditHabit }) => {
  const { habits } = useHabits();
  const tableWrapRef = useRef(null);
  const topScrollRef = useRef(null);
  const topScrollInnerRef = useRef(null);
  const [visibleDayCount, setVisibleDayCount] = useState(MAX_VISIBLE_DAYS);
  const [visibleStartDay, setVisibleStartDay] = useState(1);
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const today = now.getDate();
  
  const isCurrentMonth = viewYear === currentYear && viewMonth === currentMonth;
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const visibleEndDay = Math.min(daysInMonth, visibleStartDay + visibleDayCount - 1);
  const hasHorizontalOverflow = daysInMonth > visibleDayCount;
  const canScrollLeft = visibleStartDay > 1;
  const canScrollRight = visibleEndDay < daysInMonth;

  useEffect(() => {
    setVisibleStartDay(1);
  }, [viewMonth, viewYear]);

  useEffect(() => {
    const updateVisibleDayCount = () => {
      if (!tableWrapRef.current) {
        return;
      }

      const viewportWidth = tableWrapRef.current.clientWidth;
      const availableDateWidth = Math.max(
        viewportWidth - HABIT_COLUMN_WIDTH - PROGRESS_COLUMN_WIDTH,
        ESTIMATED_DAY_WIDTH * MIN_VISIBLE_DAYS
      );
      const estimatedVisibleDays = Math.floor(availableDateWidth / ESTIMATED_DAY_WIDTH);
      const nextVisibleDayCount = Math.max(
        MIN_VISIBLE_DAYS,
        Math.min(MAX_VISIBLE_DAYS, estimatedVisibleDays, daysInMonth)
      );

      setVisibleDayCount(nextVisibleDayCount);
    };

    updateVisibleDayCount();

    let resizeObserver;

    if (typeof ResizeObserver !== 'undefined' && tableWrapRef.current) {
      resizeObserver = new ResizeObserver(updateVisibleDayCount);
      resizeObserver.observe(tableWrapRef.current);
    } else {
      window.addEventListener('resize', updateVisibleDayCount);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateVisibleDayCount);
      }
    };
  }, [daysInMonth]);

  useEffect(() => {
    setVisibleStartDay((currentStart) => {
      const maxStartDay = Math.max(daysInMonth - visibleDayCount + 1, 1);

      if (currentStart > maxStartDay) {
        return maxStartDay;
      }

      return currentStart;
    });
  }, [daysInMonth, visibleDayCount]);

  useEffect(() => {
    if (!topScrollRef.current || !topScrollInnerRef.current) {
      return;
    }

    const visibleWidth = topScrollRef.current.clientWidth;
    const maxStartDay = Math.max(daysInMonth - visibleDayCount + 1, 1);
    const totalWidth = hasHorizontalOverflow
      ? Math.max(visibleWidth * (daysInMonth / visibleDayCount), visibleWidth + 1)
      : visibleWidth;

    topScrollInnerRef.current.style.width = `${totalWidth}px`;

    if (!hasHorizontalOverflow) {
      topScrollRef.current.scrollLeft = 0;
      return;
    }

    const maxScrollLeft = Math.max(totalWidth - visibleWidth, 0);
    const nextScrollLeft =
      maxStartDay > 1 ? ((visibleStartDay - 1) / (maxStartDay - 1)) * maxScrollLeft : 0;

    topScrollRef.current.scrollLeft = nextScrollLeft;
  }, [daysInMonth, hasHorizontalOverflow, visibleDayCount, visibleStartDay]);

  const handleTopScrollbarScroll = () => {
    if (!topScrollRef.current) {
      return;
    }

    if (!hasHorizontalOverflow) {
      return;
    }

    const maxStartDay = Math.max(daysInMonth - visibleDayCount + 1, 1);
    const maxScrollLeft = Math.max(
      topScrollRef.current.scrollWidth - topScrollRef.current.clientWidth,
      0
    );
    const scrollRatio = maxScrollLeft > 0 ? topScrollRef.current.scrollLeft / maxScrollLeft : 0;
    const nextStartDay = Math.max(
      1,
      Math.min(Math.round(scrollRatio * (maxStartDay - 1)) + 1, maxStartDay)
    );

    setVisibleStartDay((currentStart) =>
      currentStart === nextStartDay ? currentStart : nextStartDay
    );
  };

  const handleScrollButton = (direction) => {
    const step = Math.min(7, visibleDayCount);
    const maxStartDay = Math.max(daysInMonth - visibleDayCount + 1, 1);

    setVisibleStartDay((currentStart) =>
      Math.max(1, Math.min(currentStart + direction * step, maxStartDay))
    );
  };

  const headerCells = [];
  for (let d = visibleStartDay; d <= visibleEndDay; d += 1) {
    const dow = getDayOfWeek(viewYear, viewMonth, d);
    const isToday = isCurrentMonth && d === today;
    const isWeekend = dow === 0 || dow === 6;
    headerCells.push(
      <th key={d} data-day-cell="true" style={{ width: '44px', opacity: isWeekend ? 0.5 : 1 }}>
        <div style={{ fontSize: '10px', color: 'var(--text3)' }}>{DAYS_SHORT[dow]}</div>
        <div className={isToday ? 'day-today' : ''}>{d}</div>
      </th>
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="tracker-scroll-toolbar">
        <button
          type="button"
          className="tracker-scroll-btn"
          onClick={() => handleScrollButton(-1)}
          disabled={!hasHorizontalOverflow || !canScrollLeft}
          aria-label="Show the previous week of dates"
          title="Move one week earlier"
        >
          {'<'}
        </button>
        <div
          ref={topScrollRef}
          className={`tracker-top-scroll ${hasHorizontalOverflow ? 'is-visible' : 'is-hidden'}`}
          onScroll={handleTopScrollbarScroll}
          aria-label="Scroll habit dates horizontally"
        >
          <div ref={topScrollInnerRef} className="tracker-top-scroll-inner" />
        </div>
        <button
          type="button"
          className="tracker-scroll-btn"
          onClick={() => handleScrollButton(1)}
          disabled={!hasHorizontalOverflow || !canScrollRight}
          aria-label="Show the next week of dates"
          title="Move one week later"
        >
          {'>'}
        </button>
      </div>
      <div ref={tableWrapRef} className="tracker-table-wrap">
        <table className="tracker-table">
          <thead>
            <tr>
              <th className="habit-col">Habit</th>
              {headerCells}
              <th style={{ minWidth: '46px', textAlign: 'right', paddingRight: '4px', fontSize: '11px', color: 'var(--text3)' }}>%</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((h) => (
              <HabitRow
                key={h.id}
                habit={h}
                year={viewYear}
                month={viewMonth + 1}
                daysInMonth={daysInMonth}
                isCurrentMonth={isCurrentMonth}
                today={today}
                visibleStartDay={visibleStartDay}
                visibleEndDay={visibleEndDay}
                onEdit={() => onEditHabit(h)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitTable;
