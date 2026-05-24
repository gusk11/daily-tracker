import { Task, Habit, HabitCheck } from './types';
import { getWeekDates, isOverdue, isToday } from './dates';

export function getOpenTaskCount(tasks: Task[]): number {
  return tasks.filter((t) => t.status === 'open').length;
}

export function getCompletedTaskCount(tasks: Task[], completedDate: string): number {
  return tasks.filter((t) => t.status === 'done' && t.completed_date === completedDate).length;
}

export function getCompletedTasksForDate(tasks: Task[], completedDate: string): Task[] {
  return tasks.filter((t) => t.status === 'done' && t.completed_date === completedDate);
}

export function getTasksForDate(tasks: Task[], currentDate: string): Task[] {
  return tasks
    .filter((t) => t.status === 'open' && (!t.due_date || t.due_date >= currentDate))
    .sort((a, b) => {
      // Überfällige zuerst
      if (a.due_date && b.due_date) {
        if (isOverdue(a.due_date, currentDate) && !isOverdue(b.due_date, currentDate)) return -1;
        if (!isOverdue(a.due_date, currentDate) && isOverdue(b.due_date, currentDate)) return 1;
      }

      // Dann heute
      if (a.due_date && b.due_date) {
        if (isToday(a.due_date, currentDate) && !isToday(b.due_date, currentDate)) return -1;
        if (!isToday(a.due_date, currentDate) && isToday(b.due_date, currentDate)) return 1;
      }

      // Dann nach Datum
      if (a.due_date && b.due_date) {
        return a.due_date.localeCompare(b.due_date);
      }

      if (a.due_date) return -1;
      if (b.due_date) return 1;

      return 0;
    });
}

export function getTotalEstimatedMinutes(tasks: Task[]): number {
  return tasks.reduce((sum, task) => sum + (task.estimated_minutes || 0), 0);
}

export function getPostponedTaskCount(tasks: Task[]): number {
  return tasks.filter((t) => t.status === 'open' && t.postponed_count > 0).length;
}

export function calculateHabitCompletion(
  habits: Habit[],
  habitChecks: HabitCheck[],
  date: string
): Map<string, boolean> {
  const completion = new Map<string, boolean>();

  habits.forEach((habit) => {
    const check = habitChecks.find((hc) => hc.habit_id === habit.id && hc.date === date);
    completion.set(habit.id, check?.checked ?? false);
  });

  return completion;
}

export function calculateHabitQuote(
  habits: Habit[],
  habitChecks: HabitCheck[],
  date: string
): number {
  if (habits.length === 0) return 0;

  const completed = habits.filter((habit) => {
    const check = habitChecks.find((hc) => hc.habit_id === habit.id && hc.date === date);
    return check?.checked ?? false;
  }).length;

  return Math.round((completed / habits.length) * 100);
}

export function calculateWeeklyHabitStats(
  habits: Habit[],
  habitChecks: HabitCheck[],
  weekDates: string[]
): Map<string, { completed: number; total: number; percentage: number }> {
  const stats = new Map<string, { completed: number; total: number; percentage: number }>();

  habits.forEach((habit) => {
    let completed = 0;
    weekDates.forEach((date) => {
      const check = habitChecks.find((hc) => hc.habit_id === habit.id && hc.date === date);
      if (check?.checked) completed++;
    });

    const percentage = Math.round((completed / weekDates.length) * 100);
    stats.set(habit.id, { completed, total: weekDates.length, percentage });
  });

  return stats;
}

export function calculateWeeklyTaskStats(tasks: Task[], weekDates: string[]) {
  const completed = tasks.filter((t) => {
    if (t.status !== 'done' || !t.completed_date) return false;
    return weekDates.includes(t.completed_date);
  }).length;

  const open = tasks.filter((t) => t.status === 'open').length;

  const mostPostponed = tasks
    .filter((t) => t.status === 'open')
    .sort((a, b) => b.postponed_count - a.postponed_count)
    .slice(0, 3);

  return { completed, open, mostPostponed };
}
