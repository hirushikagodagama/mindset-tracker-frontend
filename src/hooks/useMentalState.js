import { useContext } from 'react';
import { HabitContext } from '../context/HabitContext';

const useMentalState = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useMentalState must be used within a HabitProvider');
  }
  return {
    mentalState: context.mentalState,
    logMental: context.logMental
  };
};

export default useMentalState;
