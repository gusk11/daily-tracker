/**
 * Datumsutilities für den Daily Tracker
 * Alle Daten werden als YYYY-MM-DD Strings gespeichert und verarbeitet
 */

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(date: string): string {
  const dateObj = new Date(date + 'T00:00:00');
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];

  const dayName = days[dateObj.getDay()];
  const dayNum = dateObj.getDate();
  const monthName = months[dateObj.getMonth()];

  return `${dayName}, ${dayNum}. ${monthName} ${dateObj.getFullYear()}`;
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getNextDay(date: string): string {
  const dateObj = new Date(date + 'T00:00:00');
  dateObj.setDate(dateObj.getDate() + 1);
  return formatDate(dateObj);
}

export function getPreviousDay(date: string): string {
  const dateObj = new Date(date + 'T00:00:00');
  dateObj.setDate(dateObj.getDate() - 1);
  return formatDate(dateObj);
}

export function getWeekStart(date: string): string {
  const dateObj = new Date(date + 'T00:00:00');
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(dateObj.setDate(diff));
  return formatDate(monday);
}

export function getWeekEnd(date: string): string {
  const weekStart = getWeekStart(date);
  const dateObj = new Date(weekStart + 'T00:00:00');
  dateObj.setDate(dateObj.getDate() + 6);
  return formatDate(dateObj);
}

export function getWeekDates(date: string): string[] {
  const start = getWeekStart(date);
  const dates: string[] = [];
  const dateObj = new Date(start + 'T00:00:00');

  for (let i = 0; i < 7; i++) {
    dates.push(formatDate(dateObj));
    dateObj.setDate(dateObj.getDate() + 1);
  }

  return dates;
}

export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

export function isOverdue(dueDate: string, compareDate: string): boolean {
  return dueDate < compareDate;
}

export function isToday(dueDate: string, compareDate: string): boolean {
  return isSameDay(dueDate, compareDate);
}

export function isFuture(dueDate: string, compareDate: string): boolean {
  return dueDate > compareDate;
}

export function parseISODate(isoDate: string): Date {
  return new Date(isoDate + 'T00:00:00');
}
