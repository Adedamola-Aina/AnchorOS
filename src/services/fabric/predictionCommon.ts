export function inMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

export function nextIso(now: Date, days: number): string {
  const copy = new Date(now);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString();
}
