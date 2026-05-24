'use client';

import { useState } from 'react';
import { Category } from '@/lib/types';
import { createCategory, deleteCategory } from '@/lib/actions';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';

interface CategoryManagerProps {
  categories: Category[];
  onCategoryUpdate: () => void;
}

export default function CategoryManager({
  categories,
  onCategoryUpdate,
}: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Name erforderlich');
      return;
    }

    setIsLoading(true);
    await createCategory(name, color);
    setName('');
    setColor('#3b82f6');
    setIsAdding(false);
    onCategoryUpdate();
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Kategorie löschen?')) {
      setIsLoading(true);
      await deleteCategory(id);
      onCategoryUpdate();
      setIsLoading(false);
    }
  };

  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-300">Kategorien</h3>

      {isAdding ? (
        <form onSubmit={handleAdd} className="space-y-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={isLoading}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isLoading}
              className="flex-1"
            >
              Hinzufügen
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Abbrechen
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 text-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-300">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  disabled={isLoading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full"
          >
            + Neue Kategorie
          </Button>
        </>
      )}
    </Card>
  );
}
