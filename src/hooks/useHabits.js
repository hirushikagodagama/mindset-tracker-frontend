import { useContext } from 'react';
import { HabitContext } from '../context/HabitContext';

const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return {
    habits: context.habits,
    checks: context.checks,
    mentalState: context.mentalState,
    loading: context.loading,
    addHabit: context.addHabit,
    updateHabit: context.updateHabit,
    removeHabit: context.removeHabit,
    toggleCheck: context.toggleCheck,
    logMental: context.logMental
  };
};

export default useHabits;
