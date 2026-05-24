'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getHabits,
  getHabitChecks,
  getTasks,
  getDailyReview,
  getDailyReviewsInRange,
  getCategories,
  ensureDefaultCategories,
} from '@/lib/actions';
import { Habit, HabitCheck, Task, DailyReview, Category } from '@/lib/types';
import { formatDate, formatDateDisplay, getToday, getPreviousDay, getNextDay, getWeekStart, getWeekEnd } from '@/lib/dates';
import { getOpenTaskCount, getCompletedTaskCount, getPostponedTaskCount, getTotalEstimatedMinutes, calculateHabitQuote, getCompletedTasksForDate } from '@/lib/calculations';
import { Button } from '@/components/Button';
import { StatCard } from '@/components/Card';
import HabitTracker from '@/components/HabitTracker';
import TodoBoard from '@/components/TodoBoard';
import TodoForm from '@/components/TodoForm';
import DailyReviewComponent from '@/components/DailyReview';
import WeeklyReview from '@/components/WeeklyReview';
import CategoryManager from '@/components/CategoryManager';

export default function DashboardPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(getToday());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitChecks, setHabitChecks] = useState<HabitCheck[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dailyReview, setDailyReview] = useState<DailyReview | null>(null);
  const [weeklyReviews, setWeeklyReviews] = useState<DailyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lade alle Daten
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Stelle sicher, dass Default-Kategorien existieren
      await ensureDefaultCategories();

      const [habitsData, categoriesData, tasksData, checksData] = await Promise.all([
        getHabits(),
        getCategories(),
        getTasks(),
        getHabitChecks(),
      ]);

      setHabits(habitsData);
      setCategories(categoriesData);
      setTasks(tasksData);
      setHabitChecks(checksData);

      // Lade Daily Review für aktuelles Datum
      const reviewData = await getDailyReview(currentDate);
      setDailyReview(reviewData);

      // Lade Weekly Reviews
      const weekStart = getWeekStart(currentDate);
      const weekEnd = getWeekEnd(currentDate);
      const reviewsData = await getDailyReviewsInRange(weekStart, weekEnd);
      setWeeklyReviews(reviewsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate);
  };

  const completedToday = getCompletedTasksForDate(tasks, currentDate);
  const openCount = getOpenTaskCount(tasks);
  const completedCount = completedToday.length;
  const habitQuote = calculateHabitQuote(habits, habitChecks, currentDate);
  const openMinutes = getTotalEstimatedMinutes(tasks.filter((t) => t.status === 'open'));
  const postponedCount = getPostponedTaskCount(tasks);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Lädt...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Daily Tracker</h1>
              <p className="text-slate-400 text-sm">{formatDateDisplay(currentDate)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateChange(getPreviousDay(currentDate))}
              >
                ← Gestern
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateChange(getToday())}
                className={currentDate === getToday() ? 'bg-slate-700' : ''}
              >
                Heute
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateChange(getNextDay(currentDate))}
              >
                Morgen →
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistiken */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Offene Aufgaben" value={openCount} icon="📋" />
          <StatCard label="Heute erledigt" value={completedCount} icon="✓" />
          <StatCard label="Gewohnheiten" value={`${habitQuote}%`} icon="🎯" />
          <StatCard label="Offener Aufwand" value={`${openMinutes}min`} icon="⏱" />
          <StatCard label="Verschoben" value={postponedCount} icon="⚠" />
        </div>

        {/* Kategorien */}
        <CategoryManager categories={categories} onCategoryUpdate={loadData} />

        {/* Gewohnheiten */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Gewohnheiten</h2>
          <HabitTracker
            habits={habits}
            habitChecks={habitChecks}
            date={currentDate}
            onToggle={loadData}
          />
        </div>

        {/* Neue Aufgabe */}
        <TodoForm categories={categories} onTaskCreated={loadData} />

        {/* Todo-Board */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Aufgaben</h2>
          <TodoBoard
            tasks={tasks}
            categories={categories}
            currentDate={currentDate}
            onTaskUpdate={loadData}
          />
        </div>

        {/* Erledigte Aufgaben heute */}
        {completedToday.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Erledigt am {formatDateDisplay(currentDate)}</h3>
            <div className="space-y-2">
              {completedToday.map((task) => (
                <div key={task.id} className="text-sm text-slate-300 line-through opacity-50">
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tagesrückblick */}
        <DailyReviewComponent
          date={currentDate}
          review={dailyReview}
          onUpdate={loadData}
        />

        {/* Wochenrückblick */}
        <WeeklyReview
          habits={habits}
          habitChecks={habitChecks}
          tasks={tasks}
          dailyReviews={weeklyReviews}
          date={currentDate}
        />
      </main>
    </div>
  );
}
