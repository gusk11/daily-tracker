'use server';

import { supabase } from './supabaseServer';
import { Category, Habit, Task, DailyReview, HabitCheck } from './types';

// ============ CATEGORIES ============

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function createCategory(name: string, color: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, color }])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    return null;
  }

  return data;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return false;
  }

  return true;
}

export async function ensureDefaultCategories(): Promise<void> {
  const categories = await getCategories();

  if (categories.length > 0) return;

  const defaults = [
    { name: 'Uni', color: '#3b82f6' },
    { name: 'Nachhilfe', color: '#10b981' },
    { name: 'Content', color: '#f59e0b' },
    { name: 'Privat', color: '#8b5cf6' },
  ];

  for (const cat of defaults) {
    await createCategory(cat.name, cat.color);
  }
}

// ============ HABITS ============

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching habits:', error);
    return [];
  }

  return data || [];
}

export async function createHabit(name: string, color: string): Promise<Habit | null> {
  const { data, error } = await supabase
    .from('habits')
    .insert([{ name, color, is_active: true, sort_order: 0 }])
    .select()
    .single();

  if (error) {
    console.error('Error creating habit:', error);
    return null;
  }

  return data;
}

export async function deactivateHabit(id: string): Promise<boolean> {
  const { error } = await supabase.from('habits').update({ is_active: false }).eq('id', id);

  if (error) {
    console.error('Error deactivating habit:', error);
    return false;
  }

  return true;
}

// ============ HABIT CHECKS ============

export async function getHabitChecks(startDate?: string, endDate?: string): Promise<HabitCheck[]> {
  let query = supabase.from('habit_checks').select('*');

  if (startDate && endDate) {
    query = query.gte('date', startDate).lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching habit checks:', error);
    return [];
  }

  return data || [];
}

export async function toggleHabitCheck(habitId: string, date: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from('habit_checks')
    .select('*')
    .eq('habit_id', habitId)
    .eq('date', date)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('habit_checks')
      .delete()
      .eq('habit_id', habitId)
      .eq('date', date);

    if (error) {
      console.error('Error unchecking habit:', error);
      return false;
    }
  } else {
    const { error } = await supabase
      .from('habit_checks')
      .insert([{ habit_id: habitId, date, checked: true }]);

    if (error) {
      console.error('Error checking habit:', error);
      return false;
    }
  }

  return true;
}

// ============ TASKS ============

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', {
    ascending: false,
  });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data || [];
}

export async function createTask(
  title: string,
  categoryId: string | null,
  dueDate: string | null,
  estimatedMinutes: number,
  note: string | null
): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        title,
        category_id: categoryId,
        due_date: dueDate,
        estimated_minutes: estimatedMinutes,
        note,
        status: 'open',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  return data;
}

export async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    return null;
  }

  return data;
}

export async function completeTask(id: string, completedDate: string): Promise<Task | null> {
  return updateTask(id, {
    status: 'done',
    completed_at: new Date().toISOString(),
    completed_date: completedDate,
  } as any);
}

export async function reopenTask(id: string): Promise<Task | null> {
  return updateTask(id, {
    status: 'open',
    completed_at: null,
    completed_date: null,
  } as any);
}

export async function postponeTask(id: string, newDueDate: string): Promise<Task | null> {
  const task = await supabase.from('tasks').select('*').eq('id', id).single();

  if (task.error) {
    console.error('Error fetching task:', task.error);
    return null;
  }

  const currentPostponed = task.data?.postponed_count || 0;

  return updateTask(id, {
    due_date: newDueDate,
    postponed_count: currentPostponed + 1,
    last_postponed_at: new Date().toISOString(),
  } as any);
}

export async function deleteTask(id: string): Promise<boolean> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }

  return true;
}

// ============ DAILY REVIEWS ============

export async function getDailyReview(date: string): Promise<DailyReview | null> {
  const { data, error } = await supabase
    .from('daily_reviews')
    .select('*')
    .eq('date', date)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching daily review:', error);
  }

  return data || null;
}

export async function getDailyReviewsInRange(
  startDate: string,
  endDate: string
): Promise<DailyReview[]> {
  const { data, error } = await supabase
    .from('daily_reviews')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching daily reviews:', error);
    return [];
  }

  return data || [];
}

export async function upsertDailyReview(
  date: string,
  review: Partial<DailyReview>
): Promise<DailyReview | null> {
  const { data, error } = await supabase
    .from('daily_reviews')
    .upsert(
      {
        date,
        ...review,
      },
      {
        onConflict: 'date',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting daily review:', error);
    return null;
  }

  return data;
}
