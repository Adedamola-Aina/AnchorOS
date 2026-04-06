// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Circle, CheckCircle2 } from 'lucide-react';
import type { AnchorTask } from '../../../types';

interface MonthCalendarViewProps {
  tasks: AnchorTask[];
  onToggle: (id: string, status: boolean) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function getTasksForDay(tasks: AnchorTask[], date: Date): AnchorTask[] {
  const dayName = FULL_DAY_NAMES[date.getDay()];
  const dayNum = date.getDate();
  return tasks.filter((t) => {
    if (t.type === 'daily') return true;
    if (t.type === 'weekly') return t.daysOfWeek?.includes(dayName);
    if (t.type === 'monthly') return t.daysOfMonth?.includes(dayNum) || t.dayOfMonth === dayNum;
    return false;
  });
}

export const MonthCalendarView: React.FC<MonthCalendarViewProps> = ({ tasks, onToggle }) => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());

  const { firstDay, daysInMonth } = useMemo(
    () => getMonthDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goPrev = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
    setSelectedDay(null);
  };
  const goNext = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
    setSelectedDay(null);
  };

  const selectedTasks = useMemo(() => {
    if (!selectedDay) return [];
    return getTasksForDay(tasks, new Date(viewYear, viewMonth, selectedDay));
  }, [tasks, selectedDay, viewYear, viewMonth]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button data-testid="calendar-prev" onClick={goPrev} className="min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">{monthLabel}</h3>
        <button data-testid="calendar-next" onClick={goNext} className="min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-[10px] font-bold text-slate-400 uppercase py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const date = new Date(viewYear, viewMonth, day);
          const dayTasks = getTasksForDay(tasks, date);
          const isToday = isCurrentMonth && day === now.getDate();
          const isSelected = day === selectedDay;
          const hasTasks = dayTasks.length > 0;
          const allComplete = hasTasks && dayTasks.every((t) => t.completed);

          return (
            <button
              key={day}
              data-testid={isToday ? 'calendar-today' : undefined}
              onClick={() => setSelectedDay(day)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all ${
                isSelected ? 'bg-task-500 text-white shadow-sm' : isToday ? 'bg-task-50 dark:bg-task-900/20 text-task-700 dark:text-task-300 ring-1 ring-task-200 dark:ring-task-800' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{day}</span>
              {hasTasks && (
                <div className="flex gap-0.5 mt-0.5" data-testid="task-dot">
                  <span className={`w-1 h-1 rounded-full ${allComplete ? 'bg-emerald-500' : isSelected ? 'bg-white/70' : 'bg-task-400'}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDay && selectedTasks.length > 0 && (
        <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          {selectedTasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <button onClick={() => onToggle(t.id, t.completed)} className="min-w-11 min-h-11 flex items-center justify-center">
                {t.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-slate-300" />}
              </button>
              <span className={`text-sm font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>{t.title}</span>
              {t.priority && t.priority !== 'medium' && (
                <span className={`text-[10px] font-semibold ${t.priority === 'high' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {t.priority === 'high' ? '🔴' : '🟢'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
