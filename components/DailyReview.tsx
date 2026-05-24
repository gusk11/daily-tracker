'use client';

import { useState, useCallback, useEffect } from 'react';
import { DailyReview } from '@/lib/types';
import { upsertDailyReview } from '@/lib/actions';
import { Card } from './Card';
import { Textarea } from './Textarea';
import { Button } from './Button';

interface DailyReviewProps {
  date: string;
  review: DailyReview | null;
  onUpdate: () => void;
}

export default function DailyReviewComponent({ date, review, onUpdate }: DailyReviewProps) {
  const [progress, setProgress] = useState(review?.progress || '');
  const [insight, setInsight] = useState(review?.insight || '');
  const [question, setQuestion] = useState(review?.question || '');
  const [tomorrowFocus, setTomorrowFocus] = useState(review?.tomorrow_focus || '');
  const [good, setGood] = useState(review?.good || '');
  const [bad, setBad] = useState(review?.bad || '');
  const [brainDump, setBrainDump] = useState(review?.brain_dump || '');
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save mit Debounce
  const saveReview = useCallback(async () => {
    setIsSaving(true);
    await upsertDailyReview(date, {
      progress: progress || null,
      insight: insight || null,
      question: question || null,
      tomorrow_focus: tomorrowFocus || null,
      good: good || null,
      bad: bad || null,
      brain_dump: brainDump || null,
    });
    setIsSaving(false);
    onUpdate();
  }, [date, progress, insight, question, tomorrowFocus, good, bad, brainDump, onUpdate]);

  useEffect(() => {
    const timer = setTimeout(saveReview, 1000);
    return () => clearTimeout(timer);
  }, [progress, insight, question, tomorrowFocus, good, bad, brainDump, saveReview]);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Tagesrückblick</h3>
        {isSaving && <span className="text-xs text-slate-400">wird gespeichert...</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label="Wichtigster Fortschritt"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          placeholder="Was hast du heute erreicht?"
          className="h-24"
        />
        <Textarea
          label="Erkenntnis"
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="Was hast du gelernt?"
          className="h-24"
        />
        <Textarea
          label="Offene Frage"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Womit beschäftigst du dich noch?"
          className="h-24"
        />
        <Textarea
          label="Morgen-Fokus"
          value={tomorrowFocus}
          onChange={(e) => setTomorrowFocus(e.target.value)}
          placeholder="Worauf liegt der Fokus morgen?"
          className="h-24"
        />
        <Textarea
          label="Was lief gut?"
          value={good}
          onChange={(e) => setGood(e.target.value)}
          placeholder="Positive Momente..."
          className="h-24"
        />
        <Textarea
          label="Was lief nicht gut?"
          value={bad}
          onChange={(e) => setBad(e.target.value)}
          placeholder="Herausforderungen..."
          className="h-24"
        />
      </div>

      <Textarea
        label="Brain Dump"
        value={brainDump}
        onChange={(e) => setBrainDump(e.target.value)}
        placeholder="Notizen, Gedanken, was dir noch auf den Sinn geht..."
        className="h-32"
      />
    </Card>
  );
}
