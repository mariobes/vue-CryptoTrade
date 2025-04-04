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
          text: "#000000",
        },
        dark: {
          background: "#0f0f0f",
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
      const convertedPrice = (price * conversionRate).toFixed(2);
      const symbol = this.getCurrencySymbol(currency);
      return `${convertedPrice} ${symbol}`;
    }
  }
});
