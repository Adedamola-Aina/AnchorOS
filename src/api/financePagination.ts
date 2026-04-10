import { where, orderBy, limit, startAfter, documentId, type QueryConstraint } from '../utils/secureDb';

export interface TransactionPageCursor {
    date: string;
    id: string;
}

export interface TransactionPageResult<T> {
    page: T[];
    hasMore: boolean;
    nextCursor: TransactionPageCursor | null;
}

export function buildTransactionPageConstraints(
    start: string,
    end: string,
    pageSize: number,
    cursor?: TransactionPageCursor
): QueryConstraint[] {
    const base: QueryConstraint[] = [
        where('date', '>=', start),
        where('date', '<=', end),
        orderBy('date', 'desc'),
        orderBy(documentId(), 'desc')
    ];

    if (!cursor) return [...base, limit(pageSize + 1)];
    return [...base, startAfter(cursor.date, cursor.id), limit(pageSize + 1)];
}

type TransactionWithCursor = { id: string; date?: string };

export function sliceTransactionPage<T extends TransactionWithCursor>(rows: T[], pageSize: number): TransactionPageResult<T> {
    const hasMore = rows.length > pageSize;
    const page = hasMore ? rows.slice(0, pageSize) : rows;
    const last = page.length > 0 ? page[page.length - 1] : null;
    const nextCursor = last?.date ? { date: last.date, id: last.id } : null;
    return { page, hasMore, nextCursor };
}
