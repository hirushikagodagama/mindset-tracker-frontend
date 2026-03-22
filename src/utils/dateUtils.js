export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getDayOfWeek = (year, month, date) => {
  return new Date(year, month, date).getDay();
};

export const getWeekStart = (date) => {
  const dow = date.getDay();
  const ws = new Date(date);
  ws.setDate(date.getDate() - (dow === 0 ? 6 : dow - 1));
  return ws;
};

export const formatDateParams = (year, month, day) => {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
