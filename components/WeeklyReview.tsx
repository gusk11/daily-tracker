'use client';

import { Habit, Task, DailyReview, HabitCheck } from '@/lib/types';
import { calculateHabitQuote, calculateWeeklyHabitStats, calculateWeeklyTaskStats } from '@/lib/calculations';
import { getWeekDates, getWeekStart, getWeekEnd, formatDateDisplay } from '@/lib/dates';
import { Card, StatCard } from './Card';
import { EmptyState } from './EmptyState';

interface WeeklyReviewProps {
  habits: Habit[];
  habitChecks: HabitCheck[];
  tasks: Task[];
  dailyReviews: DailyReview[];
  date: string;
}

export default function WeeklyReview({
  habits,
  habitChecks,
  tasks,
  dailyReviews,
  date,
}: WeeklyReviewProps) {
  const weekDates = getWeekDates(date);
  const weekStart = getWeekStart(date);
  const weekEnd = getWeekEnd(date);

  const weekHabitQuote = Math.round(
    weekDates.reduce((sum, d) => sum + calculateHabitQuote(habits, habitChecks, d), 0) /
      weekDates.length
  );

  const habitStats = calculateWeeklyHabitStats(habits, habitChecks, weekDates);
  const taskStats = calculateWeeklyTaskStats(tasks, weekDates);
  const insights = dailyReviews
    .filter((r) => weekDates.includes(r.date))
    .filter((r) => r.insight)
    .sort((a, b) => a.date.localeCompare(b.date));

  const questions = dailyReviews
    .filter((r) => weekDates.includes(r.date))
    .filter((r) => r.question)
    .sort((a, b) => a.date.localeCompare(b.date));

  const focuses = dailyReviews
    .filter((r) => weekDates.includes(r.date))
    .filter((r) => r.tomorrow_focus)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Wochenrückblick</h3>
        <p className="text-slate-400 text-sm">
          {formatDateDisplay(weekStart)} – {formatDateDisplay(weekEnd)}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Gewohnheiten"
          value={`${weekHabitQuote}%`}
          icon="🎯"
        />
        <StatCard
          label="Aufgaben erledigt"
          value={taskStats.completed}
          icon="✓"
        />
        <StatCard
          label="Offene Aufgaben"
          value={taskStats.open}
          icon="📋"
        />
        <StatCard
          label="Verschoben"
          value={taskStats.mostPostponed.length}
          icon="⚠"
        />
      </div>

      {habits.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Gewohnheiten</h4>
          <div className="space-y-2">
            {habits.map((habit) => {
              const stats = habitStats.get(habit.id);
              if (!stats) return null;

              return (
                <div key={habit.id} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-slate-400">
                    {habit.name}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${stats.percentage}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 w-12 text-right">
                    {stats.completed}/{stats.total}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {insights.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Erkenntnisse</h4>
          <div className="space-y-2">
            {insights.map((review) => (
              <div key={review.id} className="text-sm text-slate-300 bg-slate-800 p-2 rounded border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">{formatDateDisplay(review.date)}</p>
                <p>{review.insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Offene Fragen</h4>
          <div className="space-y-2">
            {questions.map((review) => (
              <div key={review.id} className="text-sm text-slate-300 bg-slate-800 p-2 rounded border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">{formatDateDisplay(review.date)}</p>
                <p>{review.question}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {focuses.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Fokuspunkte</h4>
          <div className="space-y-2">
            {focuses.map((review) => (
              <div key={review.id} className="text-sm text-slate-300 bg-slate-800 p-2 rounded border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">{formatDateDisplay(review.date)}</p>
                <p>{review.tomorrow_focus}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.length === 0 && questions.length === 0 && focuses.length === 0 && (
        <EmptyState
          title="Keine Notizen"
          description="Nutze die Tagesrückblicke, um Erkenntnisse zu sammeln"
          icon="📝"
        />
      )}
    </Card>
  );
}
