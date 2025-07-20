export const exchangeRates = {
  USD: 1,
  UZS: 12500,
  RUB: 95
};

export const currencySymbols = {
  USD: '$',
  UZS: 'сўм',
  RUB: '₽'
};

export function convertPrice(price: number, fromCurrency: string = 'USD', toCurrency: string = 'USD'): number {
  if (fromCurrency === toCurrency) return price;
  
  // Convert to USD first if not already
  const usdPrice = fromCurrency === 'USD' ? price : price / exchangeRates[fromCurrency as keyof typeof exchangeRates];
  
  // Convert from USD to target currency
  const convertedPrice = toCurrency === 'USD' ? usdPrice : usdPrice * exchangeRates[toCurrency as keyof typeof exchangeRates];
  
  return Math.round(convertedPrice * 100) / 100;
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '$';
  
  if (currency === 'UZS') {
    return `${Math.round(price).toLocaleString()} ${symbol}`;
  }
  
  return `${symbol}${price.toFixed(2)}`;
}

export function getCurrencyOptions() {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'UZS', name: 'Uzbek Som', symbol: 'сўм' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' }
  ];
}