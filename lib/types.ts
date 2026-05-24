export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HabitCheck {
  id: string;
  habit_id: string;
  date: string;
  checked: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  category_id: string | null;
  title: string;
  note: string | null;
  due_date: string | null;
  estimated_minutes: number;
  status: 'open' | 'done';
  postponed_count: number;
  last_postponed_at: string | null;
  completed_at: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyReview {
  id: string;
  date: string;
  progress: string | null;
  insight: string | null;
  question: string | null;
  tomorrow_focus: string | null;
  good: string | null;
  bad: string | null;
  brain_dump: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'open' | 'done';
