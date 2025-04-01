export interface Stock {
    id: string
    name: string
    symbol: string
    price: number
    marketCap: number
    sector: string,
    industry: string,
    lastAnnualDividend: number,
    volume: number,
    exchange: string,
    exchangeShortName: string,
    country: string,
    changes: number,
    isin: string,
    website: string,
    description: string,
    ceo: string,
    image: string    
    lastUpdated: Date
}