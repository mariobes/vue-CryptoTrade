import { defineStore } from 'pinia';

export type LanguageType = "ES" | "EN";
export type CurrencyType = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "MXN" | "BRL" | "INR" | "RUB" | "ZAR";
export type ThemeType = "light" | "dark";

export const useUserPreferencesStore = defineStore('userPreferences', {
  state: () => ({
    selectedLanguage: "ES" as LanguageType, 
    selectedCurrency: "USD" as CurrencyType,
    selectedTheme: "dark" as ThemeType,
  }),

  actions: {
    setSelectedLanguage(language: LanguageType) {
      this.selectedLanguage = language;
    },

    setSelectedCurrency(currency: CurrencyType) {
      this.selectedCurrency = currency;
    },

    setSelectedTheme(theme: ThemeType) {
      this.selectedTheme = theme;
    },

    getTheme() {
      const themes = {
        light: {
          background: "#f8f9fa",
          background_table: "#e9ecef",
          text: "#000000",
        },
        dark: {
          background: "#0f0f0f",
          background_table: "#8080802a",
          text: "#ffffff",
        }
      };

      return themes[this.selectedTheme] || themes.light;
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
    }
  }
});
