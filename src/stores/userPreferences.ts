// import { defineStore } from 'pinia';

// export type LanguageType = "ES" | "EN";
// export type CurrencyType = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "MXN" | "BRL" | "INR" | "RUB" | "ZAR";
// export type ThemeType = "light" | "dark";

// export const useUserPreferencesStore = defineStore('userPreferences', {
//   state: () => ({
//     selectedLanguage: localStorage.getItem('language') as LanguageType || "ES",
//     selectedCurrency: localStorage.getItem('currency') as CurrencyType || "USD",
//     selectedTheme: localStorage.getItem('theme') as ThemeType || "light",
//   }),

//   actions: {
//     setSelectedLanguage(language: LanguageType) {
//       this.selectedLanguage = language;
//       localStorage.setItem('language', language);
//     },

//     setSelectedCurrency(currency: CurrencyType) {
//       this.selectedCurrency = currency;
//       localStorage.setItem('currency', currency);
//     },

//     setSelectedTheme(theme: ThemeType) {
//       this.selectedTheme = theme;
//       localStorage.setItem('theme', theme);
//     },

//     getTheme() {
//       const themes = {
//         light: {
//           background: "#f8f9fa",
//           text: "#000000",
//           table: "#e9ecef",
//           settings: "#e9ecef",
//           colorGray: "#e9ecef",
//           colorDarkGray: "#d6d2d2"
//         },
//         dark: {
//           background: "#0f0f0f",
//           text: "#ffffff",
//           table: "#232323",
//           settings: "#232323",
//           colorGray: "#80808062",
//           colorDarkGray: "#232323"
//         }
//       };

//       return themes[this.selectedTheme] || themes.light;
//     },

//     getPriceColor(price: number): string {
//       return price > 0 ? 'green' : 'red'
//     },

//     getArrowDirection(price: number): string {
//       return price > 0 ? 'mdi-menu-up' : 'mdi-menu-down';
//     },

//     getArrowDirectionReverse(price: number): string {
//       return price > 0 ? 'mdi-menu-down' : 'mdi-menu-up';
//     },

//     getLanguages(): LanguageType[] {
//       return ["ES", "EN"];
//     },
    
//     getLanguageLabel(language: LanguageType): string {
//       const languageLabels: { [key in LanguageType]: string } = {
//         ES: "Español",
//         EN: "English",
//       };
//       return languageLabels[language] || language;
//     },

//     getCurrencies(): CurrencyType[] {
//       return ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "MXN", "BRL", "INR", "RUB", "ZAR"];
//     },

//     getCurrencyText(currency: CurrencyType): string {
//       const currencyTexts: { [key in CurrencyType]: string } = {
//         USD: "United States Dollar",
//         EUR: "Euro",
//         GBP: "Pound Sterling",
//         JPY: "Japanese Yen",
//         CAD: "Canadian Dollar",
//         AUD: "Australian Dollar",
//         CHF: "Swiss Franc",
//         CNY: "Chinese Yuan",
//         MXN: "Mexican Peso",
//         BRL: "Brazilian Real",
//         INR: "Indian Rupee",
//         RUB: "Russian Ruble",
//         ZAR: "South African Rand",
//       };

//       return currencyTexts[currency] || "$";
//     },

//     getCurrencyLabel(currency: CurrencyType): string {
//       const currencyLabels: { [key in CurrencyType]: string } = {
//         USD: "$ USD",
//         EUR: "€ EUR",
//         GBP: "£ GBP",
//         JPY: "¥ JPY",
//         CAD: "CA$ CAD",
//         AUD: "A$ AUD",
//         CHF: "CHF CHF",
//         CNY: "¥ CNY",
//         MXN: "$ MXN",
//         BRL: "R$ BRL",
//         INR: "₹ INR",
//         RUB: "₽ RUB",
//         ZAR: "R ZAR",
//       };

//       return currencyLabels[currency] || "$";
//     },

//     getCurrencyConversionRate(currency: CurrencyType) {
//       const currencies = {
//         USD: 1,
//         EUR: 0.92,
//         GBP: 0.78,
//         JPY: 150.5,
//         CAD: 1.36,
//         AUD: 1.49,
//         CHF: 0.91,
//         CNY: 7.06,
//         MXN: 18.12,
//         BRL: 5.14,
//         INR: 83.13,
//         RUB: 84.48,
//         ZAR: 19.58,
//       };

//       return currencies[currency] || 1;
//     },

