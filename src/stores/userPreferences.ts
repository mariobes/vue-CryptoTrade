import { defineStore } from 'pinia';

export type LanguageType = "ES" | "EN" | "RU" | "FR" | "DE" | "PT" | "PL" | "IT" | "NL" | "SV" | "UK" | "RO" | "SR" | "CS" | "EL" | "HU";
export type CurrencyType = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CNY" | "MXN" | "BRL" | "INR" | "RUB" | "ZAR";
export type ThemeType = "light" | "dark";

export const useUserPreferencesStore = defineStore('userPreferences', {
  state: () => ({
    selectedLanguage: localStorage.getItem('language') as LanguageType || "ES",
    selectedCurrency: localStorage.getItem('currency') as CurrencyType || "USD",
    selectedTheme: localStorage.getItem('theme') as ThemeType || "light",
    showPrices: localStorage.getItem('showPrices') === 'false' ? false : true,
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

    toggleShowPrices() {
      this.showPrices = !this.showPrices;
      localStorage.setItem('showPrices', this.showPrices.toString());
    },

    maskedPrice(value?: number): string {
      if (this.showPrices && value != null) {
        return value.toFixed(2);
      }

      if (value != null) {
        const digitsOnly = value.toFixed(2).replace(/\D/g, '');
        const length = Math.min(Math.max(digitsOnly.length, 4), 10);
        return '*'.repeat(length);
      }
    
      return '****';
    },

    getTheme() {
      const themes = {
        light: {
          background: this.getCssVariable('--background-light'),
          text: this.getCssVariable('--text-color-light'),
          table: this.getCssVariable('--background-table-light'),
          colorGray: this.getCssVariable('--gray-color-light'),
          colorDarkGray: this.getCssVariable('--dark-gray-color-light'),
        },
        dark: {
          background: this.getCssVariable('--background-dark'),
          text: this.getCssVariable('--text-color-dark'),
          table: this.getCssVariable('--background-table-dark'),
          colorGray: this.getCssVariable('--gray-color-dark'),
          colorDarkGray: this.getCssVariable('--dark-gray-color-dark'),
        }
      };

      return themes[this.selectedTheme] || themes.light;
    },

    getCssVariable(variable: string): string {
      return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    },

    getPriceColor(price: number): string {
      if (Math.abs(price) === 0) return 'gray'
      return price > 0 ? 'green' : 'red'
    },

    getArrowDirection(price: number): string {
      if (price === 0) return '';
      return price > 0 ? 'mdi-menu-up' : 'mdi-menu-down';
    },

    getArrowDirectionReverse(price: number): string {
      return price > 0 ? 'mdi-menu-down' : 'mdi-menu-up';
    },

    getLanguages(): LanguageType[] {
      return ["ES", "EN", "RU", "FR", "DE", "PT", "PL", "IT", "NL", "SV", "UK", "RO", "SR", "CS", "EL", "HU"];
    },
    
    getLanguageLabel(language: LanguageType): string {
      const languageLabels: { [key in LanguageType]: string } = {
        ES: "Español",
        EN: "English",
        RU: "Русский",
        FR: "Français",
        DE: "Deutsch",
        PT: "Português",
        PL: "Polski",
        IT: "Italiano",
        NL: "Nederlands",
        SV: "Svenska",
        UK: "Українська",
        RO: "Română",
        SR: "Srpski",
        CS: "Čeština",
        EL: "Ελληνικά",
        HU: "Magyar",
      };
      return languageLabels[language] || language;
    },

    getCurrencies(): CurrencyType[] {
      return ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CNY", "MXN", "BRL", "INR", "RUB", "ZAR"];
    },

    getCurrencyText(currency: CurrencyType): string {
      const currencyTexts: { [key in CurrencyType]: string } = {
        USD: "United States Dollar",
        EUR: "Euro",
        GBP: "Pound Sterling",
        JPY: "Japanese Yen",
        CAD: "Canadian Dollar",
        AUD: "Australian Dollar",
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
        CAD: "$",
        AUD: "$",
        CNY: "¥",
        MXN: "$",
        BRL: "$",
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

    convertPrice(price: number, currency: CurrencyType, symbolPosition?: 'before' | 'after', maskPrices : boolean = false): string {
      if (maskPrices && !this.showPrices) {
        return this.maskedPrice(price);
      }

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

    getConvertedPrice(price: number, currency: CurrencyType): number {
      const rate = this.getCurrencyConversionRate(currency)
      return price * rate
    },

    normalizeInputAmount(amount: number, currency: CurrencyType): string {
      const conversionRate = this.getCurrencyConversionRate(currency);
      const normalized = amount * (1 / conversionRate);
      return normalized.toFixed(2);
    },

    convertPriceFullDecimals(price: number, currency: CurrencyType, symbolPosition?: 'before' | 'after'): string {
      const conversionRate = this.getCurrencyConversionRate(currency);
      const converted = price * conversionRate;
    
      if (!Number.isFinite(converted)) return this.formatCurrency('0', currency, symbolPosition);
    
      const formatted = converted.toString();
    
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
        formatted = converted.toFixed(2);
      }
      if (!symbolPosition) return formatted;
      return this.formatCurrency(formatted, currency, symbolPosition);
    },

    convertAssetAmount(amount: number, maskPrices : boolean = false): string {
      if (maskPrices && !this.showPrices) {
        return this.maskedPrice(amount);
      }

      if (!Number.isFinite(amount)) return '0.0000';
    
      if (amount >= 1_000_000) {
        return amount.toFixed(0);
      } else if (amount >= 1) {
        return amount.toFixed(2);
      } else if (amount > 0) {
        const decimalStr = amount.toFixed(8);
        const trimmed = decimalStr.replace(/0+$/, '');
        const [_, decimals = ''] = trimmed.split('.');
        const visibleDecimals = Math.min(Math.max(decimals.length, 4), 8);
        return amount.toFixed(visibleDecimals);
      } else {
        return '0.0000';
      }
    },

    showDefaultAssetImage(stock: any) {
      stock.image = '/src/assets/asset-default.png';
    },
  }
});

