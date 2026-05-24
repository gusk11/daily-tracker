'use client';

import { useState } from 'react';
import { Task, Category } from '@/lib/types';
import { completeTask, postponeTask, deleteTask, updateTask } from '@/lib/actions';
import { formatDateDisplay, getNextDay, isOverdue, isToday } from '@/lib/dates';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';

interface TodoCardProps {
  task: Task;
  category?: Category;
  currentDate: string;
  onUpdate: () => void;
}

export default function TodoCard({
  task,
  category,
  currentDate,
  onUpdate,
}: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNote, setEditNote] = useState(task.note || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    await completeTask(task.id, currentDate);
    onUpdate();
    setIsLoading(false);
  };

  const handlePostpone = async () => {
    setIsLoading(true);
    const nextDay = getNextDay(currentDate);
    await postponeTask(task.id, nextDay);
    onUpdate();
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (confirm('Wirklich löschen?')) {
      setIsLoading(true);
      await deleteTask(task.id);
      onUpdate();
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    await updateTask(task.id, {
      title: editTitle,
      note: editNote || null,
    } as any);
    onUpdate();
    setIsEditing(false);
    setIsLoading(false);
  };

  const dueDateStatus =
    task.due_date && isOverdue(task.due_date, currentDate) && !isToday(task.due_date, currentDate)
      ? 'overdue'
      : task.due_date && isToday(task.due_date, currentDate)
        ? 'today'
        : null;

  if (isEditing) {
    return (
      <Card className="space-y-3">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Titel"
        />
        <Textarea
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          placeholder="Notiz"
          className="h-24"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={handleSaveEdit}
            loading={isLoading}
            className="flex-1"
          >
            Speichern
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="flex-1"
          >
            Abbrechen
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`space-y-2 border-l-4 ${
        dueDateStatus === 'overdue'
          ? 'border-l-red-500'
          : dueDateStatus === 'today'
            ? 'border-l-sky-500'
            : 'border-l-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm truncate">{task.title}</h4>
          {task.note && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{task.note}</p>}
        </div>
      </div>

      {(task.due_date || task.estimated_minutes > 0 || task.postponed_count > 0) && (
        <div className="flex flex-wrap gap-2 text-xs">
          {task.due_date && (
            <span
              className={`px-2 py-1 rounded ${
                dueDateStatus === 'overdue'
                  ? 'bg-red-900 text-red-200'
                  : dueDateStatus === 'today'
                    ? 'bg-sky-900 text-sky-200'
                    : 'bg-slate-700 text-slate-300'
              }`}
            >
              {formatDateDisplay(task.due_date)}
            </span>
          )}
          {task.estimated_minutes > 0 && (
            <span className="px-2 py-1 rounded bg-slate-700 text-slate-300">
              {task.estimated_minutes}min
            </span>
          )}
          {task.postponed_count > 0 && (
            <span
              className={`px-2 py-1 rounded font-semibold ${
                task.postponed_count >= 2
                  ? 'bg-red-900 text-red-200'
                  : 'bg-orange-900 text-orange-200'
              }`}
            >
              ⚠ {task.postponed_count}x
            </span>
          )}
        </div>
      )}

      <div className="flex gap-1 pt-2">
        <Button
          size="sm"
          variant="primary"
          onClick={handleComplete}
          loading={isLoading}
          className="flex-1 text-xs"
        >
          ✓
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handlePostpone}
          loading={isLoading}
          className="flex-1 text-xs"
        >
          →
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="flex-1 text-xs"
        >
          ✎
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={handleDelete}
          loading={isLoading}
          className="flex-1 text-xs"
        >
          ✕
        </Button>
      </div>
    </Card>
  );
}
