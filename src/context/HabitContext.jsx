import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getHabits,
  addHabit as apiAddHabit,
  toggleHabit as apiToggleHabit,
  updateHabit as apiUpdateHabit,
  deleteHabit as apiDeleteHabit,
} from '../services/habitService';
import {
  getMentalState,
  logMentalState as apiLogMentalState,
} from '../services/mentalService';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { isPremiumUser } from '../utils/access';

export const HabitContext = createContext();

const MENTAL_STATE_STORAGE_KEY = 'mindset_mental_state';

const normalizeMentalEntry = (entry) => ({
  date: entry.date,
  mood: entry.mood,
  energy: entry.energy,
  focus: entry.focus ?? entry.motivation,
  motivation: entry.motivation,
  note: entry.note || '',
});

export const HabitProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [checks, setChecks] = useState({});
  const [mentalState, setMentalState] = useState(() => {
    try {
      const stored = localStorage.getItem(MENTAL_STATE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const premiumAccess = isPremiumUser(user);

  useEffect(() => {
    localStorage.setItem(MENTAL_STATE_STORAGE_KEY, JSON.stringify(mentalState));
  }, [mentalState]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setHabits([]);
      setChecks({});
      setMentalState([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [habitRes, historyRes] = await Promise.all([
        getHabits(),
        api.get('/habits/history?limit=3000'),
      ]);

      const userHabits = habitRes.data.data || [];
      const entries = historyRes.data.data?.results || historyRes.data.data || [];

      setHabits(
        userHabits.map((habit) => ({
          id: habit._id,
          name: habit.habitName,
          emoji: habit.icon || 'o',
          targetDays: habit.targetDaysPerWeek || 7,
        }))
      );

      const nextChecks = {};
      if (Array.isArray(entries)) {
        entries.forEach((entry) => {
          if (!entry.completed) return;

          const [year, month, day] = entry.date.split('-');
          const habitId =
            entry.habitId && typeof entry.habitId === 'object'
              ? entry.habitId._id
              : entry.habitId;

          nextChecks[`${habitId}_${parseInt(year, 10)}_${parseInt(month, 10)}_${parseInt(day, 10)}`] = 1;
        });
      }
      setChecks(nextChecks);

      if (premiumAccess) {
        try {
          const mentalRes = await getMentalState();
          const mentalEntries = mentalRes.data.data || [];

          if (Array.isArray(mentalEntries)) {
            setMentalState(
              mentalEntries
                .map(normalizeMentalEntry)
                .sort((a, b) => a.date.localeCompare(b.date))
            );
          }
        } catch (mentalError) {
          console.error('Failed to fetch mental state', mentalError);
        }
      } else {
        setMentalState([]);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, premiumAccess]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addHabit = async (habitData) => {
    try {
      const res = await apiAddHabit({
        habitName: habitData.name,
        icon: habitData.emoji,
        targetDaysPerWeek: habitData.targetDays ?? 7,
      });
      const habit = res.data.data;
      setHabits((prev) => [
        ...prev,
        {
          id: habit._id,
          name: habit.habitName,
          emoji: habit.icon || 'o',
          targetDays: habit.targetDaysPerWeek || 7,
        },
      ]);
      return true;
    } catch (error) {
      console.error('Failed to add habit', error);
      throw error;
    }
  };

  const updateHabit = async (id, habitData) => {
    try {
      await apiUpdateHabit(id, {
        habitName: habitData.name,
        icon: habitData.emoji,
        targetDaysPerWeek: habitData.targetDays ?? 7,
      });
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === id
            ? {
                ...habit,
                name: habitData.name,
                emoji: habitData.emoji,
                targetDays: habitData.targetDays ?? habit.targetDays,
              }
            : habit
        )
      );
      return true;
    } catch (error) {
      console.error('Failed to update habit', error);
      throw error;
    }
  };

  const removeHabit = async (id) => {
    try {
      await apiDeleteHabit(id);
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
      setChecks((prev) => {
        const next = { ...prev };

        Object.keys(next).forEach((key) => {
          if (key.startsWith(`${id}_`)) {
            delete next[key];
          }
        });

        return next;
      });
      return true;
    } catch (error) {
      console.error('Failed to delete habit', error);
      throw error;
    }
  };

  const toggleCheck = async (habitId, year, month, date) => {
    const key = `${habitId}_${year}_${month}_${date}`;
    const isCurrentlyChecked = !!checks[key];
    const monthString = String(month).padStart(2, '0');
    const dayString = String(date).padStart(2, '0');
    const dateString = `${year}-${monthString}-${dayString}`;

    setChecks((prev) => {
      const next = { ...prev };
      if (isCurrentlyChecked) delete next[key];
      else next[key] = 1;
      return next;
    });

    try {
      await apiToggleHabit(habitId, dateString, !isCurrentlyChecked);
    } catch (error) {
      console.error('Failed to toggle habit', error);
      fetchData();
    }
  };

  const logMental = async (data) => {
    if (!premiumAccess) {
      throw new Error('Premium access is required for mindset tracking.');
    }

    const normalized = normalizeMentalEntry(data);

    try {
      setMentalState((prev) => {
        const index = prev.findIndex((entry) => entry.date === normalized.date);
        if (index >= 0) {
          const next = [...prev];
          next[index] = normalized;
          return next;
        }
        return [...prev, normalized].sort((a, b) => a.date.localeCompare(b.date));
      });

      await apiLogMentalState(normalized);
      return true;
    } catch (error) {
      console.error('Failed to log mental state', error);
      throw error;
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        checks,
        mentalState,
        loading,
        addHabit,
        updateHabit,
        removeHabit,
        toggleCheck,
        logMental,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
