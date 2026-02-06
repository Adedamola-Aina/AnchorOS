/**
 * csvExport - Converts structured data to CSV and triggers download.
 */

type Row = Record<string, unknown>;

function escapeCell(value: unknown): string {
  if (value == null) return '';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows: Row[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCell(row[h])).join(','));
  }
  return lines.join('\n');
}

export function downloadCsv(data: { accounts: Row[]; transactions: Row[]; commitments: Row[] }): void {
  const sections: string[] = [];

  if (data.accounts.length > 0) {
    sections.push('# Accounts\n' + toCsv(data.accounts));
  }
  if (data.transactions.length > 0) {
    sections.push('# Transactions\n' + toCsv(data.transactions));
  }
  if (data.commitments.length > 0) {
    sections.push('# Commitments\n' + toCsv(data.commitments));
  }

  const content = sections.join('\n\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `anchor-data-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
