export const EMOJIS = [
  '🏃','💪','📚','🧘','💻','✍️','🥗','💧','😴','🌅',
  '🎯','💰','🧠','🎵','🚫','❄️','🌿','🏋️','🚶','📝','📱','⏰','🙏','🔥'
];

export const isHabitChecked = (checks, habitId, year, month, date) => {
  // Expected check shape depends on backend, but let's assume it returns a list of dates or similar.
  // We'll normalize to a string key format: `${habitId}_${year}_${month}_${date}` for frontend quick lookup,
  // or checks could just be an object mapping matching this logic.
  const key = `${habitId}_${year}_${month}_${date}`;
  return !!checks[key];
};
