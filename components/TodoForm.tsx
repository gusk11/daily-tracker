'use client';

import { useState } from 'react';
import { Category } from '@/lib/types';
import { createTask } from '@/lib/actions';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';

interface TodoFormProps {
  categories: Category[];
  onTaskCreated: () => void;
}

export default function TodoForm({ categories, onTaskCreated }: TodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Titel erforderlich');
      return;
    }

    setIsLoading(true);
    await createTask(
      title,
      categoryId,
      dueDate || null,
      parseInt(estimatedMinutes) || 0,
      note || null
    );

    // Form zurücksetzen
    setTitle('');
    setCategoryId(null);
    setDueDate('');
    setEstimatedMinutes('');
    setNote('');
    setIsOpen(false);
    onTaskCreated();
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="primary"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        + Neue Aufgabe
      </Button>
    );
  }

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Neue Aufgabe</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Was musst du tun?"
          disabled={isLoading}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Kategorie
            </label>
            <select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value || null)}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Ohne Kategorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fälligkeitsdatum
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <Input
          label="Geschätzter Aufwand (Minuten)"
          type="number"
          value={estimatedMinutes}
          onChange={(e) => setEstimatedMinutes(e.target.value)}
          placeholder="0"
          disabled={isLoading}
        />

        <Textarea
          label="Notiz"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optionale Notiz..."
          disabled={isLoading}
          className="h-24"
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            className="flex-1"
          >
            Hinzufügen
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Abbrechen
          </Button>
        </div>
      </form>
    </Card>
  );
}