//     getCurrencySymbol(currency: CurrencyType): string {
//       const currencySymbols: { [key in CurrencyType]: string } = {
//         USD: "$",
//         EUR: "€",
//         GBP: "£",
//         JPY: "¥",
//         CAD: "CA$",
//         AUD: "A$",
//         CHF: "CHF",
//         CNY: "¥",
//         MXN: "$",
//         BRL: "R$",
//         INR: "₹",
//         RUB: "₽",
//         ZAR: "R",
//       };

//       return currencySymbols[currency] || "$";
//     },

//     formatCurrency(value: string, currency: CurrencyType, position: 'before' | 'after' = 'after'): string {
//       const symbol = this.getCurrencySymbol(currency);
//       return position === 'before' ? `${symbol}${value}` : `${value} ${symbol}`;
//     },

//     convertPrice(price: number, currency: CurrencyType, symbolPosition: 'before' | 'after' = 'after'): string {
//       const conversionRate = this.getCurrencyConversionRate(currency);
//       const converted = price * conversionRate;

//       if (Math.abs(converted) < 0.00000001) return this.formatCurrency('0', currency, symbolPosition);

//       const formatNumber = (value: number, decimals: number): string => {
//         return new Intl.NumberFormat('de-DE', {
//           minimumFractionDigits: decimals,
//           maximumFractionDigits: decimals,
//         }).format(value);
//       };

//       let formatted: string;
//       if (Math.abs(converted) < 0.0001) {
//         formatted = formatNumber(converted, 8);
//       } else if (Math.abs(converted) >= 10000) {
//         formatted = formatNumber(converted, 0);
//       } else if (Math.abs(converted) >= 1) {
//         formatted = formatNumber(converted, 2);
//       } else {
//         formatted = formatNumber(converted, 4);
//       }

//       return this.formatCurrency(formatted, currency, symbolPosition);
//     },

//     convertLargeNumber(value: number, currency: CurrencyType, symbolPosition: 'before' | 'after' = 'after'): string {
//       const rate = this.getCurrencyConversionRate(currency);
//       const converted = value * rate;
//       const formatted = converted.toLocaleString('en-US', { maximumFractionDigits: 0 });
//       return this.formatCurrency(formatted, currency, symbolPosition);
//     },

//     convertToAbbreviated(value: number, currency: CurrencyType, symbolPosition: 'before' | 'after' = 'after'): string {
//       const rate = this.getCurrencyConversionRate(currency);
//       const converted = value * rate;
    
//       let formatted: string;
//       if (converted >= 1e12) {
//         formatted = (converted / 1e12).toFixed(2) + 'T';
//       } else if (converted >= 1e9) {
//         formatted = (converted / 1e9).toFixed(2) + 'B';
//       } else if (converted >= 1e6) {
//         formatted = (converted / 1e6).toFixed(2) + 'M';
//       } else if (converted >= 1e3) {
//         formatted = (converted / 1e3).toFixed(2) + 'K';
//       } else {
//         formatted = converted.toFixed(2); // mostrar 2 decimales si es menor a 1000
//       }
    
//       return this.formatCurrency(formatted, currency, symbolPosition);
//     },    

//     convertFromUSD(price: number, currency: CurrencyType): string {
//       const conversionRate = this.getCurrencyConversionRate(currency);
//       let convertedNumber = price * conversionRate;

//       // Si el número convertido es 0 o extremadamente cercano a 0, mostramos "0"
//       if (Math.abs(convertedNumber) < 0.00000001) {
//         const symbol = this.getCurrencySymbol(currency);
//         return `0 ${symbol}`;
//       }
    
//       // Función para formatear el número según las reglas: miles con punto y decimales con coma
//       const formatNumber = (number: number, decimals: number): string => {
//         return new Intl.NumberFormat('de-DE', {
//           minimumFractionDigits: decimals,
//           maximumFractionDigits: decimals,
//         }).format(number);
//       };
    
//       // Si el número es extremadamente pequeño, mantener hasta 8 decimales
//       if (Math.abs(convertedNumber) < 0.0001) {
//         const formattedNumber = formatNumber(convertedNumber, 8); // Limitar a 8 decimales para valores muy pequeños
//         const symbol = this.getCurrencySymbol(currency);
//         return `${formattedNumber} ${symbol}`;
//       }
    
//       // Si el número es mayor o igual a 10,000, no mostrar decimales
//       if (Math.abs(convertedNumber) >= 10000) {
//         const formattedNumber = formatNumber(convertedNumber, 0); // Eliminar los decimales
//         const symbol = this.getCurrencySymbol(currency);
//         return `${formattedNumber} ${symbol}`;
//       }
    
//       // Si el número es mayor o igual a 1, mostrar solo 2 decimales
//       if (Math.abs(convertedNumber) >= 1) {
//         const formattedNumber = formatNumber(convertedNumber, 2); // Limitar a 2 decimales para números >= 1
//         const symbol = this.getCurrencySymbol(currency);
//         return `${formattedNumber} ${symbol}`;
//       }
    
