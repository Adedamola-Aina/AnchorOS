import type { Currency } from '../types';

export const formatCurrency = (amount: number, currency: Currency) => {
    const locale = currency === 'NGN' ? 'en-NG' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};
