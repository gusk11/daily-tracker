'use client';

import { Habit } from '@/lib/types';
import { Card } from './Card';

interface HabitCardProps {
  habit: Habit;
  isChecked: boolean;
  onToggle: () => void;
}

export default function HabitCard({ habit, isChecked, onToggle }: HabitCardProps) {
  return (
    <Card className="cursor-pointer hover:border-sky-500 transition-colors" onClick={onToggle}>
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isChecked ? 'bg-green-500 border-green-500' : 'border-slate-600'
          }`}
        >
          {isChecked && <span className="text-white text-sm">✓</span>}
        </div>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">{habit.name}</p>
          <div
            className="w-8 h-1 rounded-full mt-1"
            style={{ backgroundColor: habit.color }}
          />
        </div>
      </div>
    </Card>
  );
}