//       // Si el número es menor que 1, mostrar hasta 4 decimales significativos
//       const formattedNumber = formatNumber(convertedNumber, 4); // Limitar a 4 decimales para números menores a 1
//       const symbol = this.getCurrencySymbol(currency);
//       return `${formattedNumber} ${symbol}`;
//     },
//   }
// });

import { defineStore } from 'pinia';

export type LanguageType = "ES" | "EN";
export type CurrencyType = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "MXN" | "BRL" | "INR" | "RUB" | "ZAR";
export type ThemeType = "light" | "dark";

export const useUserPreferencesStore = defineStore('userPreferences', {
  state: () => ({
    selectedLanguage: localStorage.getItem('language') as LanguageType || "ES",
    selectedCurrency: localStorage.getItem('currency') as CurrencyType || "USD",
    selectedTheme: localStorage.getItem('theme') as ThemeType || "light",
  }),

  actions: {
    setSelectedLanguage(language: LanguageType) {
      this.selectedLanguage = language;
      localStorage.setItem('language', language);
    },

    setSelectedCurrency(currency: CurrencyType) {
      this.selectedCurrency = currency;
      localStorage.setItem('currency', currency);
    },

    setSelectedTheme(theme: ThemeType) {
      this.selectedTheme = theme;
      localStorage.setItem('theme', theme);
    },

    getTheme() {
      const themes = {
        light: {
          background: "#f8f9fa",
          text: "#000000",
          table: "#e9ecef",
          settings: "#e9ecef",
          colorGray: "#e9ecef",
          colorDarkGray: "#d6d2d2"
        },
        dark: {
          background: "#0f0f0f",
          text: "#ffffff",
          table: "#232323",
          settings: "#232323",
          colorGray: "#80808062",
          colorDarkGray: "#232323"
        }
      };

      return themes[this.selectedTheme] || themes.light;
    },

    getPriceColor(price: number): string {
      return price > 0 ? 'green' : 'red'
    },

    getArrowDirection(price: number): string {
      return price > 0 ? 'mdi-menu-up' : 'mdi-menu-down';
    },

    getArrowDirectionReverse(price: number): string {
      return price > 0 ? 'mdi-menu-down' : 'mdi-menu-up';
    },

    getLanguages(): LanguageType[] {
      return ["ES", "EN"];
    },
    
    getLanguageLabel(language: LanguageType): string {
      const languageLabels: { [key in LanguageType]: string } = {
        ES: "Español",
        EN: "English",
      };
      return languageLabels[language] || language;
    },

    getCurrencies(): CurrencyType[] {
      return ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "MXN", "BRL", "INR", "RUB", "ZAR"];
    },

    getCurrencyText(currency: CurrencyType): string {
      const currencyTexts: { [key in CurrencyType]: string } = {
        USD: "United States Dollar",
        EUR: "Euro",
        GBP: "Pound Sterling",
        JPY: "Japanese Yen",
        CAD: "Canadian Dollar",
        AUD: "Australian Dollar",
        CHF: "Swiss Franc",
        CNY: "Chinese Yuan",
        MXN: "Mexican Peso",
        BRL: "Brazilian Real",
        INR: "Indian Rupee",
        RUB: "Russian Ruble",
        ZAR: "South African Rand",
      };

      return currencyTexts[currency] || "$";
    },

    getCurrencyLabel(currency: CurrencyType): string {
      const currencyLabels: { [key in CurrencyType]: string } = {
        USD: "$ USD",
        EUR: "€ EUR",
        GBP: "£ GBP",
        JPY: "¥ JPY",
        CAD: "CA$ CAD",
        AUD: "A$ AUD",
        CHF: "CHF CHF",
        CNY: "¥ CNY",
        MXN: "$ MXN",
        BRL: "R$ BRL",
        INR: "₹ INR",
        RUB: "₽ RUB",
        ZAR: "R ZAR",
      };

      return currencyLabels[currency] || "$";
    },

    getCurrencyConversionRate(currency: CurrencyType) {
      const currencies = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.78,
        JPY: 150.5,
        CAD: 1.36,
        AUD: 1.49,
        CHF: 0.91,
        CNY: 7.06,
        MXN: 18.12,
        BRL: 5.14,
        INR: 83.13,
        RUB: 84.48,
        ZAR: 19.58,
      };

      return currencies[currency] || 1;
    },

    getCurrencySymbol(currency: CurrencyType): string {
      const currencySymbols: { [key in CurrencyType]: string } = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
        CAD: "CA$",
        AUD: "A$",
        CHF: "CHF",
        CNY: "¥",
        MXN: "$",
        BRL: "R$",
        INR: "₹",
        RUB: "₽",
        ZAR: "R",
      };

      return currencySymbols[currency] || "$";
    },

    formatCurrency(value: string, currency: CurrencyType, position: 'before' | 'after' = 'after'): string {
      const symbol = this.getCurrencySymbol(currency);
      return position === 'before' ? `${symbol}${value}` : `${value} ${symbol}`;
    },

    convertPrice(price: number, currency: CurrencyType, symbolPosition?: 'before' | 'after'): string {
      const conversionRate = this.getCurrencyConversionRate(currency);
      const converted = price * conversionRate;

      if (Math.abs(converted) < 0.00000001) return this.formatCurrency('0', currency, symbolPosition);

      const formatNumber = (value: number, decimals: number): string => {
        return new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value);
      };

      let formatted: string;
      if (Math.abs(converted) < 0.0001) {
        formatted = formatNumber(converted, 8);
      } else if (Math.abs(converted) >= 10000) {
        formatted = formatNumber(converted, 0);
      } else if (Math.abs(converted) >= 1) {
        formatted = formatNumber(converted, 2);
      } else {
        formatted = formatNumber(converted, 4);
      }
      if (!symbolPosition) return formatted;
      return this.formatCurrency(formatted, currency, symbolPosition);
    },

    convertLargeNumber(value: number, currency: CurrencyType, symbolPosition?: 'before' | 'after'): string {
      const rate = this.getCurrencyConversionRate(currency);
      const converted = value * rate;
      const formatted = converted.toLocaleString('en-US', { maximumFractionDigits: 0 });
      if (!symbolPosition) return formatted;
      return this.formatCurrency(formatted, currency, symbolPosition);
    },

    convertToAbbreviated(value: number, currency: CurrencyType, symbolPosition?: 'before' | 'after'): string {
      const rate = this.getCurrencyConversionRate(currency);
      const converted = value * rate;
    
      let formatted: string;
      if (converted >= 1e12) {
        formatted = (converted / 1e12).toFixed(2) + 'T';
      } else if (converted >= 1e9) {
        formatted = (converted / 1e9).toFixed(2) + 'B';
      } else if (converted >= 1e6) {
        formatted = (converted / 1e6).toFixed(2) + 'M';
      } else if (converted >= 1e3) {
        formatted = (converted / 1e3).toFixed(2) + 'K';
      } else {
        formatted = converted.toFixed(2); // mostrar 2 decimales si es menor a 1000
      }
      if (!symbolPosition) return formatted;
      return this.formatCurrency(formatted, currency, symbolPosition);
    },    

    convertFromUSD(price: number, currency: CurrencyType): string {
      const conversionRate = this.getCurrencyConversionRate(currency);
      let convertedNumber = price * conversionRate;

      // Si el número convertido es 0 o extremadamente cercano a 0, mostramos "0"
      if (Math.abs(convertedNumber) < 0.00000001) {
        const symbol = this.getCurrencySymbol(currency);
        return `0 ${symbol}`;
      }
    
      // Función para formatear el número según las reglas: miles con punto y decimales con coma
      const formatNumber = (number: number, decimals: number): string => {
        return new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(number);
      };
    
      // Si el número es extremadamente pequeño, mantener hasta 8 decimales
      if (Math.abs(convertedNumber) < 0.0001) {
        const formattedNumber = formatNumber(convertedNumber, 8); // Limitar a 8 decimales para valores muy pequeños
        const symbol = this.getCurrencySymbol(currency);
        return `${formattedNumber} ${symbol}`;
      }
    
      // Si el número es mayor o igual a 10,000, no mostrar decimales
      if (Math.abs(convertedNumber) >= 10000) {
        const formattedNumber = formatNumber(convertedNumber, 0); // Eliminar los decimales
        const symbol = this.getCurrencySymbol(currency);
        return `${formattedNumber} ${symbol}`;
      }
    
      // Si el número es mayor o igual a 1, mostrar solo 2 decimales
      if (Math.abs(convertedNumber) >= 1) {
        const formattedNumber = formatNumber(convertedNumber, 2); // Limitar a 2 decimales para números >= 1
        const symbol = this.getCurrencySymbol(currency);
        return `${formattedNumber} ${symbol}`;
      }
    
      // Si el número es menor que 1, mostrar hasta 4 decimales significativos
      const formattedNumber = formatNumber(convertedNumber, 4); // Limitar a 4 decimales para números menores a 1
      const symbol = this.getCurrencySymbol(currency);
      return `${formattedNumber} ${symbol}`;
    },
  }
});

