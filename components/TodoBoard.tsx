'use client';

import { Category, Task } from '@/lib/types';
import { getTasksForDate } from '@/lib/calculations';
import TodoCard from './TodoCard';
import { EmptyState } from './EmptyState';

interface TodoBoardProps {
  tasks: Task[];
  categories: Category[];
  currentDate: string;
  onTaskUpdate: () => void;
}

export default function TodoBoard({
  tasks,
  categories,
  currentDate,
  onTaskUpdate,
}: TodoBoardProps) {
  const tasksForDate = getTasksForDate(tasks, currentDate);

  // Gruppiere nach Kategorie
  const grouped = new Map<string | null, Task[]>();
  tasksForDate.forEach((task) => {
    const key = task.category_id || null;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(task);
  });

  // Kategorien in Reihenfolge
  const categoryIds = Array.from(grouped.keys());
  const orderedCategories = categories.filter((c) => categoryIds.includes(c.id));
  const allKeys = Array.from(new Set([...orderedCategories.map((c) => c.id), null]));

  if (tasksForDate.length === 0) {
    return (
      <EmptyState
        title="Keine offenen Aufgaben"
        description="Großartig! Du hast alles erledigt. 🎉"
        icon="✨"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {allKeys.map((categoryId) => {
        const category = categories.find((c) => c.id === categoryId);
        const columnTasks = grouped.get(categoryId) || [];

        return (
          <div key={categoryId || 'uncategorized'} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-2">
              {category && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              )}
              <h3 className="text-sm font-semibold text-slate-400">
                {category?.name || 'Ohne Kategorie'}
              </h3>
              <span className="text-xs text-slate-500 ml-auto">{columnTasks.length}</span>
            </div>

            <div className="space-y-2">
              {columnTasks.map((task) => (
                <TodoCard
                  key={task.id}
                  task={task}
                  category={category}
                  currentDate={currentDate}
                  onUpdate={onTaskUpdate}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
