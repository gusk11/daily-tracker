'use client';

import { Habit, HabitCheck } from '@/lib/types';
import { calculateHabitCompletion } from '@/lib/calculations';
import { toggleHabitCheck } from '@/lib/actions';
import HabitCard from './HabitCard';
import { EmptyState } from './EmptyState';

interface HabitTrackerProps {
  habits: Habit[];
  habitChecks: HabitCheck[];
  date: string;
  onToggle: () => void;
}

export default function HabitTracker({
  habits,
  habitChecks,
  date,
  onToggle,
}: HabitTrackerProps) {
  const completion = calculateHabitCompletion(habits, habitChecks, date);

  const handleToggle = async (habitId: string) => {
    const success = await toggleHabitCheck(habitId, date);
    if (success) {
      onToggle();
    }
  };

  if (habits.length === 0) {
    return <EmptyState title="Keine Gewohnheiten" description="Fügen Sie Ihre erste Gewohnheit hinzu" icon="🎯" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isChecked={completion.get(habit.id) ?? false}
          onToggle={() => handleToggle(habit.id)}
        />
      ))}
    </div>
  );
}
