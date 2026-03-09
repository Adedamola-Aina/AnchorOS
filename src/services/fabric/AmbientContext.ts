import type { FabricContext, SpecialContext } from '../../types';

function resolveTimeOfDay(hour: number): FabricContext['timeOfDay'] {
  if (hour >= 5 && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 16) return 'afternoon';
  if (hour >= 17 && hour <= 20) return 'evening';
  return 'night';
}

function resolveSpecialContext(month: number, dayOfMonth: number): SpecialContext | null {
  if (month === 0 && dayOfMonth <= 7) return 'new_year';
  if (month === 11 && dayOfMonth >= 25) return 'end_of_year';
  if (month >= 10 && month <= 11) return 'holiday_season';
  if (month >= 0 && month <= 3) return 'tax_season';
  return null;
}

export function getAmbientContext(now: Date = new Date()): FabricContext {
  const hour = now.getUTCHours();
  const dayOfWeek = now.getUTCDay();
  const dayOfMonth = now.getUTCDate();
  const month = now.getUTCMonth();
  const year = now.getUTCFullYear();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  return {
    timeOfDay: resolveTimeOfDay(hour),
    dayOfWeek,
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    isFirstOfMonth: dayOfMonth === 1,
    isEndOfMonth: dayOfMonth >= daysInMonth - 2,
    dayOfMonth,
    hour,
    specialContext: resolveSpecialContext(month, dayOfMonth),
  };
}
