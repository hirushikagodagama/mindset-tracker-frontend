import React, { useState } from 'react';
import HabitTable from '../components/HabitTable';
import AddHabitModal from '../components/AddHabitModal';
import { MONTHS } from '../utils/dateUtils';

const HabitsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const handleOpenModal = (habit = null) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingHabit(null);
    setIsModalOpen(false);
  };

  const changeMonth = (dir) => {
    let nextMonth = viewMonth + dir;
    let nextYear = viewYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear--;
    }
    setViewMonth(nextMonth);
    setViewYear(nextYear);
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="page-title">Habit Tracker</div>
            <div className="page-sub">{MONTHS[viewMonth]} {viewYear}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="month-nav">
              <button onClick={() => changeMonth(-1)}>&#8249;</button>
              <span className="month-label">{MONTHS[viewMonth]} {viewYear}</span>
              <button onClick={() => changeMonth(1)}>&#8250;</button>
            </div>
            <button className="btn" onClick={() => handleOpenModal()}>+ Add Habit</button>
          </div>
        </div>
      </div>
      <HabitTable viewYear={viewYear} viewMonth={viewMonth} onEditHabit={handleOpenModal} />
      <AddHabitModal isOpen={isModalOpen} onClose={handleCloseModal} editHabitData={editingHabit} />
    </div>
  );
};

export default HabitsPage;
