import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('hospital_store_currency') || 'PKR';
    } catch {
      return 'PKR';
    }
  });

  // 1 USD = 280 PKR standard exchange rate
  const exchangeRate = 280;

  useEffect(() => {
    try {
      localStorage.setItem('hospital_store_currency', currency);
    } catch (e) {
      console.error(e);
    }
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'PKR' ? 'USD' : 'PKR'));
  };

  /**
   * Format amount given in base PKR currency.
   * If currency === 'USD', converts amount / 280.
   */
  const formatPrice = (amountInPKR, showSecondary = false) => {
    if (amountInPKR === undefined || amountInPKR === null || isNaN(amountInPKR)) {
      return currency === 'PKR' ? 'Rs 0' : '$0';
    }

    const pkrNum = Math.round(Number(amountInPKR));
    const usdNum = Math.round((pkrNum / exchangeRate) * 100) / 100;

    const pkrFormatted = 'Rs ' + new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(pkrNum);
    const usdFormatted = '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: usdNum % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(usdNum);

    if (currency === 'USD') {
      if (showSecondary) {
        return `${usdFormatted} (${pkrFormatted})`;
      }
      return usdFormatted;
    } else {
      if (showSecondary) {
        return `${pkrFormatted} (${usdFormatted})`;
      }
      return pkrFormatted;
    }
  };

  const convertPrice = (amountInPKR) => {
    if (!amountInPKR) return 0;
    if (currency === 'USD') {
      return Math.round((Number(amountInPKR) / exchangeRate) * 100) / 100;
    }
    return Number(amountInPKR);
  };

  const currencySymbol = currency === 'PKR' ? 'Rs' : '$';

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        exchangeRate,
        formatPrice,
        convertPrice,
        currencySymbol
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
