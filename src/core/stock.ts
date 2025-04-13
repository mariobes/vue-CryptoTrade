export interface Stock {
    id: string
    companyName: string
    symbol: string
    price: number
    mktCap: number
    sector: string,
    industry: string,
    lastDiv: number,
    volAvg: number,
    exchange: string,
    exchangeShortName: string,
    country: string,
    changes: number,
    changesPercentage: number,
    currency: string
    isin: string,
    website: string,
    description: string,
    ceo: string,
    image: string    
    lastUpdated: Date
}