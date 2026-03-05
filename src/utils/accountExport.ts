/**
 * Per-account CSV export for finance transactions.
 */

interface ExportableTransaction {
    date: string;
    title: string;
    category: string;
    type: string;
    amountCents: number;
}

function escapeCell(value: unknown): string {
    if (value == null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export function exportAccountCsv(
    accountName: string,
    transactions: ExportableTransaction[],
    currency: string,
): void {
    const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Currency'];
    const rows = transactions.map(tx => [
        escapeCell(tx.date),
        escapeCell(tx.title),
        escapeCell(tx.category),
        escapeCell(tx.type),
        (tx.amountCents / 100).toFixed(2),
        currency,
    ].join(','));

    const content = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anchor-${accountName}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
