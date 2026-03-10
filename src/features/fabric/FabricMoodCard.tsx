import React, { useEffect, useRef, useState } from 'react';
import type { MoodEntry } from '../../types/fabricBriefing';

interface FabricMoodCardProps {
  moodToday: MoodEntry | null;
  onSave: (mood: MoodEntry['mood'], note?: string) => Promise<void>;
}

const MOODS: { value: MoodEntry['mood']; emoji: string; label: string }[] = [
  { value: 1, emoji: '😔', label: 'Rough' },
  { value: 2, emoji: '😕', label: 'Okay-ish' },
  { value: 3, emoji: '😐', label: 'Alright' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

export const FabricMoodCard: React.FC<FabricMoodCardProps> = ({ moodToday, onSave }) => {
  const [selected, setSelected] = useState<MoodEntry['mood'] | null>(moodToday?.mood ?? null);
  const [note, setNote] = useState(moodToday?.note ?? '');
  const [showNote, setShowNote] = useState(false);
  const [saving, setSaving] = useState(false);
  const [animating, setAnimating] = useState<MoodEntry['mood'] | null>(null);
  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (animTimeout.current) clearTimeout(animTimeout.current); }, []);

  const handleSelect = async (mood: MoodEntry['mood']) => {
    setAnimating(mood);
    animTimeout.current = setTimeout(() => setAnimating(null), 350);
    setSelected(mood);
    setSaving(true);
    await onSave(mood, note || undefined);
    setSaving(false);
  };

  const handleNoteBlur = async () => {
    if (selected && note !== (moodToday?.note ?? '')) {
      await onSave(selected, note || undefined);
    }
  };

  const alreadyLogged = !!moodToday;
  const currentLabel = MOODS.find((m) => m.value === selected)?.label;

  return (
    <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {alreadyLogged ? `Feeling ${currentLabel?.toLowerCase() ?? 'logged'} today` : 'How are you feeling?'}
        </p>
        {saving && <span className="text-xs text-slate-400">Saving…</span>}
      </div>

      <div className="flex justify-between gap-1" role="group" aria-label="Mood selector">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            aria-label={m.label}
            aria-pressed={selected === m.value}
            onClick={() => void handleSelect(m.value)}
            className={`flex-1 min-h-[52px] flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all text-xl
              ${selected === m.value
                ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
          >
            <span
              className={`transition-transform duration-300 ${animating === m.value ? 'scale-150' : 'scale-100'}`}
            >{m.emoji}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">{m.label}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-2">
          {!showNote && !note && (
            <button
              type="button"
              onClick={() => setShowNote(true)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              + Add a note
            </button>
          )}
          {(showNote || note) && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => void handleNoteBlur()}
              placeholder="What's on your mind? (optional)"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          )}
        </div>
      )}
    </article>
  );
};
